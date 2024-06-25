import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../verifyToken';
import { sql } from '@vercel/postgres';
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
 *               password:
 *                 type: string
 *                 example: 654321
 *               confirm_password:
 *                 type: string
 *                 example: 654321
 *             required:
 *               - password
 *               - confirm_password
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


const handler = async (
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    try {
        const { id } = req.query

        if (typeof id === 'string') {
            if (req.method === 'GET') {
                
                const result = await sql`SELECT * FROM users WHERE is_deleted = false AND id = ${id}`;

                if (result.rowCount === 0) {
                    return res.status(500).json('L\'utilisateur n\'existe pas');
                }
                const rows = result.rows
                const partner = rows[0]
    
                return res.status(200).json({ partner });
            }
            if (req.method === 'DELETE') {
    
                const result    = await sql`UPDATE users SET is_deleted = true WHERE id = ${id}`
                const rows      = result.rows
    
                return res.status(200).json('L\'utilisateur à bien été supprimé.')
            }
            if (req.method === 'PUT') {
                
                const { password, confirm_password } = req.body

                if (!password || !confirm_password) {
                    return res.status(401).json('Il manque un paramètre');
                }

                if (password != confirm_password) {
                    return res.status(401).json('Les deux mots de passes ne correspondent pas');
                }

                bcrypt.hash(password, 10, async (err, hash) => {
                    if (err) {
                        console.error('Erreur lors du hachage du mot de passe:', err)
                        return
                    }
    
                    const result = await sql`UPDATE users SET password = ${hash} WHERE id = ${id}`
    
                    return res.status(200).json('L\'utilisateur à bien été modifié')
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export default verifyToken(handler, 'ADMIN');