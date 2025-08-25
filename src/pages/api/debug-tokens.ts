import type { NextApiRequest, NextApiResponse } from 'next';
import TokenManager from '../../lib/tokenManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const tokenManager = TokenManager.getInstance();
  const tokens = tokenManager.getAllTokens();

  res.status(200).json({
    totalTokens: tokens.length,
    tokens: tokens.map(t => ({
      masked: t.token.substring(0, 20) + '...',
      platform: t.deviceInfo?.platform,
      registeredAt: t.registeredAt
    }))
  });
}