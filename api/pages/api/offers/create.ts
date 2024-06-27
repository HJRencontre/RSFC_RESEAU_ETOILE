import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../verifyToken";
import formidable, { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { sql } from "@vercel/postgres";
import { log } from "console";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * @swagger
 * /api/offers/create:
 *   post:
 *     tags: ['offers']
 *     summary: Create a new offer
 *     description: Creates a new offer with the given details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: "Special Discount"
 *               discount_amount:
 *                 type: number
 *                 example: 20
 *               picture:
 *                 type: string
 *                 format: binary 
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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  try {
    if (req.method === "POST") {
      const form = new IncomingForm();

      form.uploadDir = path.join(process.cwd(), '/public/uploads');
      form.keepExtensions = true;

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error parsing the form' });
          return;
        }
        
        console.log(fields);
        
        
        const file = files.picture;
        if (file.length > 0) {      
          const oldPath = file[0].filepath;
          const filename = file[0].newFilename + '.' + file[0].originalFilename.split('.').pop()
          const filepath = 'uploads/' + filename
          const newPath = path.join(form.uploadDir, filename);
          fs.rename(oldPath, newPath, async (err) => {
            if (err) throw err;
            const result =
              await sql`INSERT INTO offers (label, discount_amount, picture,description, discount_type, partner_id ) VALUES (${fields.label[0]}, ${fields.discount_amount[0]}, ${filepath},${fields.description[0]}, ${fields.discount_type[0]}, ${fields.partner_id[0]}) RETURNING id`;
            res.status(200).json({ message: 'Form data received and file saved', fields, files });
          });
        } else {
          const result =
            await sql`INSERT INTO offers (label, discount_amount, description, discount_type, partner_id ) VALUES (${fields.label[0]}, ${fields.discount_amount[0]}, ${fields.description[0]}, ${fields.discount_type[0]}, ${fields.partner_id[0]}) RETURNING id`;
          res.status(200).json({ message: 'Form data received', fields });
        }
      })
    } 
  } catch (error) {
    return res.status(500).json({ error });
  }
};


  // try {
  //   if (req.method === "POST") {
//       const { label, discount_amount, picture, description, discount_type, partner_id } =
//         req.body;
      
//       if (label === "" || typeof label === "undefined") {
//         return res
//           .status(401)
//           .json("Nous avons besoin d'un nom pour créer ce type de données");
//       }

//       const checkPartner =
//         await sql`SELECT * FROM partners WHERE id = ${partner_id} AND is_deleted = false`;

//       if (checkPartner.rowCount === 0) {
//         return res.status(401).json("Le partenaire sélectionné n'existe pas");
//       }

      // const result =
      //   await sql`INSERT INTO offers (label, discount_amount, description, discount_type, partner_id ) VALUES (${label}, ${discount_amount}, ${description}, ${discount_type}, ${partner_id}) RETURNING id`;

//       return res.status(200).json("L'offre à bien été créée");
//     } else {
//       return res.status(500).json("La route n'acceptes que les POST");
//     }
//   } catch (error) {
//     return res.status(500).json({ error });
//   }
// };

export default verifyToken(handler);
