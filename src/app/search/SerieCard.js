import React from "react";
import Link from "next/link";
import styles from "./SerieCard.module.css";
import Image from "next/image";

export const SerieCard = ({ title, image, id, url, moreInfo, queryParam }) => {
  const handleClick = () => {
    localStorage.setItem("moreInfo", JSON.stringify(moreInfo));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Not yet aired":
        return styles.statusNotYetAired;
      case "Finished Airing":
        return styles.statusFinishedAiring;
      case "Currently Airing":
        return styles.statusCurrentlyAiring;
      default:
        return "";
    }
  };

  return (
    <div className={styles.gridItem}>
      <Link
        href={{
          pathname: "/search/details",
          query: { q: queryParam },
        }}
        onClick={handleClick}
      >
        <div className={styles.imageContainer}>
          <Image 
            src={image} 
            alt={title} 
            fill 
            className={styles.image} // Aplica la clase para el ajuste de imagen
            priority 
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw" 
          />
          <div className={styles.title} title={title}>
            {title}
          </div>
          <div className={styles.episodes}>
            {moreInfo.episodes ? `${moreInfo.episodes} eps` : "??? eps"}
          </div>
          <div className={styles.status}>
            <div
              className={`${styles.statusDot} ${getStatusClass(
                moreInfo.status
              )}`}
              title={moreInfo.status}
            ></div>
          </div>
          <div className={styles.genres}>
            <p>{moreInfo.genres[0]?.name}</p>
            {moreInfo.genres[1] && (
              <div className={styles.roundDelimiter}></div>
            )}
            {moreInfo.genres[1] && <p>{moreInfo.genres[1].name}</p>}
          </div>
          <div
            className={styles.score}
            title={`Scored by: ${moreInfo.scored_by}`}
          >
            {moreInfo.score}
          </div>
        </div>
      </Link>
    </div>
  );
};
