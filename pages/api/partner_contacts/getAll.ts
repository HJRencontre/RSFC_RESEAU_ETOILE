import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../verifyToken';
import { sql } from '@vercel/postgres';

/**
 * @swagger
 * /api/partner-contacts/getAll:
 *   get:
 *     tags: ['partners_contacts']
 *     summary: Get all partner contact requests
 *     description: Returns a list of all partner contact requests that are not deleted.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of partner contact requests
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
 *                       contacting_partner_id:
 *                         type: string
 *                         example: "1"
 *                       contacted_partner_id:
 *                         type: string
 *                         example: "2"
 *                       offer_id:
 *                         type: string
 *                         example: "3"
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
            const result = await sql`SELECT * FROM partner_contacts WHERE is_deleted = false`;
            const rows = result.rows

            return res.status(200).json({ rows });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export default verifyToken(handler);