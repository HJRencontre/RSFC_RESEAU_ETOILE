import "./style.css";
import { useAuth } from "../../../provider/auth.provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

export default function Profil() {
  const { setToken } = useAuth();
  // handle menu visibility
  const handleMenu = () => {
    const menu = document.querySelector(".settings--menu");
    menu.classList.toggle("visible");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setToken();
  };

  return (
    <main>
      <div className="toolbar">
        <h1>RedStar FC</h1>
        <button className="settings" onClick={handleMenu}>
          <FontAwesomeIcon icon={faEllipsis} />
          <ul className="settings--menu">
            <li>Paramètres</li>
            <li>A propos</li>
            <li onClick={() => handleLogout()}>Déconnexion</li>
          </ul>
        </button>
      </div>
    </main>
  );
}
