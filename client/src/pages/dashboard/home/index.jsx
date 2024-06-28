import { useEffect, useState } from "react";
import "./style.css";
import { motion } from "framer-motion";
import { useAuth } from "../../../provider/auth.provider";

export default function Home() {
  const { token } = useAuth();
  const [offers, setOffers] = useState([])
  const [visibleOffers, setVisibleOffers] = useState(4);


  useEffect(() => {
    try {
      if (!token) return;
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
        console.log(data);
        if(data) setOffers(data.rows);
      })
      .catch((err) => {
        console.error(err);
      });
    } catch (err) {
      console.error(err);
    }
  }, [token]);

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
      {/* <div className="hero">
        <img src="/hero.jpg" alt="" />
      </div> */}

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
              <a href={"/offer/" + offer.id} className="offer">
                <article key={index}>
                  <img src={offer.picture} alt="" />
                  <h1>{offer.label}</h1>
                  <p>{offer.description}</p>
                </article>
              </a>
            ))
          ) : (
            <>
              <article className="offer-load">
                <h1>Loading</h1>
                <p>Lorem</p>
              </article>
              <article className="offer-load">
                <h1>Loading</h1>
                <p>Lorem</p>
              </article>
              <article className="offer-load">
                <h1>Loading</h1>
                <p>Lorem</p>
              </article>
              <article className="offer-load">
                <h1>Loading</h1>
                <p>Lorem</p>
              </article>
            </>
          )}
        </div>
      </section>
    </motion.main>
  );
}
