import React from "react";
import styles from "./FormSearchSerie.module.css";
import { resetIcon } from "../icons_data"; // Import the reset icon

export const FormSearchSerie = (props) => {
  return (
    <main>
      <div className={styles.container}>
        <form onSubmit={props.handleSearch}>
          <div className={styles.row}>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                type="search"
                placeholder="Busca aquí"
                required
                value={props.search}
                onChange={(e) => props.setSearch(e.target.value)}
              />
              <button
                type="button"
                className={styles.resetButton}
                onClick={props.resetSearch}
                title="Reset" // Etiqueta del tooltip
              >
                {resetIcon()}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};