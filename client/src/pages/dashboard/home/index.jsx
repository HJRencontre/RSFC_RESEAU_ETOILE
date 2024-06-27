import { useEffect, useState } from "react";
import "./style.css";
import { motion } from "framer-motion";
import { useAuth } from "../../../provider/auth.provider";

export default function Home() {
  const { token } = useAuth();
  const [offers, setOffers] = useState()
  useEffect(() => {
    fetch("/v1/api/offers/getAll",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if(data) setOffers(data.rows);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-lg-center"
      transition={{
        type: "linear",
        stiffness: 260,
        damping: 20,
      }}
    >
      <div className="hero">
        <img src="/hero.jpg" alt="" />
      </div>
      {offers &&
        // foreach offer display offers.label
        offers.map((offer) => (
          <div className="offer">
            <p>{offer.label}</p>
          </div>
        ))}
    </motion.main>
  );
}
