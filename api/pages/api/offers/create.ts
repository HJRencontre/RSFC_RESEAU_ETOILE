import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../verifyToken";
import { sql } from "@vercel/postgres";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      const { label, discount_amount, description, discount_type, partner_id } =
        req.body;

      if (label === "" || typeof label === "undefined") {
        return res
          .status(401)
          .json("Nous avons besoin d'un nom pour créer ce type de données");
      }

      const checkPartner =
        await sql`SELECT * FROM partners WHERE id = ${partner_id} AND is_deleted = false`;

      if (checkPartner.rowCount === 0) {
        return res.status(401).json("Le partenaire sélectionné n'existe pas");
      }

      const result =
        await sql`INSERT INTO offers (label, discount_amount, description, discount_type, partner_id ) VALUES (${label}, ${discount_amount}, ${description}, ${discount_type}, ${partner_id}) RETURNING id`;

      return res.status(200).json("L'offre à bien été créée");
    } else {
      return res.status(500).json("La route n'acceptes que les POST");
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default verifyToken(handler);
