import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: ['users']
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               examples:
 *                 invalidCredentials:
 *                   summary: Invalid Credentials
 *                   value: { error: 'Email ou mot de passe incorrect' }
 *                 userDeleted:
 *                   summary: User Deleted
 *                   value: { error: 'Utilisateur supprimé' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               examples:
 *                 jwtSecretMissing:
 *                   summary: JWT Secret Missing
 *                   value: { error: 'JWT_SECRET manquant' }
 *                 serverError:
 *                   summary: Server Error
 *                   value: { error: 'Internal Server Error' }
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { email, password } = req.body;

      const result = await sql`SELECT * FROM users WHERE email = ${email}`;

      if (result.rows.length === 0) {
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      const user = result.rows[0];
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      if (user.is_deleted) {
        return res.status(401).json({ error: "Utilisateur supprimé" });
      }

      if (process.env.JWT_SECRET) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "8h",
        });
        res.status(200).json({ token, user });
      } else {
        return res.status(500).json({ error: "JWT_SECRET manquant" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
}
