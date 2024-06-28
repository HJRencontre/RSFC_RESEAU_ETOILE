import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import { verifyToken } from "../verifyToken";
import bcrypt from 'bcryptjs';

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: ['users']
 *     summary: Get user by ID
 *     description: Retrieves a user by their ID if they are not deleted.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A user object
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
 *                     firstname:
 *                       type: string
 *                       example: "John"
 *                     lastname:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *       500:
 *         description: User not found or server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               examples:
 *                 userNotFound:
 *                   summary: User Not Found
 *                   value: "L'utilisateur n'existe pas"
 *                 serverError:
 *                   summary: Server Error
 *                   value: "Internal Server Error"
 *   delete:
 *     tags: ['users']
 *     summary: Delete user by ID
 *     description: Marks a user as deleted by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "L'utilisateur à bien été supprimé."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 *   put:
 *     tags: ['users']
 *     summary: Edit user's password
 *     description: CHange user password.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *                 example: 654321
 *               new_password:
 *                 type: string
 *                 example: 654321
 *             required:
 *               - old_password
 *               - new_password
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User successfully edited
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "L'utilisateur à bien été modifié"
 *       500:
 *         description: Server error
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
          await sql`SELECT * FROM users WHERE is_deleted = false AND id = ${id}`;

        if (result.rowCount === 0) {
          return res.status(500).json("L'utilisateur n'existe pas");
        }
        const rows = result.rows;
        const partner = rows[0];

        return res.status(200).json({ partner });
      }
      if (req.method === "DELETE") {
        const result =
          await sql`UPDATE users SET is_deleted = true WHERE id = ${id}`;
        const rows = result.rows;

        return res.status(200).json("L'utilisateur à bien été supprimé.");
      }
      if (req.method === "PUT") {
        let { firstname, lastname, old_password, new_password, phone_number, email } = req.body;
        const getCurrentUser = await sql`SELECT * FROM users WHERE is_deleted = false AND id = ${id}`;
        const rows = getCurrentUser.rows;
        const currentUser = rows[0];

        if (!firstname) {
          firstname = currentUser.firstname
        }
        if (!lastname) {
          lastname = currentUser.lastname
        }
        if (!phone_number) {
          phone_number = currentUser.phone_number
        }
        if (!email) {
          email = currentUser.email
        }

        // Hash the password if provided
        if (old_password && new_password) {
          const isPasswordMatch   = await bcrypt.compare(old_password, currentUser.password)

                if (!isPasswordMatch) {
                    return res.status(401).json('L\'ancien mot de passe ne correspond pas.');
                }

                if (old_password === new_password) {
                    return res.status(401).json('Les deux mots de passes sont identiques.');
                }

                bcrypt.hash(new_password, 10, async (err, hash) => {
                    if (err) {
                        console.error('Erreur lors du hachage du mot de passe:', err)
                        return
                    }
    
                    const result = await sql`UPDATE users
                                              SET
                                              firstname = ${firstname},
                                              lastname = ${lastname},
                                              phone_number = ${phone_number},
                                              email = ${email},
                                              password = ${hash},
                                              WHERE id = ${id} AND is_deleted = false`;
    
                    return res.status(200).json('L\'utilisateur à bien été modifié')
                });
        }
        
        const result = await sql`UPDATE users
        SET
        firstname = ${firstname},
        lastname = ${lastname},
        phone_number = ${phone_number},
        email = ${email},
        WHERE id = ${id} AND is_deleted = false`;

        return res.status(200).json("L'utilisateur à bien été modifié.");
      }
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default verifyToken(handler, "ADMIN");
