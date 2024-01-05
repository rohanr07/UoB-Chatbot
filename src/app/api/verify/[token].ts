import { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/utils/mongodb';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token not provided' });
    }

    await connect();

    try {
      const user = await User.findOneAndUpdate(
        { verificationToken: token, isVerified: false },
        { $set: { isVerified: true, verificationToken: null } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'Invalid or expired token' });
      }

      return res.status(200).json({ message: 'Email verification successful' });
    } catch (error) {
      console.error('Error verifying email:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
