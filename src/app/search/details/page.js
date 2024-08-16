"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import FormListEpisodes from "./formListEpisodes";
import Image from "next/image";
import { RederictIcon, LikeIcon, LikeFillIcon } from "../../icons_data";
import { useSearchParams } from "next/navigation";
import Loader from "src/app/Loader";

const Details = () => {
  const [moreInfo, setMoreInfo] = useState(null);
  const [existingJson, setExistingJson] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const [isLiked, setIsLiked] = useState(false);
  const searchParams = useSearchParams();
  const [queryParam, setQueryParam] = useState("");
  const [tooltip, setTooltip] = useState(""); // State for the tooltip text

  useEffect(() => {
    const q = searchParams.get("q");
    setQueryParam(q);
  }, [searchParams]);

  useEffect(() => {
    const storedMoreInfo = localStorage.getItem("moreInfo");
    const storedJsonData = localStorage.getItem("jsonData");

    if (storedMoreInfo) {
      setMoreInfo(JSON.parse(storedMoreInfo));
    }
    if (storedJsonData) {
      setExistingJson(JSON.parse(storedJsonData));
    }
  }, []);

  useEffect(() => {
    if (moreInfo) {
      const isAlreadyLiked = existingJson.some(
        (serie) => serie.mal_id === moreInfo.mal_id
      );
      setIsLiked(isAlreadyLiked);
      setTooltip(isAlreadyLiked ? "Guardado" : "Guardar");
    }
  }, [moreInfo, existingJson]);

  const handleLikeClick = () => {
    if (isLiked) {
      removeSerie(moreInfo); // Eliminar de existingJson
      setTooltip("Guardar");
    } else {
      saveSerie(moreInfo); // Agregar a existingJson
      setTooltip("Guardado");
    }
    setIsLiked(!isLiked);
  };

  const saveSerie = (serieInfo) => {
    setExistingJson((prevJson) => {
      const updatedJson = [...prevJson, serieInfo];
      localStorage.setItem("existingJson", JSON.stringify(updatedJson));
      return updatedJson;
    });
  };

  const removeSerie = (serieInfo) => {
    setExistingJson((prevJson) => {
      const updatedJson = prevJson.filter(
        (serie) => serie.mal_id !== serieInfo.mal_id
      );
      localStorage.setItem("existingJson", JSON.stringify(updatedJson));
      return updatedJson;
    });
  };

  if (!moreInfo) {
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
                    target="_blank"
                    rel="noopener noreferrer"
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

export default function PageWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <Details />
    </Suspense>
  );
}
