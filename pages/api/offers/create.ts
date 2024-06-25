import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../verifyToken';
import { sql } from '@vercel/postgres';


/**
 * @swagger
 * /api/offer/create:
 *   post:
 *     tags: ['offers']
 *     summary: Create a new offer
 *     description: Creates a new offer with the given details.
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
 *                 example: "Special Discount"
 *               discount_amount:
 *                 type: number
 *                 example: 20
 *               description:
 *                 type: string
 *                 example: "This is a special discount offer."
 *               discount_type:
 *                 type: string
 *                 example: "percentage"
 *               partner_id:
 *                 type: string
 *                 example: "1"
 *             required:
 *               - label
 *               - discount_amount
 *               - description
 *               - discount_type
 *               - partner_id
 *     responses:
 *       200:
 *         description: Offer successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "L'offre à bien été créée"
 *       401:
 *         description: Unauthorized or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               examples:
 *                 missingLabel:
 *                   summary: Missing Label
 *                   value: "Nous avons besoin d'un nom pour créer ce type de données"
 *                 invalidPartner:
 *                   summary: Invalid Partner
 *                   value: "Le partenaire sélectionné n'existe pas"
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
            const { label, discount_amount, description, discount_type, partner_id  } = req.body
            
            if (label === '' || typeof label === 'undefined') {
                return res.status(401).json('Nous avons besoin d\'un nom pour créer ce type de données')
            }
            
            const checkPartner = await sql`SELECT * FROM partners WHERE id = ${partner_id} AND is_deleted = false`
            
            if (checkPartner.rowCount === 0) {
                return res.status(401).json( 'Le partenaire sélectionné n\'existe pas' )
            }
            
            const result = await sql`INSERT INTO offers (label, discount_amount, description, discount_type, partner_id ) VALUES (${label}, ${discount_amount}, ${description}, ${discount_type}, ${partner_id }) RETURNING id`
            
            return res.status(200).json('L\'offre à bien été créée')
        }
        else {
            return res.status(500).json( 'La route n\'acceptes que les POST' )
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}

export default verifyToken(handler);