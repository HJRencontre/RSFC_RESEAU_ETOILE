import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../verifyToken';
import { sql } from '@vercel/postgres';

/**
 * @swagger
 * /api/business-segments/getAll:
 *   get:
 *     tags: ['business_segments']
 *     summary: Get all business segments
 *     description: Returns a list of all business segments that are not deleted.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of business segments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1"
 *                       label:
 *                         type: string
 *                         example: "Technology"
 *                       description:
 *                         type: string
 *                         example: "Technology-related businesses"
 *                       is_deleted:
 *                         type: boolean
 *                         example: false
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    try {
        if (req.method === 'GET') {
            const result = await sql`SELECT * FROM business_segments WHERE is_deleted = false`;
            const rows = result.rows

            return res.status(200).json({ rows });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export default verifyToken(handler);