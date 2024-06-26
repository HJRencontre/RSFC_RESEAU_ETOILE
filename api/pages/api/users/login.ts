import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { email, password } = req.body;

      const result = await sql`SELECT * FROM users WHERE email = ${email}`;

      if (result.rows.length === 0) {
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      const user = result.rows[0];
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      if (user.is_deleted) {
        return res.status(401).json({ error: "Utilisateur supprimé" });
      }

      if (process.env.JWT_SECRET) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).json({ token, user });
      } else {
        return res.status(500).json({ error: "JWT_SECRET manquant" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
}
