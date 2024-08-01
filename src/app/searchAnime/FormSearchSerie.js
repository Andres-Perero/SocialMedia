import React from "react";
import styles from "./Search.module.css";

export const FormSearchSerie = (props) => {
  return (
    <main>
      <div className={styles.container}>
        <form onSubmit={props.handleSearch}>
          <div className={styles.row}>
            <div className={styles.col75}>
              <input
                className={styles.input}
                type="search"
                placeholder="Busca aquí"
                required
                value={props.search}
                onChange={(e) => props.setSearch(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
    
    </main>
  );
};
