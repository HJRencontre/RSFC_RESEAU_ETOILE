import { useEffect, useState } from "react";
import "./style.css";
import { motion } from "framer-motion";
import { useAuth } from "../../../provider/auth.provider";

export default function Home() {
  const { token } = useAuth();
  const [offers, setOffers] = useState([])
  const [visibleOffers, setVisibleOffers] = useState(4);

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
  }, []);

  const showMoreOffers = () => {
    setVisibleOffers((prevVisibleOffers) => prevVisibleOffers + 4);
  };

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

      <section className="offers">
        <div className="toolbar">
          <h2>Offres partenaires</h2>
          {visibleOffers < offers.length && (
            <button onClick={showMoreOffers} className="see-more-btn">
              Voir plus
            </button>
          )}
        </div>
        <div className="offers-list">
          {offers.length > 0 ? (
            offers.slice(0, visibleOffers).map((offer, index) => (
              <article className="offer" key={index}>
                <h1>{offer.label}</h1>
                <p>{offer.description}</p>
              </article>
            ))
          ) : (
            <>
              <article className="offer-load">
                <h1></h1>
                <p></p>
              </article>
              <article className="offer-load">
                <h1></h1>
                <p></p>
              </article>
            </>
          )}
        </div>
      </section>
    </motion.main>
  );
}
