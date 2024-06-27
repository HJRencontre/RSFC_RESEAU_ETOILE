import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import { verifyToken } from "../verifyToken";

/**
 * @swagger
 * /api/business_segments/{id}:
 *   get:
 *     tags: ['business_segments']
 *     summary: Get a business segment
 *     description: Retrieves a business segment by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the business segment
 *     responses:
 *       200:
 *         description: A business segment object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 businessSegment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     name:
 *                       type: string
 *                       example: "Technology"
 *                     description:
 *                       type: string
 *                       example: "Technology-related businesses"
 *                     is_deleted:
 *                       type: boolean
 *                       example: false
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Le type de métier n'existe pas"
 *   delete:
 *     tags: ['business_segments']
 *     summary: Delete a business segment
 *     description: Deletes a business segment by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the business segment
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Le type de métier à bien été supprimé."
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
          await sql`SELECT * FROM business_segments WHERE is_deleted = false AND id = ${id}`;

        if (result.rowCount === 0) {
          return res.status(500).json("Le type de métier n'existe pas");
        }
        const rows = result.rows;
        const partner = rows[0];

        return res.status(200).json({ partner });
      }
      if (req.method === "DELETE") {
        const result =
          await sql`UPDATE business_segments SET is_deleted = true WHERE id = ${id}`;
        const rows = result.rows;

        return res.status(200).json("Le type de métier à bien été supprimé.");
      }
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default verifyToken(handler, "ADMIN");
