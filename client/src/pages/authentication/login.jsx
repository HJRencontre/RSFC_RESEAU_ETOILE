import "./style.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/auth.provider";
import { UserContext } from "../../provider/user.provider";
import { useContext } from "react";

export default function Login({ addError }) {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { updateUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/v1/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message) return addError(data.message);
        if (data.token) {
          setToken(data.token);
          updateUser(data.user);
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="login"
      exit={{ opacity: 0 }}
      transition={{
        type: "linear",
        stiffness: 260,
        damping: 20,
      }}
    >
      <style>
        {`body{background:#044336}#root{display:flex;flex-direction:column;height:100vh;width:100vw}`}
      </style>
      <motion.div
        initial={{ translateY: 300, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{
          delay: 0.25,
          type: "tween",
          stiffness: 120,
          duration: 0.25,
        }}
        className="login-logo"
      >
        <img src="/logo-pro.png" alt="logo" />
      </motion.div>
      <form method="post">
        <h1>Connexion</h1>
        <p className="header">Pour accéder à votre espace privé</p>
        <p>saisissez votre email et votre mot de passe.</p>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Mot de passe"
          min={8}
          required
        />

        <button type="submit" onClick={handleSubmit}>
          Se connecter
        </button>
      </form>
      <div className="login-legal">
        <a href="/mentions-légales">Mention légales</a>
        <a href="/politique-de-confidentialité">Politique de confidentialité</a>
      </div>
    </motion.main>
  );
}
