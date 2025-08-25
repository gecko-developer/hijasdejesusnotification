import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Get all user tokens from Firestore
    const tokensSnapshot = await db.collection('user_tokens').get();
    
    const tokens = tokensSnapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        id: index,
        userId: doc.id,
        token: data.fcm_token,
        masked: data.fcm_token ? `${data.fcm_token.substring(0, 20)}...${data.fcm_token.substring(data.fcm_token.length - 10)}` : 'No token',
        email: data.email,
        platform: data.device_info?.platform,
        registeredAt: data.updated_at?.toDate()?.toISOString() || 'Unknown',
        rfidCards: data.rfidCards || []
      };
    });

    res.status(200).json({ 
      tokens, 
      count: tokens.length,
      source: 'Firestore'
    });
    return;
  } catch (error) {
    console.error('❌ Error fetching tokens from Firestore:', error);
    res.status(500).json({ error: 'Failed to fetch tokens from Firestore' });
    return;
  }
}