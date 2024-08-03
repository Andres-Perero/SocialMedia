"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const Details = () => {
  const [moreInfo, setMoreInfo] = useState(null);

  useEffect(() => {
    const storedMoreInfo = localStorage.getItem('moreInfo');
    if (storedMoreInfo) {
      setMoreInfo(JSON.parse(storedMoreInfo));
    }
  }, []);

  if (!moreInfo) {
    return <div>Loading...</div>;
  }
console.log(moreInfo)
  return (
    <div className={styles.container}>
      <Link href={"/"}>
        <p>INICIO</p>
      </Link>
      <Link href={"/search"}>
        <p>BIBLIOTECA</p>
      </Link>
      <h1>{moreInfo.title}</h1>
      <div>
        <h3>Titles:</h3>
        {moreInfo.titles?.length > 0 ? (
          <ul>
            {moreInfo.titles.map((title, index) => (
              <li key={index}>{title.title}</li>
            ))}
          </ul>
        ) : (
          <p>No title available</p>
        )}
      </div>
      <h3>synopsis:</h3>
      <p>{moreInfo.synopsis || "Synopsis not available"}</p>
      <h3>Date emision:</h3>
      <p>{moreInfo.aired?.string || "not available"}</p>
      <h3>Episodes:</h3>
      <p>{moreInfo.episodes || "not available"}</p>

        <h3>Demographic:</h3>
      <p>{moreInfo.demographics?.[0]?.name || ""}</p>
      
      <div>
        <h3>Genres:</h3>
        {moreInfo.genres?.length > 0 ? (
          <ul>
            {moreInfo.genres.map((genre, index) => (
              <li key={index}>{genre.name}</li>
            ))}
          </ul>
        ) : (
          <p>No genres available</p>
        )}
      </div>
    </div>
  );
};

export default Details;
