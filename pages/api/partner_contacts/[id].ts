import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { verifyToken } from '../verifyToken';


/**
 * @swagger
 * /api/partner-contact/{id}:
 *   get:
 *     tags: ['partners_contacts']
 *     summary: Get a partner contact
 *     description: Retrieves a partner contact by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the partner contact
 *     responses:
 *       200:
 *         description: A partner contact object
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
 *                     partner_id:
 *                       type: string
 *                       example: "1"
 *                     contact_name:
 *                       type: string
 *                       example: "John Doe"
 *                     contact_email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     is_deleted:
 *                       type: boolean
 *                       example: false
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "La demande de contact n'existe pas"
 *   delete:
 *     tags: ['partners_contacts']
 *     summary: Delete a partner contact
 *     description: Deletes a partner contact by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the partner contact
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "La demande de contact à bien été supprimée."
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
                
                const result = await sql`SELECT * FROM partner_contacts WHERE is_deleted = false AND id = ${id}`;

                if (result.rowCount === 0) {
                    return res.status(500).json('La demande de contact n\'existe pas');
                }
                const rows = result.rows
                const partner = rows[0]
    
                return res.status(200).json({ partner });
            }
            if (req.method === 'DELETE') {
    
                const result    = await sql`UPDATE partner_contacts SET is_deleted = true WHERE id = ${id}`
                const rows      = result.rows
    
                return res.status(200).json('La demande de contact à bien été supprimée.')
            }
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export default verifyToken(handler);