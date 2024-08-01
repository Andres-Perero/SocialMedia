import styles from "./Error.module.css";

export default function ErrorPage() {
  return (
    <div className={styles.errorContainer}>
      <h1>Por favor, vuelve a las redes del usuario donde encontraste el link para completarlo.</h1>
    </div>
  );
}
