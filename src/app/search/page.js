"use client";

import React, { useEffect, useState } from "react";
import { FormSearchSerie } from "./FormSearchSerie";
import { Pagination } from "./Pagination";
import { Series } from "./Series";
import Link from "next/link";
import styles from "./Page.module.css";
import { HomeIcon } from "../icons_data"; // Import the reset icon

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
    sessionStorage.setItem("currentPage", page);
  };

  useEffect(() => {
    const storedPage = sessionStorage.getItem("currentPage");
    if (storedPage) {
      setCurrentPage(parseInt(storedPage, 10));
      fetchAnime(search, parseInt(storedPage, 10));
    } else {
      fetchAnime();
    }
  }, []);

  const handlePageChange = (newPage) => {
    fetchAnime(search, newPage);
  };

  const resetSearch = () => {
    setAnimeList([]);
    setPagination({});
    setSearch("");
    setCurrentPage(1);
    sessionStorage.removeItem("currentPage");
    fetchAnime();
  };

  return (
    <div className={styles.container}>
      <div className={styles.homeLinkContainer}>
        <Link href={"/"}>
          <h1 className={styles.homeLink}   title="Inicio">{HomeIcon()} </h1>
        </Link>
      </div>
      <FormSearchSerie
        handleSearch={handleSearch}
        search={search}
        setSearch={setSearch}
        resetSearch={resetSearch}
      />
      {pagination.last_visible_page > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.last_visible_page}
          onPageChange={handlePageChange}
          resetSearch={resetSearch}
        />
      )}
      <Series seriesList={animeList} />
      {pagination.last_visible_page > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.last_visible_page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SearchAnime;
