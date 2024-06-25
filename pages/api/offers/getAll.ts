import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../verifyToken';
import { sql } from '@vercel/postgres';


/**
 * @swagger
 * /api/offers/getAll:
 *   get:
 *     tags: ['offers']
 *     summary: Get all offers
 *     description: Returns a list of all offers that are not deleted.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of offers
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
 *                         example: "Special Discount"
 *                       discount_amount:
 *                         type: number
 *                         example: 20
 *                       description:
 *                         type: string
 *                         example: "This is a special discount offer."
 *                       discount_type:
 *                         type: string
 *                         example: "percentage"
 *                       partner_id:
 *                         type: string
 *                         example: "1"
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
            const result = await sql`SELECT * FROM offers WHERE is_deleted = false`;
            const rows = result.rows

            return res.status(200).json({ rows });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export default verifyToken(handler);