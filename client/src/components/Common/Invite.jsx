import { UserContext } from "../../provider/user.provider";
import { useContext } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";

export default function Invite({ addError }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const phone_number = document.getElementById("phone_number").value;
    const role = 'PARTNER_REPRESENTATIVE';
    const password = document.getElementById("password").value;

    fetch("/v1/api/users/invite", {
      method: "POST",
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        phone_number,
        password,
        role,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message) return addError(data.message);
        if (data.token) {
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
    <div className="login">
      <form method="post">
        <p className="header">Inviter un partenaire</p>
        <input
          type="firstname"
          name="firstname"
          id="firstname"
          placeholder="Prénom"
          required
        />
        <input
          type="lastname"
          name="lastname"
          id="lastname"
          placeholder="Nom"
          required
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          required
        />
        <input
          type="phone_number"
          name="phone_number"
          id="phone_number"
          placeholder="Numéro de téléphone"
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Mot de passe temporaire"
          min={8}
          required
        />

        <button type="submit" onClick={handleSubmit}>
          Inviter
        </button>
      </form>
      </div>
    </>
  );
}
