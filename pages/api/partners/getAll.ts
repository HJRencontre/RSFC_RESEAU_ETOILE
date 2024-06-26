import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../verifyToken';
import { sql } from '@vercel/postgres';

/**
 * @swagger
 * /api/partners/getAll:
 *   get:
 *     tags: ['partners']
 *     summary: Get all partners
 *     description: Returns a list of all partners who are not deleted.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order by ID in ascending or descending order
 *     responses:
 *       200:
 *         description: A list of partners
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
 *                       name:
 *                         type: string
 *                         example: "Partner Name"
 *                       website:
 *                         type: string
 *                         example: "https://partner-website.com"
 *                       description:
 *                         type: string
 *                         example: "This is a partner description."
 *                       user_id:
 *                         type: string
 *                         example: "1"
 *                       business_segment_id:
 *                         type: string
 *                         example: "2"
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
            const { name } = req.query;
            let orderClause = '';

            if (name === 'asc') {
                orderClause = 'ORDER BY name ASC';
            } else if (name === 'desc') {
                orderClause = 'ORDER BY name DESC';
            }

            // Construct the query dynamically
            const query = `SELECT * FROM partners WHERE is_deleted = false ${orderClause}`;
            const result = await sql.query(query);
            const rows = result.rows;
            return res.status(200).json({ rows });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export default verifyToken(handler);
