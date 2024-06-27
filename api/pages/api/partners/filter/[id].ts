import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../verifyToken';
import { sql } from '@vercel/postgres';

/**
 * @swagger
 * /api/partners/filter/{id}:
 *   get:
 *     tags: ['partners']
 *     summary: Get a partner
 *     description: Retrieves a partner by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the partner
 *     responses:
 *       200:
 *         description: A partner object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 partner:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     name:
 *                       type: string
 *                       example: "Partner Name"
 *                     is_deleted:
 *                       type: boolean
 *                       example: false
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Le partenaire n'existe pas"
 *   
 */

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    try {
        if (req.method === 'GET') {
            // Extract the business segment ID from query parameters
            const { id } = req.query;

            // Check if the id parameter is provided
            if (!id) {
                return res.status(400).json({ error: 'Business segment ID is required' });
            }

            // Convert id to integer if necessary
            const segmentId = parseInt(id as string, 10);
            if (isNaN(segmentId)) {
                return res.status(400).json({ error: 'Invalid business segment ID' });
            }

            const result = await sql`
                SELECT *
                FROM partners
                WHERE is_deleted = false AND business_segment_id = ${segmentId}
            `;
            const rows = result.rows;

            return res.status(200).json({ rows });
        } else {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default verifyToken(handler);