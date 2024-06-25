import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../verifyToken';
import { sql } from '@vercel/postgres';

/**
 * @swagger
 * /api/business-segments/create:
 *   post:
 *     tags: ['business_segments']
 *     summary: Create a new business segment
 *     description: Creates a new business segment with the given label.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: "Technology"
 *             required:
 *               - label
 *     responses:
 *       200:
 *         description: Business segment successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Type de métier créée"
 *       401:
 *         description: Unauthorized or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               examples:
 *                 missingLabel:
 *                   summary: Missing Label
 *                   value: "Nous avons besoin d'un label pour créer ce type de données"
 *                 labelExists:
 *                   summary: Label Exists
 *                   value: "Le label saisie est déjà utilisé"
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
            const { label } = req.body

            if (label === '' || typeof label === 'undefined') {
                return res.status(401).json('Nous avons besoin d\'un label pour créer ce type de données')
            }
            
            const segmentAlreadyExist = await sql`SELECT * FROM business_segments WHERE label = ${label}`

            if (segmentAlreadyExist.rows.length > 0) {
                return res.status(401).json('Le label saisie est déjà utilisé')
            }

            const result = await sql`INSERT INTO business_segments (label) VALUES (${label}) RETURNING id`
            return res.status(200).json('Type de métier créée')
        }
        else {
            return res.status(500).json( 'La route n\'acceptes que les POST' )
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}

export default verifyToken(handler, 'ADMIN');