import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';

export const verifyToken = (handler, role = '') => {
    return async (req, res) => {
        const token = req.headers.authorization?.split(' ')[1]

        const id = typeof (req.body.id) !== 'undefined' ? req.body.id : req.query.id

        if (!token) {
            return res.status(401).json({ error: 'No token provided' })
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.userId = decoded.userId;

            const result    = await sql`SELECT * FROM users WHERE id = ${req.userId}`;
            const rows      = result.rows

            if (role !== '') {
                if (role === 'MASTER' && role !== rows[0].role) {
                    return res.status(401).json({ error: 'Contacter les développeurs' })
                }
                if (!rightsCheck(role, rows[0].role) && req.userId != id) {
                    return res.status(401).json('Vous n\'avez pas les droits nécessaire pour accéder à la ressource.')
                }
            }
            return handler(req, res);
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' })
        }
    }
}

function rightsCheck(minimalRole, userRole)
{
    switch (minimalRole) {
        case 'MASTER':
            if (userRole === 'MASTER') {
                return true
            }
            break;

        case 'ADMIN':
            if (userRole === 'MASTER' || userRole === 'ADMIN') {
                return true
            }
            break;
    
        default:
            return true
            break;
    }
    return false
}