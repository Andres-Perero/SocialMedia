import React, { useEffect, useState } from "react";
import styles from "./formListEpisodes.module.css";

const FormListEpisodes = ({ animeId }) => {
  const [listEpisodes, setListEpisodes] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchEpisodes = async (id) => {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`);
    const data = await res.json();
    setListEpisodes(data.data);
    setPagination(data.pagination);
  };

  useEffect(() => {
    fetchEpisodes(animeId);
  }, [animeId]);

  return (
    <div className={styles.container}>
      {listEpisodes.length > 0 ? (
        <ul className={styles.episodeList}>
          {listEpisodes.map((episode, index) => (
            <li key={episode.mal_id}>
              {index + 1}. {episode.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron capítulos.</p>
      )}
    </div>
  );
};

export default FormListEpisodes;
