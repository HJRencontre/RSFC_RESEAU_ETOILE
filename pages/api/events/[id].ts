import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { verifyToken } from '../verifyToken';

/**
 * @swagger
 * /api/event/{id}:
 *   get:
 *     tags: ['events']
 *     summary: Get an event
 *     description: Retrieves an event by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event
 *     responses:
 *       200:
 *         description: An event object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     name:
 *                       type: string
 *                       example: "Event Name"
 *                     description:
 *                       type: string
 *                       example: "Event Description"
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00Z"
 *                     is_deleted:
 *                       type: boolean
 *                       example: false
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "L'évènement n'existe pas"
 *   delete:
 *     tags: ['events']
 *     summary: Delete an event
 *     description: Deletes an event by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "L'évènement à bien été supprimé."
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
                
                const result = await sql`SELECT * FROM events WHERE is_deleted = false AND id = ${id}`;

                if (result.rowCount === 0) {
                    return res.status(500).json('L\'évènement n\'existe pas');
                }
                const rows = result.rows
                const partner = rows[0]
    
                return res.status(200).json({ partner });
            }
            if (req.method === 'DELETE') {
    
                const result    = await sql`UPDATE events SET is_deleted = true WHERE id = ${id}`
                const rows      = result.rows
    
                return res.status(200).json('L\'évènement à bien été supprimé.')
            }
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export default verifyToken(handler, 'ADMIN');