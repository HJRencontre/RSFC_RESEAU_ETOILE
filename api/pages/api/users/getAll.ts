import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import { verifyToken } from "../verifyToken";

/**
 * @swagger
 * /api/users/getAll:
 *   get:
 *     tags: ['users']
 *     summary: Get all users
 *     description: Returns a list of all users who are not deleted.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
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
 *                       firstname:
 *                         type: string
 *                         example: John
 *                       lastname:
 *                         type: string
 *                         example: Doe
 *                       email:
 *                         type: string
 *                         example: john.doe@example.com
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      const result =
        await sql`SELECT firstname, lastname, email FROM users WHERE is_deleted = false`;
      const rows = result.rows;

      return res.status(200).json({ rows });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default verifyToken(handler);
