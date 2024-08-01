import React from "react";
import Link from "next/link";
import styles from "./Serie.module.css";
import Image from "next/image";

// Serie detalles
export const SerieCard = ({ title, image, id, url, moreInfo }) => {
  return (
    <div className={styles.gridItem}>
      <Image src={image} alt={title} width={150} height={220} />
      <div>{title}</div>
    </div>
  );
};
