import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { verifyToken } from '../verifyToken';

/**
 * @swagger
 * /api/offers/{id}:
 *   get:
 *     tags: ['offers']
 *     summary: Get an offer
 *     description: Retrieves an offer by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the offer
 *     responses:
 *       200:
 *         description: An offer object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 offer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     title:
 *                       type: string
 *                       example: "Offer Title"
 *                     description:
 *                       type: string
 *                       example: "Offer Description"
 *                     is_deleted:
 *                       type: boolean
 *                       example: false
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "L'offre n'existe pas"
 *   delete:
 *     tags: ['offers']
 *     summary: Delete an offer
 *     description: Deletes an offer by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the offer
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "L'offre à bien été supprimée."
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 *   put:
 *     tags: ['offers']
 *     summary: Update an offer
 *     description: Updates an offer by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the offer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: "New Label"
 *               discount_amount:
 *                 type: number
 *                 example: 10
 *               description:
 *                 type: string
 *                 example: "New description"
 *               discount_type:
 *                 type: string
 *                 example: "percentage"
 *               partner_id:
 *                 type: string
 *                 example: "partner123"
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "L'offre à bien été modifiée."
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */

/**
 * @swagger
 * /api/offers/{id}:
 *   get:
 *     tags: ['offers']
 *     summary: Get an offer
 *     description: Retrieves an offer by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the offer
 *     responses:
 *       200:
 *         description: An offer object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 offer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     title:
 *                       type: string
 *                       example: "Offer Title"
 *                     description:
 *                       type: string
 *                       example: "Offer Description"
 *                     is_deleted:
 *                       type: boolean
 *                       example: false
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "L'offre n'existe pas"
 *   delete:
 *     tags: ['offers']
 *     summary: Delete an offer
 *     description: Deletes an offer by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the offer
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "L'offre à bien été supprimée."
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    if (typeof id === "string") {
      if (req.method === "GET") {
        const result =
          await sql`SELECT * FROM offers WHERE is_deleted = false AND id = ${id}`;

        if (result.rowCount === 0) {
          return res.status(500).json("L'offre n'existe pas");
        }
        const rows = result.rows;
        const partner = rows[0];

        return res.status(200).json({ partner });
      }
      if (req.method === "DELETE") {
        const result =
          await sql`UPDATE offers SET is_deleted = true WHERE id = ${id}`;
        const rows = result.rows;

        return res.status(200).json("L'offre à bien été supprimée.");
      }
      if (req.method === "PUT") {
        const { label, discount_amount, description, discount_type, partner_id } =
        req.body;

        const result = await sql`UPDATE offers 
        SET
        label = ${label},
        discount_amount = ${discount_amount},
        description = ${description},
        discount_type = ${discount_type},
        partner_id = ${partner_id}
        WHERE id = ${id} AND is_deleted = false`;

        return res.status(200).json("L'offre à bien été modifiée.");
      }
        
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default verifyToken(handler);
