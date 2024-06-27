import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../verifyToken";
import { sql } from "@vercel/postgres";

/**
 * @swagger
 * /api/partners_contacts/create:
 *   post:
 *     tags: ['partners_contacts']
 *     summary: Create a new partner contact request
 *     description: Creates a new partner contact request with the given details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contacting_partner_id:
 *                 type: string
 *                 example: "1"
 *               contacted_partner_id:
 *                 type: string
 *                 example: "2"
 *               offer_id:
 *                 type: string
 *                 example: "3"
 *             required:
 *               - contacting_partner_id
 *               - contacted_partner_id
 *               - offer_id
 *     responses:
 *       200:
 *         description: Contact request successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "La demande de contact à bien été enregistrée"
 *       401:
 *         description: Unauthorized or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               examples:
 *                 contactingPartnerNotFound:
 *                   summary: Contacting Partner Not Found
 *                   value: "Le partenaire qui essaie de contacter n'existe pas"
 *                 contactedPartnerNotFound:
 *                   summary: Contacted Partner Not Found
 *                   value: "Le partenaire qui est contacté n'existe pas"
 *                 offerNotFound:
 *                   summary: Offer Not Found
 *                   value: "L'offre n'existe pas"
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
      const { contacting_partner_id, contacted_partner_id, offer_id } =
        req.body;

      const checkContactingPartner =
        await sql`SELECT * FROM partners WHERE id = ${contacting_partner_id} AND is_deleted = false`;

      if (checkContactingPartner.rowCount === 0) {
        return res
          .status(401)
          .json("Le partenaire qui essaie de contacter n'existe pas");
      }

      const checkContactedPartner =
        await sql`SELECT * FROM partners WHERE id = ${contacted_partner_id} AND is_deleted = false`;

      if (checkContactedPartner.rowCount === 0) {
        return res
          .status(401)
          .json("Le partenaire qui est contacté n'existe pas");
      }

      const checkOffer =
        await sql`SELECT * FROM offers WHERE id = ${offer_id} AND is_deleted = false`;

      if (checkOffer.rowCount === 0) {
        return res.status(401).json("L'offre n'existe pas");
      }

      const result =
        await sql`INSERT INTO partner_contacts (contacting_partner_id , contacted_partner_id, offer_id) VALUES (${contacting_partner_id}, ${contacted_partner_id}, ${offer_id}) RETURNING id`;

      return res
        .status(200)
        .json("La demande de contact à bien été enregistrée");
    } else {
      return res.status(500).json("La route n'acceptes que les POST");
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default verifyToken(handler);
