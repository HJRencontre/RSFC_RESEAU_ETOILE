import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../verifyToken';
import { sql } from '@vercel/postgres';
import jwt, { Secret } from 'jsonwebtoken';

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags: ['users']
 *     summary: Get self user
 *     description: Retrieves self user.
 *     security:
 *       - bearerAuth: []
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
 */


const handler = async (
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    if (req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({ error: 'No token provided' })
        }

        if(!process.env.JWT_SECRET){
            return res.status(500).json({ error: 'No JWT secret set' })
        }

        try {
            if (process.env.JWT_SECRET) {

                const decoded = jwt.verify(token, <Secret>process.env.JWT_SECRET)

                if (typeof decoded !== 'string') {
                    const userId = decoded.userId;
        
                    const result    = await sql`SELECT * FROM users WHERE id = ${userId}`;
                    const rows      = result.rows
                    const user      = rows[0]
        
                    if (user) {
                        return res.status(200).json({ user });
                    }
                }
            }
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' })
        }
    }

    return res.status(500).json('Route en GET uniquement')
}

export default verifyToken(handler);