import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../verifyToken';
import { sql } from '@vercel/postgres';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    try {
        if (req.method === 'GET') {
            const result = await sql`SELECT * FROM partner_contacts WHERE is_deleted = false`;
            const rows = result.rows

            return res.status(200).json({ rows });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export default verifyToken(handler);