import "./style.css";
import { Helmet } from "react-helmet";

export default function TermsOfUse() {
  return (
    <main>
      <Helmet>
        <title>Conditions Générales d'Utilisation - RedStar</title>
        <meta
          name="description"
          content="Consultez les Conditions Générales d'Utilisation de RedStar."
        />
      </Helmet>
      <header>
        <h1>Conditions Générales d'Utilisation</h1>
        <p>
          Dernière mise à jour : <span id="last-updated">26 juin 2024</span>
        </p>
      </header>

      <section id="introduction">
        <h2>Introduction</h2>
        <p>
          Bienvenue sur RedStar ! En utilisant notre application, vous acceptez
          les présentes Conditions Générales d'Utilisation (CGU). Veuillez les
          lire attentivement.
        </p>
      </section>

      <section id="acceptation-des-conditions">
        <h2>Acceptation des conditions</h2>
        <p>
          En accédant ou en utilisant notre service, vous acceptez d'être lié
          par ces CGU et toutes les lois et réglementations applicables.
        </p>
      </section>

      <section id="modifications-des-conditions">
        <h2>Modifications des conditions</h2>
        <p>
          Nous nous réservons le droit de modifier ces CGU à tout moment. Les
          modifications seront effectives dès leur publication sur cette page.
          Nous vous encourageons à consulter régulièrement les CGU.
        </p>
      </section>

      <section id="utilisation-de-lapplication">
        <h2>Utilisation de l'application</h2>
        <p>
          Vous acceptez d'utiliser notre application conformément aux lois
          applicables et de ne pas utiliser l'application à des fins illégales
          ou non autorisées.
        </p>
      </section>

      <section id="comptes-utilisateur">
        <h2>Comptes utilisateur</h2>
        <p>
          Pour accéder à certaines fonctionnalités, vous devrez créer un compte.
          Vous êtes responsable de la confidentialité de vos identifiants de
          connexion et de toutes les activités qui se produisent sous votre
          compte.
        </p>
      </section>

      <section id="responsabilite">
        <h2>Responsabilité</h2>
        <p>
          RedStar ne pourra être tenu responsable des dommages indirects
          résultant de l'utilisation ou de l'incapacité à utiliser notre
          service.
        </p>
      </section>

      <section id="propriete-intellectuelle">
        <h2>Propriété intellectuelle</h2>
        <p>
          Tout le contenu de notre application, y compris les textes,
          graphiques, logos, et images, est notre propriété ou celle de nos
          partenaires et est protégé par les lois sur la propriété
          intellectuelle.
        </p>
      </section>

      <section id="resiliation">
        <h2>Résiliation</h2>
        <p>
          Nous nous réservons le droit de résilier ou de suspendre votre accès à
          notre application, sans préavis, pour toute violation des présentes
          CGU.
        </p>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <p>
          Pour toute question concernant ces CGU, veuillez nous contacter à{" "}
          <a href="mailto:vanhovehugo1@gmail.com">vanhovehugo1@gmail.com</a>.
        </p>
      </section>
    </main>
  );
}
