"use client";
import styles from "./Vistos.module.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { fetchJsonData } from "src/lib/getdataFetch";
import Loader from "../Loader";

const Vistos = () => {
  const searchParams = useSearchParams();
  const [queryParam, setQueryParam] = useState("");
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seen, setSeen] = useState(new Array(10).fill(false)); // Initial state for all items
  const folderId = process.env.NEXT_PUBLIC_SOCIAL_MEDIA_FOLDER_DATA_VIEWED_PER_USER;

  useEffect(() => {
    const q = searchParams.get("q");
    setQueryParam(q);
  }, [searchParams]);

  useEffect(() => {
    if (!folderId || !queryParam) return; // Verifica que tengas todos los datos necesarios
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchJsonData(folderId, queryParam);
        setJsonData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [folderId, queryParam]);

  const toggleSeen = (index) => {
    setSeen((prevSeen) =>
      prevSeen.map((item, i) => (i === index ? !item : item))
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div>
        <Link
          href={{
            pathname: "/",
            query: { q: queryParam },
          }}
        >
          <p>INICIO</p>
        </Link>
        <Link
            href={{
              pathname: "/search",
              query: { q: queryParam },
            }}
          >    <p>BIBLIOTECA</p>
        </Link>
      </div>
      <div className={styles.gridContainer}>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageContainer}>
              <img
                src="image/img_placeholderAnime.jpg"
                alt="Manga Cover"
                className={styles.mangaImage}
              />
              <span className={styles.badge}>Manga Title</span>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.ratingContainer}>
                <span className={styles.ratingText}>Caps 12</span>

                <StarIcon
                  className={styles.starIcon}
                  onClick={() => toggleSeen(index)}
                  status={seen[index] ? "Visto" : "Pendiente"}
                  isSeen={seen[index]}
                />
              </div>
              <div className={styles.descriptionContainer}>
                <BookIcon className={styles.bookIcon} />
                <span className={styles.descriptionText}>
                Gener1
                </span>
                <span className={styles.descriptionText}>
                Gener2
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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

function StarIcon({ status, isSeen, ...props }) {
  return (
    <div className={styles.tooltipContainer}>
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isSeen ? "#fbbf24" : "none"} // Fill color based on state
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

const WrappedVistos = () => (
  <Suspense fallback={<Loader />}>
    <Vistos />
  </Suspense>
);

export default WrappedVistos;
