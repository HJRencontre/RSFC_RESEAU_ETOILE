import { verifyToken } from '../verifyToken';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

/**
 * @swagger
 * /api/users/invite:
 *   post:
 *     tags: ['users']
 *     summary: Create a new user by sending them an e-mail
 *     description: Creates a new user with the given details.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               password:
 *                 type: string
 *                 example: password123
 *               phone_number:
 *                 type: string
 *                 example: +123456789
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               role:
 *                 type: string
 *                 enum: [ADMIN, PARTNER_REPRESENTATIVE]
 *                 example: ADMIN
 *             required:
 *               - firstname
 *               - lastname
 *               - password
 *               - phone_number
 *               - email
 *               - role
 *     responses:
 *       200:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "L'utilisateur à bien été créée"
 *       401:
 *         description: Unauthorized or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               examples:
 *                 invalidRole:
 *                   summary: Invalid Role
 *                   value: "Le role ne peut pas être autre chose que ADMIN ou PARTNER_REPRESENTATIVE"
 *                 invalidEmail:
 *                   summary: Invalid Email
 *                   value: "L'email saisie est incorrect"
 *                 emailUsed:
 *                   summary: Email Already Used
 *                   value: "L'email saisie est déjà utilisée"
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
const handler = async (
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    
    try {
        if (req.method === 'POST') {
            const { firstname, lastname, password, phone_number, email, role } = req.body
            
            if (!firstname) {
                return res.status(401).json('Le champs prénom doit être rempli')
            }

            if (!lastname) {
                return res.status(401).json('Le champs nom de famille doit être rempli')
            }

            if (!phone_number) {
                return res.status(401).json('Le champs numéro de téléphone doit être rempli')
            }

            if (role !== 'ADMIN' && role !== 'PARTNER_REPRESENTATIVE') {
                return res.status(401).json('Le role ne peut pas être autre chose que ADMIN ou PARTNER_REPRESENTATIVE')
            }
            
            if (!isEmail(email)) {
                return res.status(401).json( 'L\'email saisie est incorrect' )
            }

            const userAlreadyExist = await sql`SELECT * FROM users WHERE email = ${email}`

            if (userAlreadyExist.rows.length > 0) {
                return res.status(401).json('L\'email saisie est déjà utilisée')
            }

            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    console.error('Erreur lors du hachage du mot de passe:', err)
                    return
                }

                const result = await sql`INSERT INTO users (firstname, lastname, password, phone_number, email, role) VALUES (${firstname}, ${lastname}, ${hash}, ${phone_number}, ${email}, ${role}) RETURNING id`

                resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: email,
                    subject: 'Création de compte Réseau Etoile (Red Star)',
                    html: `<p>Bienvenue sur le réseau étoile</p><p>Votre e-mail : ${email}</p><p>Mot de passe : ${password}</p><p>N'oubliez pas de modifier votre mot de passe après la première connexion</p>`
                  });
                return res.status(200).json('L\'utilisateur à bien été créée')
            });
        }
        else {
            return res.status(500).json( 'La route n\'acceptes que les POST' )
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}

function isEmail(email: string):boolean
{
    let serchfind:boolean

    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

    serchfind = regexp.test(email)

    console.log(serchfind)
    return serchfind
}

export default verifyToken(handler, 'ADMIN');