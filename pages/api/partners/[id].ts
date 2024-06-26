import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { verifyToken } from '../verifyToken';

/**
 * @swagger
 * /api/partners/{id}:
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
 *   patch:
 *     tags: ['partners']
 *     summary: Update a partner
 *     description: Updates a partner by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the partner
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Partner Name"
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Le partenaire à bien été mis à jour."
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
        const { id } = req.query;

        if (typeof id === 'string') {
            if (req.method === 'GET') {
                const result = await sql`SELECT * FROM partners WHERE is_deleted = false AND id = ${id}`;

                if (result.rowCount === 0) {
                    return res.status(500).json('Le partenaire n\'existe pas');
                }
                const rows = result.rows;
                const partner = rows[0];

                return res.status(200).json({ partner });
            }

            if (req.method === 'DELETE') {
                await sql`UPDATE partners SET is_deleted = true WHERE id = ${id}`;

                return res.status(200).json('Le partenaire à bien été supprimé.');
            }

            if (req.method === 'PATCH') {
                const { name, website, description, user_id, business_segment_id  } = req.body

                if (!name) {
                    return res.status(400).json('Le nom est requis.');
                }

                const result = await sql`
                UPDATE partners
                SET
                  name = ${name},
                  website = ${website},
                  description = ${description},
                  user_id = ${user_id},
                  business_segment_id = ${business_segment_id}
                WHERE id = ${id} AND is_deleted = false;
              `;
              
                if (result.rowCount === 0) {
                    return res.status(500).json('Le partenaire n\'existe pas ou a été supprimé.');
                }

                return res.status(200).json('Le partenaire à bien été mis à jour.');
            }
        } else {
            return res.status(400).json('ID invalide.');
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default verifyToken(handler, 'ADMIN');
