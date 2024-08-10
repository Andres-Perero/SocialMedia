"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import FormListEpisodes from "./formListEpisodes";
import Image from "next/image";
import {
  RederictIcon,
  LikeIcon,
  LikeFillIcon,
} from "../../icons_data";
import { useSearchParams } from "next/navigation";
import Loader from "src/app/Loader";

const Details = () => {
  const [moreInfo, setMoreInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isLiked, setIsLiked] = useState(false);
  const searchParams = useSearchParams();
  const [queryParam, setQueryParam] = useState("");

  useEffect(() => {
    const q = searchParams.get("q");
    setQueryParam(q);
  }, [searchParams]);

  useEffect(() => {
    const storedMoreInfo = localStorage.getItem("moreInfo");
    if (storedMoreInfo) {
      setMoreInfo(JSON.parse(storedMoreInfo));
    }
  }, []);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    SaveSerie(moreInfo);
  };

  if (!moreInfo) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Link href={{ pathname: "/", query: { q: queryParam } }}>
          <p>INICIO</p>
        </Link>
        <Link href={{ pathname: "/search", query: { q: queryParam } }}>
          <p>BIBLIOTECA</p>
        </Link>
      </div>
      <div className={styles.header}>
        <h1 className={styles.title}>{moreInfo.title}</h1>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.imageWrapper}>
          <Image
            src={moreInfo.images.jpg.large_image_url}
            alt={moreInfo.title}
            fill
            style={{ objectFit: "cover" }}
            priority 
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw" 
          />
          <div
            className={`${styles.likeIcon} ${isLiked ? styles.active : ""}`}
            onClick={handleLikeClick}
          >
            {isLiked ? <LikeFillIcon /> : <LikeIcon />}
          </div>
        </div>

        <div className={styles.infoWrapper}>
          <div className={styles.tabs}>
            <div
              className={`${styles.tab} ${
                activeTab === "info" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("info")}
            >
              Información
            </div>
            <div
              className={`${styles.tab} ${
                activeTab === "episodes" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("episodes")}
            >
              Capítulos
            </div>
          </div>
          <div className={styles.infoContent}>
            {activeTab === "info" && (
              <div className={styles.infoLeft}>
                <div className={styles.detail}>
                  <strong>Nombre original:</strong> {moreInfo.title_japanese}
                </div>
                <div className={styles.detail}>
                  <strong>Tipo:</strong> {moreInfo.type}
                </div>
                <div className={styles.detail}>
                  <strong>Fecha de emisión:</strong> {moreInfo.aired.string}
                </div>
                <div className={styles.detail}>
                  <strong>Capítulos:</strong> {moreInfo.episodes}
                </div>
                <div className={styles.detail}>
                  <strong>Estado:</strong> {moreInfo.status}
                </div>
                <div className={styles.detail}>
                  <strong>Demografía:</strong>{" "}
                  {moreInfo.demographics?.[0]?.name || "No disponible"}
                </div>
                <div className={styles.detail}>
                  <strong>URL:</strong>{" "}
                  <a
                    className={styles.socials}
                    href={moreInfo.url}
                    data-tooltip={moreInfo.title}
                    target="_blank"
                  >
                    <RederictIcon />
                  </a>
                </div>

                <div className={styles.description}>
                  <h3>Sinopsis:</h3>
                  <p>{moreInfo.synopsis || "Sinopsis no disponible"}</p>
                </div>
                <div className={styles.genres}>
                  <h3>Géneros:</h3>
                  {moreInfo.genres?.length > 0 ? (
                    <ul>
                      {moreInfo.genres.map((genre, index) => (
                        <li key={index}>{genre.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay géneros disponibles</p>
                  )}
                </div>
              </div>
            )}
            {activeTab === "episodes" && (
              <div className={styles.episodeList}>
                <FormListEpisodes animeId={moreInfo.mal_id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Function to handle saving the series
const SaveSerie = (serie) => {
  console.log("Saving series:", serie);
};

export default Details;
