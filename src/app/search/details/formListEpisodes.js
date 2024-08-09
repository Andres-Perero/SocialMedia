import React, { useEffect, useState } from "react";
import styles from "./formListEpisodes.module.css";

const FormListEpisodes = ({ animeId }) => {
  const [listEpisodes, setListEpisodes] = useState([]); // Asegurarse de que sea un array
  const [lastVisiblePage, setLastVisiblePage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEpisodes = async (id, page = 1) => {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes?page=${page}`);
      const data = await res.json();
      if (data && data.data) {
        setListEpisodes(data.data); // Asegurarse de que data.data exista
        setLastVisiblePage(data.pagination?.last_visible_page || 1);
        setHasNextPage(data.pagination?.has_next_page || false);
      } else {
        setListEpisodes([]); // En caso de que no haya datos, asegurar un array vacío
      }
    } catch (error) {
      console.error("Error fetching episodes:", error);
      setListEpisodes([]); // En caso de error, asegurar un array vacío
    }
  };

  useEffect(() => {
    fetchEpisodes(animeId, currentPage);
  }, [animeId, currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className={styles.container}>
      {listEpisodes.length > 0 ? (
        <>
          <ul className={styles.episodeList}>
            {listEpisodes.map((episode) => (
              <li key={episode.mal_id}>
                {episode.mal_id}. {episode.title}
              </li>
            ))}
          </ul>
          <div className={styles.pagination}>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>Página {currentPage} de {lastVisiblePage}</span>
            <button
              onClick={handleNextPage}
              disabled={!hasNextPage}
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p>No se encontraron capítulos.</p>
      )}
    </div>
  );
};

export default FormListEpisodes;
