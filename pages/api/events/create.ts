import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../verifyToken';
import { sql } from '@vercel/postgres';

/**
 * @swagger
 * /api/events/create:
 *   post:
 *     tags: ['events']
 *     summary: Create a new event
 *     description: Creates a new event with the given details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Year Celebration"
 *               description:
 *                 type: string
 *                 example: "Celebration to welcome the new year."
 *               start_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-31T23:59:59Z"
 *               end_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-01T01:00:00Z"
 *             required:
 *               - title
 *               - start_at
 *     responses:
 *       200:
 *         description: Event successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "L'évènement à bien été créé"
 *       401:
 *         description: Unauthorized or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               examples:
 *                 missingTitle:
 *                   summary: Missing Title
 *                   value: "Nous avons besoin d'un titre pour créer ce type de données"
 *                 missingStartAt:
 *                   summary: Missing Start Date
 *                   value: "Nous avons besoin d'une date de début pour créer ce type de données"
 *       500:
 *         description: Server error or method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               examples:
 *                 methodNotAllowed:
 *                   summary: Method Not Allowed
 *                   value: "La route n'acceptes que les POST"
 *                 serverError:
 *                   summary: Server Error
 *                   value: "Internal Server Error"
 */

const handler = async(
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    try {
        if (req.method === 'POST') {
            const { title, description, start_at, end_at  } = req.body
            
            if (title === '' || typeof title === 'undefined') {
                return res.status(401).json('Nous avons besoin d\'un titre pour créer ce type de données')
            }
            
            if (start_at === '' || typeof start_at === 'undefined') {
                return res.status(401).json('Nous avons besoin d\'une date de début pour créer ce type de données')
            }
            
            const result = await sql`INSERT INTO events (title, description, start_at, end_at ) VALUES (${title}, ${description}, ${start_at}, ${end_at }) RETURNING id`
            
            return res.status(200).json('L\'évènement à bien été créée')
        }
        else {
            return res.status(500).json( 'La route n\'acceptes que les POST' )
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}

export default verifyToken(handler, 'ADMIN');