import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import { verifyToken } from "../verifyToken";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    if (typeof id === "string") {
      if (req.method === "GET") {
        const result =
          await sql`SELECT * FROM users WHERE is_deleted = false AND id = ${id}`;

        if (result.rowCount === 0) {
          return res.status(500).json("L'utilisateur n'existe pas");
        }
        const rows = result.rows;
        const partner = rows[0];

        return res.status(200).json({ partner });
      }
      if (req.method === "DELETE") {
        const result =
          await sql`UPDATE users SET is_deleted = true WHERE id = ${id}`;
        const rows = result.rows;

        return res.status(200).json("L'utilisateur à bien été supprimé.");
      }
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default verifyToken(handler, "ADMIN");
