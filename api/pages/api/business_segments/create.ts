import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../verifyToken";
import { sql } from "@vercel/postgres";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      const { label } = req.body;

      if (label === "" || typeof label === "undefined") {
        return res
          .status(401)
          .json("Nous avons besoin d'un label pour créer ce type de données");
      }

      const segmentAlreadyExist =
        await sql`SELECT * FROM business_segments WHERE label = ${label}`;

      if (segmentAlreadyExist.rows.length > 0) {
        return res.status(401).json("Le label saisie est déjà utilisé");
      }

      const result =
        await sql`INSERT INTO business_segments (label) VALUES (${label}) RETURNING id`;
      return res.status(200).json("Type de métier créée");
    } else {
      return res.status(500).json("La route n'acceptes que les POST");
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default verifyToken(handler, "ADMIN");
