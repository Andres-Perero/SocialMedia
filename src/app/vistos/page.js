"use client";
import styles from "./Vistos.module.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Loader from "../Loader";
import { updateJsonFile } from "src/lib/updateDataFetch";
import { getDataViewedFetch } from "src/lib/getDataViewedFetch";
import Image from "next/image";

const Vistos = () => {
  const searchParams = useSearchParams();
  const [queryParam, setQueryParam] = useState("");
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seen, setSeen] = useState([]);
  const folderId =
    process.env.NEXT_PUBLIC_SOCIAL_MEDIA_FOLDER_DATA_VIEWED_PER_USER;

  // Obtener el parámetro de búsqueda de la URL
  useEffect(() => {
    const q = searchParams.get("q");
    setQueryParam(q);
  }, [searchParams]);

  // Cargar los datos iniciales desde localStorage y realizar la petición a la API
  useEffect(() => {
    if (!folderId || !queryParam) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getDataViewedFetch(folderId, queryParam);
        setJsonData(data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [folderId, queryParam]);

  // Actualizar el estado 'seen' 
  useEffect(() => {
    setSeen(jsonData.map((item) => item.isWatched));
  }, [jsonData]);

  // Alternar el estado 'statusViewed' cuando se haga clic en una estrella
  const toggleSeen = (index) => {
    setSeen((prevSeen) =>
      prevSeen.map((item, i) => (i === index ? !item : item))
    );
    setJsonData((prevData) =>
      prevData.map((item, i) =>
        i === index ? { ...item, isWatched: !item.isWatched } : item
      )
    );
  };

  // Guardar los cambios en el servidor
  const handleSaveChanges = async () => {
    try {
      localStorage.setItem("existingJson", JSON.stringify(jsonData));
      await updateJsonFile({
        folderId,
        fileName: queryParam,
        newData: jsonData,
      });
      alert("Cambios guardados exitosamente.");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Hubo un error al guardar los cambios.");
    }
  };
  const handleClick = (item) => {
    localStorage.setItem("moreInfo", JSON.stringify(item));
   
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
   
      <div className={styles.homeLinkContainer}>
        <Link href={{ pathname: "/", query: { q: queryParam } }}>
          <h1 className={styles.homeLink} title="Inicio">
            Inicio
          </h1>
        </Link>
        <Link href={{ pathname: "/search", query: { q: queryParam } }}>
          <h1 className={styles.homeLink} title="Biblioteca">
          BIBLIOTECA
          </h1>
        </Link>
      </div>
      <button onClick={handleSaveChanges}>Guardar Cambios</button>
      <div className={styles.gridContainer}>
        {jsonData.map((item, index) => (
          <div key={index} className={styles.card}>
            <Link
              href={{
                pathname: "/search/details",
                query: { q: queryParam },
              }}
              onClick={() => handleClick(item)}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={item.images?.jpg?.image_url}
                  alt={item.title}
                  className={styles.mangaImage}
                  fill
                  priority
                  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <span className={styles.badge}>{item.title}</span>
              </div>{" "}
            </Link>
            <div className={styles.cardContent}>
              <div className={styles.ratingContainer}>
                <span className={styles.ratingText}>Caps {item.episodes}</span>
                <StarIcon
                  className={styles.starIcon}
                  onClick={() => toggleSeen(index)}
                  status={seen[index] ? "Visto" : "Pendiente"}
                  isSeen={seen[index]}
                />
              </div>
              <div className={styles.descriptionContainer}>
                <BookIcon className={styles.bookIcon} />
                {item.genres?.slice(0, 2).map((genre, i) => (
                  <span key={i} className={styles.descriptionText}>
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente StarIcon para renderizar el icono de estrella
function StarIcon({ status, isSeen, ...props }) {
  return (
    <div className={styles.tooltipContainer}>
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isSeen ? "#fbbf24" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <div className={styles.tooltip}>{status}</div>
    </div>
  );
}
function BookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}
// Componente que envuelve Vistos en Suspense
const WrappedVistos = () => (
  <Suspense fallback={<Loader />}>
    <Vistos />
  </Suspense>
);

export default WrappedVistos;
