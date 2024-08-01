"use client";

import { useEffect, useState } from "react";
import { FormSearchSerie } from "./FormSearchSerie";
import { Pagination } from "./Pagination";
import { Series } from "./Series";
import Link from "next/link";
import styles from "./Page.module.css";
// API methods: { search, top }
//https://docs.api.jikan.moe/
// https://jikan.docs.apiary.io/#introduction/v4-rest-api-release

const SearchAnime = () => {
  const [animeList, setAnimeList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnime(search, 1);
  };

  const fetchAnime = async (query = "", page = 1) => {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${query}&page=${page}`
    );
    const data = await res.json();
    setAnimeList(data.data);
    setPagination(data.pagination);
    setCurrentPage(page);

  };

  useEffect(() => {
    fetchAnime();
  }, []);

  const handlePageChange = (newPage) => {
    fetchAnime(search, newPage);
  };

  return (
    <div className={styles.container}>
       <Link href={"/"}> <p>INICIO</p></Link>
      <FormSearchSerie
        handleSearch={handleSearch}
        search={search}
        setSearch={setSearch}
        animeList={animeList}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.last_visible_page}
        onPageChange={handlePageChange}
      />
      <Series seriesList={animeList} />
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.last_visible_page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SearchAnime;
