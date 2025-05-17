import { NextApiRequest, NextApiResponse } from 'next';
import { loginUser } from '@/services/authService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, password, role } = req.body;

    if (!id || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await loginUser(id, password, role);

    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 