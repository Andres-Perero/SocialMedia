"use client"

import React, { useEffect, useState } from "react";
import { FormSearchSerie } from "./FormSearchSerie";
import { Pagination } from "./Pagination";
import { Series } from "./Series";
import Link from "next/link";
import styles from "./Page.module.css";
import { HomeIcon } from "../icons_data";
import { useSearchParams } from "next/navigation";
import Loader from "../Loader";

const SearchAnime = () => {
  const [animeList, setAnimeList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const [queryParam, setQueryParam] = useState("");
 
  useEffect(() => {
    const q = searchParams.get("q");
    setQueryParam(q);

    const storedSearch = sessionStorage.getItem("search");
    const storedAnimeList = sessionStorage.getItem("animeList");
    const storedPagination = sessionStorage.getItem("pagination");
    const storedPage = sessionStorage.getItem("currentPage");

    if (storedSearch && storedAnimeList && storedPagination && storedPage) {
      setSearch(storedSearch);
      setAnimeList(JSON.parse(storedAnimeList));
      setPagination(JSON.parse(storedPagination));
      setCurrentPage(parseInt(storedPage, 10));
    } else {
       fetchAnime(search, (parseInt(storedPage, 10) != null && !isNaN(parseInt(storedPage, 10))) ? parseInt(storedPage, 10) : 1);
    }
  }, []);

  const fetchAnime = async (query = "", page) => {
    const currentPage = page ?? 1;

    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${query}&page=${currentPage}`
    );
    const data = await res.json();

    setAnimeList(data.data);
    setPagination(data.pagination);
    setCurrentPage(currentPage);

    sessionStorage.setItem("search", query);
    sessionStorage.setItem("animeList", JSON.stringify(data.data));
    sessionStorage.setItem("pagination", JSON.stringify(data.pagination));
    sessionStorage.setItem("currentPage", currentPage);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnime(search, 1);
  };

  const handlePageChange = (newPage) => {
    fetchAnime(search, newPage);
  };

  const resetSearch = () => {
    setAnimeList([]);
    setPagination({});
    setSearch("");
    setCurrentPage(1);
    sessionStorage.removeItem("search");
    sessionStorage.removeItem("animeList");
    sessionStorage.removeItem("pagination");
    sessionStorage.removeItem("currentPage");
    localStorage.removeItem("moreInfo");
    fetchAnime();
  };

  return (
    <div className={styles.container}>
      <div className={styles.homeLinkContainer}>
        <Link
          href={{
            pathname: "/",
            query: { q: queryParam },
          }}
        >
          <h1 className={styles.homeLink} title="Inicio">
            {HomeIcon()}{" "}
          </h1>
        </Link>
      </div>
      <FormSearchSerie
        handleSearch={handleSearch}
        search={search}
        setSearch={setSearch}
        resetSearch={resetSearch}
      />

      {pagination.last_visible_page && pagination.last_visible_page > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.last_visible_page}
          onPageChange={handlePageChange}
        />
      )}
      
      <Series seriesList={animeList} queryParam={queryParam} />
      {pagination.last_visible_page && pagination.last_visible_page > 1 && (
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
