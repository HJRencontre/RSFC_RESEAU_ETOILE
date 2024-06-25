import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { verifyToken } from '../verifyToken';

/**
 * @swagger
 * /api/partner/{id}:
 *   get:
 *     tags: ['partners']
 *     summary: Get a partner
 *     description: Retrieves a partner by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
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
 *   delete:
 *     tags: ['partners']
 *     summary: Delete a partner
 *     description: Deletes a partner by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the partner
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Le partenaire à bien été supprimé."
 *       500:
 *         description: Error message
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
        const { id } = req.query

        if (typeof id === 'string') {
            if (req.method === 'GET') {
                
                const result = await sql`SELECT * FROM partners WHERE is_deleted = false AND id = ${id}`;

                if (result.rowCount === 0) {
                    return res.status(500).json('Le partenaire n\'existe pas');
                }
                const rows = result.rows
                const partner = rows[0]
    
                return res.status(200).json({ partner });
            }
            if (req.method === 'DELETE') {
    
                const result    = await sql`UPDATE partners SET is_deleted = true WHERE id = ${id}`
                const rows      = result.rows
    
                return res.status(200).json('Le partenaire à bien été supprimé.')
            }
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export default verifyToken(handler, 'ADMIN');