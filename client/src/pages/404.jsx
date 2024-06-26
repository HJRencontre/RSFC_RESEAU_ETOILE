import "../styles/404.css"
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return(
        <motion.main className="error-container">
            <h1 className="error-title">404</h1>
            <h2 className="error-subtitle">Page non trouvée</h2>
            <p className="error-message">La page que vous tentez d'afficher n'existe pas ou une erreur s'est produite.</p>
            <p className="error-return">Vous pouvez revenir à <Link to="/">la page d'accueil</Link></p>
        </motion.main>
    );
}