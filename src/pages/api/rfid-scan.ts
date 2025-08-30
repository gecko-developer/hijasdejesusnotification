// src/pages/api/rfid-scan.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db, messaging } from '../../lib/firebaseAdmin';
import { rateLimit } from '../../lib/rateLimiter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  if (!rateLimit(ip as string, 20, 60000)) { // 20 requests per minute
    res.status(429).json({ error: 'Too many requests' });
    return;
  }

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
    ? 'https://hijasdejesusnotification.vercel.app' 
    : '*'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { rfidId, location, message, title } = req.body;

    if (!rfidId) {
      res.status(400).json({ error: 'RFID ID is required' });
      return;
    }

    console.log(`🔍 Looking for RFID card: ${rfidId}`);

    // Find user with this RFID card in Firestore
    const userQuery = await db.collection('user_tokens')
      .where('rfidCards', 'array-contains', rfidId)
      .get();

    if (userQuery.empty) {
      console.log(`❌ No user found for RFID: ${rfidId}`);
      res.status(404).json({ error: 'No user found for this RFID card' });
      return;
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    const fcmToken = userData.fcm_token;

    if (!fcmToken) {
      console.log(`❌ No FCM token for user: ${userData.email}`);
      res.status(404).json({ error: 'No FCM token found for user' });
      return;
    }

    // Send notification using Firebase Admin
    const notificationMessage = {
      token: fcmToken,
      notification: {
        title: title || 'RFID Card Scanned',
        body: message || `Your RFID card was scanned at ${location || 'unknown location'}`,
      },
      data: {
        rfidId: rfidId,
        location: location || '',
        timestamp: new Date().toISOString(),
        type: 'rfid_scan'
      }
    };

    const response = await messaging.send(notificationMessage);
    
    // Log the scan event to Firestore
    await db.collection('rfid_scans').add({
      rfidId,
      userId: userDoc.id,
      userEmail: userData.email,
      location: location || null,
      timestamp: new Date(),
      notificationSent: true,
      messageId: response
    });

    console.log(`✅ RFID notification sent to ${userData.email}`);
    
    res.status(200).json({ 
      success: true, 
      messageId: response,
      message: 'Notification sent successfully',
      user: userData.email
    });
    return;

  } catch (error) {
    console.error('❌ RFID scan error:', error);
    res.status(500).json({ 
      error: 'Failed to send notification',
      details: error instanceof Error ? error.message : String(error)
    });
    return;
  }
}