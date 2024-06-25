import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../verifyToken';
import { sql } from '@vercel/postgres';

/**
 * @swagger
 * /api/events/getAll:
 *   get:
 *     tags: ['events']
 *     summary: Get all events
 *     description: Returns a list of all events that are not deleted.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of events
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
 *                       title:
 *                         type: string
 *                         example: "New Year Celebration"
 *                       description:
 *                         type: string
 *                         example: "Celebration to welcome the new year."
 *                       start_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-12-31T23:59:59Z"
 *                       end_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-01T01:00:00Z"
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
            const result = await sql`SELECT * FROM events WHERE is_deleted = false`;
            const rows = result.rows

            return res.status(200).json({ rows });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export default verifyToken(handler);