import React from "react";
import styles from "./SeriesGrid.module.css";
import { SerieCard } from "./SerieCard";

// Lista de series
export const Series = ({ seriesList, queryParam, jsonData }) => {
  return (
    <div className={styles.gridContainer}>
      {seriesList.map((serie) => (
        <SerieCard
          key={serie.mal_id}
          title={serie.title}
          image={serie.images.jpg.large_image_url}
          id={serie.mal_id}
          url={serie.url}
          moreInfo={serie} // Enviar el objeto moreInfo al componente SerieCard
          queryParam={queryParam}
          jsonData ={jsonData }
        />
      ))}
    </div>
  );
};
