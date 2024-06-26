import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../verifyToken";
import { sql } from "@vercel/postgres";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      const { name, website, description, user_id, business_segment_id } =
        req.body;

      if (name === "" || typeof name === "undefined") {
        return res
          .status(401)
          .json("Nous avons besoin d'un nom pour créer ce type de données");
      }

      const checkUser =
        await sql`SELECT * FROM users WHERE id = ${user_id} AND is_deleted = false`;

      if (checkUser.rowCount === 0) {
        return res
          .status(401)
          .json("L'utilisateur sélectionné n'est pas valide");
      }

      const checkUserAlreadyPartner =
        await sql`SELECT * FROM partners WHERE user_id = ${user_id} AND is_deleted = false`;

      if (checkUserAlreadyPartner.rowCount != 0) {
        return res
          .status(401)
          .json("L'utilisateur sélectionné est déjà partenaire !");
      }

      const checkBusinessSegment =
        await sql`SELECT * FROM business_segments WHERE id = ${business_segment_id} AND is_deleted = false`;

      if (checkBusinessSegment.rowCount === 0) {
        return res
          .status(401)
          .json("Le type de métier sélectionné n'est pas valide");
      }

      const result =
        await sql`INSERT INTO partners (name, website, description, user_id, business_segment_id ) VALUES (${name}, ${website}, ${description}, ${user_id}, ${business_segment_id}) RETURNING id`;

      return res.status(200).json("Le partenaire à bien été créée");
    } else {
      return res.status(500).json("La route n'acceptes que les POST");
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default verifyToken(handler, "ADMIN");
