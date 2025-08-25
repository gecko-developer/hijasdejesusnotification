import type { NextApiRequest, NextApiResponse } from 'next';
import { db, messaging } from '../../lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { token, title, body, sendToAll } = req.body;
  
  if (!title || !body) {
    res.status(400).json({ error: 'Missing title or body' });
    return;
  }

  try {
    if (sendToAll) {
      // Get all FCM tokens from Firestore only
      const tokensSnapshot = await db.collection('user_tokens')
        .where('fcm_token', '!=', null)
        .get();
      
      console.log(`📤 Found ${tokensSnapshot.size} users with FCM tokens in Firestore`);
      
      if (tokensSnapshot.empty) {
        res.status(400).json({ error: 'No devices registered in Firestore' });
        return;
      }

      const results = [];
      const errors = [];
      
      for (const doc of tokensSnapshot.docs) {
        const userData = doc.data();
        const fcmToken = userData.fcm_token;
        
        try {
          const message = {
            token: fcmToken,
            notification: { title, body },
            data: {
              timestamp: new Date().toISOString(),
              type: 'broadcast'
            }
          };
          
          const response = await messaging.send(message);
          results.push({ 
            userId: doc.id,
            email: userData.email,
            success: true, 
            messageId: response 
          });
        } catch (error) {
          console.error(`❌ Failed to send to ${userData.email}:`, error);
          errors.push({ 
            userId: doc.id,
            email: userData.email,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }
      
      console.log(`✅ Sent to ${results.length} devices, ${errors.length} failed`);
      
      res.status(200).json({ 
        success: true, 
        results, 
        errors,
        sentTo: results.length,
        failed: errors.length 
      });
      return;
    } else if (token) {
      // Send to specific token
      const message = {
        token,
        notification: { title, body },
        data: {
          timestamp: new Date().toISOString(),
          type: 'direct'
        }
      };
      
      const response = await messaging.send(message);
      res.status(200).json({ success: true, messageId: response });
      return;
    } else {
      res.status(400).json({ error: 'Missing token or sendToAll flag' });
      return;
    }
  } catch (error) {
    console.error('Send FCM Error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    return;
  }
}