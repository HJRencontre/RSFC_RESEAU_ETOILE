import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        if (req.method === 'POST') {
            const { firstname, lastname, password, phone_number, email, role } = req.body

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