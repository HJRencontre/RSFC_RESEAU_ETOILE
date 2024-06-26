import "./style.css";
import { useAuth } from "../../provider/auth.provider";

export default function Header() {
  const { setToken } = useAuth();
  const handleLogout = () => {
    localStorage.removeItem("user");
    setToken();
  };

  return (
    <nav>
      <ul class="list">
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#">Projects</a>
        </li>
        <li>
          <a href="#">News</a>
        </li>
        <li>
          <a href="#">Contact</a>
        </li>
        <button onClick={() => handleLogout()}>Déconnexion</button>
      </ul>
      <button class="menu">Menu</button>
    </nav>
  );
}
