import "./style.css";
import { Helmet } from "react-helmet";

export default function LegalNotice() {
  return (
    <main>
      <Helmet>
        <title>Mentions Légales - RedStar</title>
        <meta
          name="description"
          content="Consultez les Mentions Légales de RedStar."
        />
      </Helmet>
      <header>
        <h1>Mentions Légales</h1>
        <p>
          Dernière mise à jour : <span id="last-updated">26 juin 2024</span>
        </p>
      </header>

      <section id="editeur-du-site">
        <h2>Éditeur du site</h2>
        <p>
          Email :{" "}
          <a href="mailto:contact@nomdelentreprise.com">
            contact@redstar-fc.com
          </a>
          <br />
          Directeur de la publication : Vanhove Hugo
        </p>
      </section>

      <section id="hebergeur-du-site">
        <h2>Hébergeur du site</h2>
        <p>
          Nom de l'hébergeur : OVHcloud
          <br />
          Adresse : 2 rue Kellermann, 59100 Roubaix
          <br />
          Téléphone : 1007
        </p>
      </section>

      <section id="conditions-dutilisation">
        <h2>Conditions d'utilisation</h2>
        <p>
          L'utilisation de ce site implique l'acceptation pleine et entière des
          conditions générales d'utilisation décrites dans nos CGU. Ces
          conditions sont susceptibles d'être modifiées ou complétées à tout
          moment.
        </p>
      </section>

      <section id="propriete-intellectuelle">
        <h2>Propriété intellectuelle</h2>
        <p>
          Le contenu du site (textes, images, graphismes, logo, etc.) est la
          propriété de RedStar ou de ses partenaires et est protégé par les lois
          françaises et internationales relatives à la propriété intellectuelle.
        </p>
      </section>

      <section id="limitation-de-responsabilite">
        <h2>Limitation de responsabilité</h2>
        <p>
          Je ne pourrai être tenue responsable des dommages directs et indirects
          causés au matériel de l'utilisateur lors de l'accès au site RedStar,
          et résultant soit de l'utilisation d'un matériel ne répondant pas aux
          spécifications indiquées, soit de l'apparition d'un bug ou d'une
          incompatibilité.
        </p>
      </section>

      <section id="donnees-personnelles">
        <h2>Données personnelles</h2>
        <p>
          Conformément à la loi Informatique et Libertés du 6 janvier 1978, vous
          disposez d'un droit d'accès, de rectification et de suppression des
          données personnelles vous concernant, que vous pouvez exercer en
          adressant une demande à{" "}
          <a href="mailto:contact@nomdelentreprise.com">
            contact@nomdelentreprise.com
          </a>
          .
        </p>
      </section>

      <section id="cookies">
        <h2>Cookies</h2>
        <p>
          Le site RedStar peut être amené à vous demander l'acceptation des
          cookies pour des besoins de statistiques et d'affichage. Un cookie est
          une information déposée sur votre disque dur par le serveur du site
          que vous visitez.
        </p>
      </section>

      <section id="liens-hypertextes">
        <h2>Liens hypertextes</h2>
        <p>
          Le site RedStar contient un certain nombre de liens hypertextes vers
          d'autres sites. Cependant, je n'ai pas la possibilité de vérifier le
          contenu des sites ainsi visités, et n'assumera en conséquence aucune
          responsabilité de ce fait.
        </p>
      </section>
    </main>
  );
}
