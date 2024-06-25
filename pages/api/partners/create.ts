import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../verifyToken';
import { sql } from '@vercel/postgres';

/**
 * @swagger
 * /api/partners/create:
 *   post:
 *     tags: ['partners']
 *     summary: Create a new partner
 *     description: Creates a new partner with the given details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Partner Name
 *               website:
 *                 type: string
 *                 example: "https://partner-website.com"
 *               description:
 *                 type: string
 *                 example: "This is a partner description."
 *               user_id:
 *                 type: string
 *                 example: "1"
 *               business_segment_id:
 *                 type: string
 *                 example: "2"
 *             required:
 *               - name
 *               - user_id
 *               - business_segment_id
 *     responses:
 *       200:
 *         description: Partner successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Le partenaire à bien été créé"
 *       401:
 *         description: Unauthorized or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               examples:
 *                 missingName:
 *                   summary: Missing Name
 *                   value: "Nous avons besoin d'un nom pour créer ce type de données"
 *                 invalidUser:
 *                   summary: Invalid User
 *                   value: "L'utilisateur sélectionné n'est pas valide"
 *                 userAlreadyPartner:
 *                   summary: User Already Partner
 *                   value: "L'utilisateur sélectionné est déjà partenaire !"
 *                 invalidBusinessSegment:
 *                   summary: Invalid Business Segment
 *                   value: "Le type de métier sélectionné n'est pas valide"
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
            const { name, website, description, user_id, business_segment_id  } = req.body
            
            if (name === '' || typeof name === 'undefined') {
                return res.status(401).json('Nous avons besoin d\'un nom pour créer ce type de données')
            }
            
            const checkUser = await sql`SELECT * FROM users WHERE id = ${user_id} AND is_deleted = false`
            
            if (checkUser.rowCount === 0) {
                return res.status(401).json( 'L\'utilisateur sélectionné n\'est pas valide' )
            }

            const checkUserAlreadyPartner = await sql`SELECT * FROM partners WHERE user_id = ${user_id} AND is_deleted = false`
            
            if (checkUserAlreadyPartner.rowCount != 0) {
                return res.status(401).json( 'L\'utilisateur sélectionné est déjà partenaire !' )
            }
            
            const checkBusinessSegment = await sql`SELECT * FROM business_segments WHERE id = ${business_segment_id} AND is_deleted = false`
            
            if (checkBusinessSegment.rowCount === 0) {
                return res.status(401).json( 'Le type de métier sélectionné n\'est pas valide' )
            }
            
            const result = await sql`INSERT INTO partners (name, website, description, user_id, business_segment_id ) VALUES (${name}, ${website}, ${description}, ${user_id}, ${business_segment_id }) RETURNING id`
            
            return res.status(200).json('Le partenaire à bien été créée')
        }
        else {
            return res.status(500).json( 'La route n\'acceptes que les POST' )
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}

export default verifyToken(handler, 'ADMIN');