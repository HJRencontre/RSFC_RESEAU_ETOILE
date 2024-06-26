import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../verifyToken";
import { sql } from "@vercel/postgres";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      const { title, description, start_at, end_at } = req.body;

      if (title === "" || typeof title === "undefined") {
        return res
          .status(401)
          .json("Nous avons besoin d'un titre pour créer ce type de données");
      }

      if (start_at === "" || typeof start_at === "undefined") {
        return res
          .status(401)
          .json(
            "Nous avons besoin d'une date de début pour créer ce type de données"
          );
      }

      const result =
        await sql`INSERT INTO events (title, description, start_at, end_at ) VALUES (${title}, ${description}, ${start_at}, ${end_at}) RETURNING id`;

      return res.status(200).json("L'évènement à bien été créée");
    } else {
      return res.status(500).json("La route n'acceptes que les POST");
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default verifyToken(handler, "ADMIN");
