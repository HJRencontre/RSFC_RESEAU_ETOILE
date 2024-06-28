import "./style.css";
import {useContext, useState} from "react";
import {useAuth} from "../../provider/auth.provider";
import {UserContext, UserRole} from "../../provider/user.provider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faPowerOff, faShoppingCart, faUser} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const {setToken} = useAuth();
  const {user} = useContext(UserContext);
  const [menu, setMenu] = useState(false);

  if (!user) {
    return <div>N'existe pas</div>
  }

  const isUserAdmin = !!(user && user.role === UserRole.ADMIN);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setToken();
  };

  const handleMenu = () => {
    setMenu(!menu);
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        {user && (
          <a href="/">
            <p className="only-desktop">
              {user.firstname}
              <span className="uppercase">&nbsp;{user.lastname}</span>
            </p>
          </a>
        )}
        <ul className={menu ? "nav-list active" : "nav-list"}>
          {isUserAdmin && (
            <li>
              <a href="/admin">Administrateur</a>
            </li>
          )}
          <li>
            <a href="/">Accueil</a>
          </li>
          <li>
            <a href="/account">
              <FontAwesomeIcon icon={faUser} />
              Mon compte
            </a>
          </li>
          <li>
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faPowerOff} />
              Se déconnecter
            </button>
          </li>
        </ul>
        <FontAwesomeIcon className="only-mobile" icon={faShoppingCart} />
        <div className="only-mobile logo">
          <img src="/logo-pro.png" alt="" />
        </div>
        <FontAwesomeIcon
          className="only-mobile"
          icon={faBars}
          onClick={handleMenu}
        />
      </div>
    </nav>
  );
}
