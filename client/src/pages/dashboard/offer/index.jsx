import { useEffect, useState } from "react";
import "./style.css";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export default function Offer() {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [offer, setOffer] = useState({});
  const [partner, setPartner] = useState({});

  useEffect(() => {
    try {
      fetch(`/v1/api/offers/${id}`, {
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
          if (!data) return;
          setOffer(data.partner);
          findPartner(data.partner.id);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const findPartner = (pid) => {
    try {
      fetch(`/v1/api/partners/${pid}`, {
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
          if (data) setPartner(data.partner);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  }

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
      <div class="offer-details">
        <h1 class="offer-label">{offer.label}</h1>
        <p class="offer-description">{offer.description}</p>
        {offer.picture && (
          <img
            src={"v1/" + offer.picture}
            alt="offre mis en avant"
            class="offer-picture"
          />
        )}
        {offer.discount_amount && (
          <div class="offer-info">
            <span class="offer-discount">
              {"Reduction : " +
                (offer ? offer.discount_amount + offer.discount_type : "")}
            </span>
          </div>
        )}
        <div class="partner-details">
          <p class="partner-name">{partner.name}</p>
          <p class="partner-description">{partner.description}</p>
          <p class="partner-website">
            <a href="https://financellc.com" target="_blank">
              {partner.website}
            </a>
          </p>
        </div>
      </div>
    </motion.main>
  );
}
