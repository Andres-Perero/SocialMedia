"use client"
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import FormListEpisodes from "./formListEpisodes";
import Image from "next/image";
import { RederictIcon, LikeIcon, LikeFillIcon } from "../../icons_data";
import { useSearchParams } from "next/navigation";
import Loader from "src/app/Loader";

const Details = () => {
  const searchParams = useSearchParams();
  const [queryParam, setQueryParam] = useState("");
  const [dataInfoSerie, setDataInfoSerie] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [tooltip, setTooltip] = useState(""); 
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    setQueryParam(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const storedMoreInfo = localStorage.getItem("moreInfo");
    if (storedMoreInfo) {
      const parsedInfo = JSON.parse(storedMoreInfo);
      setDataInfoSerie(parsedInfo);
      setIsLiked(!!parsedInfo.isSaved);
    }
  }, []);

  useEffect(() => {
    if (dataInfoSerie) {
      setTooltip(isLiked ? "Guardado" : "Guardar");
      const updatedDataInfoSerie = { ...dataInfoSerie, isSaved: isLiked };
      setDataInfoSerie(updatedDataInfoSerie);
      localStorage.setItem("moreInfo", JSON.stringify(updatedDataInfoSerie));
    }
  }, [isLiked]);

  const handleLikeClick = () => {
    setIsLiked(prev => !prev);
  };

  if (!dataInfoSerie) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Link rel="preload" href={{ pathname: "/", query: { q: queryParam } }}>
          <p title="INICIO">INICIO</p>
        </Link>
        <Link
          rel="preload"
          href={{ pathname: "/search", query: { q: queryParam } }}
        >
          <p title="BIBLIOTECA">BIBLIOTECA</p>
        </Link>
        <Link
          href={{
            pathname: "/vistos",
            query: { q: queryParam },
          }}
        >
          <p title="Vistos">Vistos</p>
        </Link>
      </div>
      <div className={styles.header}>
        <h1 className={styles.title}>{dataInfoSerie.title}</h1>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.imageWrapper}>
          <Image
            src={dataInfoSerie.images.jpg.large_image_url}
            alt={dataInfoSerie.title}
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div
            className={`${styles.likeIcon} ${isLiked ? styles.active : ""}`}
            onClick={handleLikeClick}
            onMouseEnter={() => setTooltip(isLiked ? "Guardado" : "Guardar")}
            onMouseLeave={() => setTooltip("")}
          >
            {isLiked ? <LikeFillIcon /> : <LikeIcon />}
            {tooltip && <div className={styles.tooltip}>{tooltip}</div>}
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
                  <strong>Nombre original:</strong> {dataInfoSerie.title_japanese}
                </div>
                <div className={styles.detail}>
                  <strong>Tipo:</strong> {dataInfoSerie.type}
                </div>
                <div className={styles.detail}>
                  <strong>Fecha de emisión:</strong> {dataInfoSerie.aired.string}
                </div>
                <div className={styles.detail}>
                  <strong>Capítulos:</strong> {dataInfoSerie.episodes}
                </div>
                <div className={styles.detail}>
                  <strong>Estado:</strong> {dataInfoSerie.status}
                </div>
                <div className={styles.detail}>
                  <strong>Demografía:</strong>{" "}
                  {dataInfoSerie.demographics?.[0]?.name || "No disponible"}
                </div>
                <div className={styles.detail}>
                  <strong>URL:</strong>{" "}
                  <a
                    className={styles.socials}
                    href={dataInfoSerie.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <RederictIcon />
                  </a>
                </div>

                <div className={styles.description}>
                  <h3>Sinopsis:</h3>
                  <p>{dataInfoSerie.synopsis || "Sinopsis no disponible"}</p>
                </div>
                <div className={styles.genres}>
                  <h3>Géneros:</h3>
                  {dataInfoSerie.genres?.length > 0 ? (
                    <ul>
                      {dataInfoSerie.genres.map((genre, index) => (
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
                <FormListEpisodes animeId={dataInfoSerie.mal_id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PageWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <Details />
    </Suspense>
  );
}
