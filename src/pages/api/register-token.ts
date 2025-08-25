import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { token, user_id, email, deviceInfo } = req.body;
  
  if (!token) {
    res.status(400).json({ error: 'Missing FCM token' });
    return;
  }

  if (!user_id) {
    res.status(400).json({ error: 'Missing user_id' });
    return;
  }

  try {
    // Save directly to Firestore
    await db.collection('user_tokens').doc(user_id).set({
      fcm_token: token,
      user_id,
      email,
      device_info: deviceInfo,
      updated_at: new Date()
    }, { merge: true });
    
    console.log(`✅ Token saved to Firestore for ${email}: ${token.substring(0, 20)}...`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Token registered successfully in Firestore'
    });
    return;
  } catch (error) {
    console.error('❌ Firestore registration error:', error);
    res.status(500).json({ error: 'Failed to register token in Firestore' });
    return;
  }
}