"use client";
import React, { useEffect, useState, Suspense, useCallback } from "react";
import { FormSearchSerie } from "./FormSearchSerie";
import { Pagination } from "./Pagination";
import { Series } from "./Series";
import Link from "next/link";
import styles from "./Page.module.css";
import { useSearchParams } from "next/navigation";
import Loader from "../Loader";
import { updateJsonFile } from "src/lib/updateDataFetch";
import { getDataViewedFetch } from "src/lib/getDataViewedFetch";

const SearchAnime = () => {
  return (
    <Suspense fallback={<Loader />}>
      <SearchAnimeContent />
    </Suspense>
  );
};

const SearchAnimeContent = () => {
  const searchParams = useSearchParams();
  const [animeList, setAnimeList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParam, setQueryParam] = useState("");
  const [loading, setLoading] = useState(true);
  const [jsonData, setJsonData] = useState([]);
  const [dataInfoSerie, setDataInfoSerie] = useState(null);
  const folderId =
    process.env.NEXT_PUBLIC_SOCIAL_MEDIA_FOLDER_DATA_VIEWED_PER_USER;

  // Effect to handle search parameters
  useEffect(() => {
    const q = searchParams.get("q");
    setQueryParam(q);

    const storedSearch = sessionStorage.getItem("search");
    const storedAnimeList = sessionStorage.getItem("animeList");
    const storedPagination = sessionStorage.getItem("pagination");
    const storedPage = sessionStorage.getItem("currentPage");
    const storedMoreInfo = localStorage.getItem("moreInfo");

    if (storedSearch && storedAnimeList && storedPagination && storedPage) {
      setSearch(storedSearch);
      setAnimeList(JSON.parse(storedAnimeList));
      setPagination(JSON.parse(storedPagination));
      setCurrentPage(parseInt(storedPage, 10));
    } else {
      fetchAnime(search, parseInt(storedPage, 10) || 1);
    }

    if (storedMoreInfo) {
      setDataInfoSerie(JSON.parse(storedMoreInfo));
    }
  }, [searchParams]);

  // Fetch data for viewed anime
  useEffect(() => {
    if (!folderId || !queryParam) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getDataViewedFetch(folderId, queryParam);
        setJsonData(data);

        if (dataInfoSerie) {
          handleDataMerge(data, dataInfoSerie);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [folderId, queryParam, dataInfoSerie]);

  // Function to merge and update jsonData
  const handleDataMerge = async (data, infoSerie) => {
    if (Object.keys(data).length === 0 && infoSerie.isSaved) {
      setJsonData([infoSerie]);
      await updateJsonFile({
        folderId,
        fileName: queryParam,
        newData: [infoSerie],
      });
    } else if (data.length > 0) {
      const existingEntry = data.find(
        (item) => item.mal_id === infoSerie.mal_id
      );

      if (!existingEntry && infoSerie.isSaved) {
        const updatedJson = [...data, infoSerie];
        setJsonData(updatedJson);
        await updateJsonFile({
          folderId,
          fileName: queryParam,
          newData: updatedJson,
        });
      } else if (existingEntry && !infoSerie.isSaved) {
        const updatedJson = data.filter(
          (item) => item.mal_id !== infoSerie.mal_id
        );
        setJsonData(updatedJson);
        await updateJsonFile({
          folderId,
          fileName: queryParam,
          newData: updatedJson,
        });
      }
    }
  };

  // Update animeList with jsonData
  useEffect(() => {
    if (Array.isArray(jsonData)) {
      setAnimeList((prevAnimeList) =>
        prevAnimeList.map((anime) => {
          const matchingJsonData = jsonData.find(
            (item) => item.mal_id === anime.mal_id
          );
          return matchingJsonData ? { ...anime, ...matchingJsonData } : anime;
        })
      );
    }
  }, [jsonData, pagination]);

  // Fetch anime list from API
  const fetchAnime = useCallback(async (query = "", page = 1) => {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${query}&page=${page}`
    );
    const data = await res.json();

    setAnimeList(
      data.data.map((item) => ({
        ...item,
        isWatched: false,
        isSaved: false,
      }))
    );

    setPagination(data.pagination);
    setCurrentPage(page);

    sessionStorage.setItem("search", query);
    sessionStorage.setItem("animeList", JSON.stringify(data.data));
    sessionStorage.setItem("pagination", JSON.stringify(data.pagination));
    sessionStorage.setItem("currentPage", page);
  }, []);

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

    //sessionStorage.clear();
    localStorage.removeItem("moreInfo");

    fetchAnime();
  };

  const handleClick = () => {
    localStorage.setItem("existingJson", JSON.stringify(jsonData));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.homeLinkContainer}>
        <Link href={{ pathname: "/", query: { q: queryParam } }}>
          <h1 className={styles.homeLink} title="Inicio">
            Inicio
          </h1>
        </Link>
        <Link
          href={{ pathname: "/vistos", query: { q: queryParam } }}
          onClick={handleClick}
        >
          <h1 className={styles.homeLink} title="Vistos">
            Vistos
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

      <Series
        seriesList={animeList}
        queryParam={queryParam}
        jsonData={jsonData}
      />

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
