import "./style.css";
import { Helmet } from "react-helmet";

export default function PrivacyPolicy() {
  return (
    <main>
      <Helmet>
        <title>Politique de Confidentialité - RedStar</title>
        <meta
          name="description"
          content="Consultez les Politique de Confidentialité de RedStar."
        />
      </Helmet>
      <header>
        <h1>Politique de Confidentialité</h1>
        <p>
          Dernière mise à jour : <span id="last-updated">26 juin 2024</span>
        </p>
      </header>

      <section>
        <h2>1. Collecte des Informations</h2>
        <p>
          Nous collectons les informations suivantes lorsque vous utilisez notre
          application :
        </p>
        <ul>
          <li>
            <strong>Informations personnelles :</strong> Nom, adresse e-mail.
          </li>
          <li>
            <strong>Informations sur l'animal :</strong> Nom de l'animal,
            espèce, race, date de naissance, numéro d'identification (si
            applicable).
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Utilisation des Informations</h2>
        <p>Les informations collectées sont utilisées pour :</p>
        <ul>
          <li>Envoyer des notifications et des rappels de rendez-vous.</li>
          <li>
            Améliorer nos services et personnaliser votre expérience
            utilisateur.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Partage des Informations</h2>
        <p>
          Nous ne partageons pas vos informations personnelles avec des tiers,
          sauf si cela est nécessaire pour fournir nos services ou si la loi
          l'exige.
        </p>
      </section>

      <section>
        <h2>4. Sécurité des Informations</h2>
        <p>
          Nous prenons des mesures de sécurité appropriées pour protéger vos
          informations contre tout accès, divulgation, modification ou
          destruction non autorisés.
        </p>
      </section>

      <section>
        <h2>5. Vos Droits</h2>
        <p>
          Vous avez le droit d'accéder, de corriger ou de supprimer vos
          informations personnelles. Pour exercer ces droits, veuillez nous
          contacter à l'adresse e-mail suivante : [Votre adresse e-mail].
        </p>
      </section>

      <section>
        <h2>6. Modifications de la Politique de Confidentialité</h2>
        <p>
          Nous nous réservons le droit de modifier cette politique de
          confidentialité à tout moment. Toute modification sera publiée sur
          cette page avec la date de mise à jour.
        </p>
      </section>
    </main>
  );
}
