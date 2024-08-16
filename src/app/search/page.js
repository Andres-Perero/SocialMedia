"use client";
import React, { useEffect, useState, Suspense } from "react";
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
  const [existingJson, setExistingJson] = useState([]); // Inicializa como array vacío
  const [jsonData, setJsonData] = useState(null);
  const [dataTemp, setDataTemp] = useState([]);
  const [rederictPagViewed, setRederictPagViewed] = useState(false);
  const folderId =
    process.env.NEXT_PUBLIC_SOCIAL_MEDIA_FOLDER_DATA_VIEWED_PER_USER;

  useEffect(() => {
    const q = searchParams.get("q");
    setQueryParam(q);

    const storedSearch = sessionStorage.getItem("search");
    const storedAnimeList = sessionStorage.getItem("animeList");
    const storedPagination = sessionStorage.getItem("pagination");
    const storedPage = sessionStorage.getItem("currentPage");
    
    const storedExistingJson = localStorage.getItem("existingJson");
    const storedDataTemp = sessionStorage.getItem("dataTemp");
    const storedRederictPagViewed = localStorage.getItem("rederictPagViewed");

    if (storedSearch && storedAnimeList && storedPagination && storedPage) {
      setSearch(storedSearch);
      setAnimeList(JSON.parse(storedAnimeList));
      setPagination(JSON.parse(storedPagination));
      setCurrentPage(parseInt(storedPage, 10));
    } else {
      fetchAnime(search, parseInt(storedPage, 10) || 1);
    }
    if (storedRederictPagViewed) {
      setRederictPagViewed(JSON.parse(storedRederictPagViewed));
    }
    if (storedExistingJson) {
      setExistingJson(JSON.parse(storedExistingJson));
    }
    if (storedDataTemp) {
      setDataTemp(JSON.parse(storedDataTemp));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!folderId || !queryParam) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        if (rederictPagViewed) setDataTemp(existingJson);
        if (
          existingJson.length > 0 &&
          JSON.stringify(dataTemp) == JSON.stringify(existingJson)
        ) {
          setJsonData(existingJson);
        } else {
          const data = await getDataViewedFetch(folderId, queryParam);

          setJsonData(data);

          sessionStorage.setItem("dataTemp", JSON.stringify(data));
          if (
            data.length === 0 ||
            JSON.stringify(existingJson) !== JSON.stringify(data)
          ) {
            setJsonData(existingJson);
            await updateJsonFile({
              folderId,
              fileName: queryParam,
              newData: existingJson,
            });
            sessionStorage.setItem("dataTemp", JSON.stringify(existingJson));
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [folderId, queryParam, existingJson, dataTemp]);

  const fetchAnime = async (query = "", page = 1) => {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${query}&page=${page}`
    );
    const data = await res.json();

    setAnimeList(
      data.data.map((item) => ({
        ...item,
        statusViewed: false, // Inicialmente todos en false
      }))
    );

    setPagination(data.pagination);
    setCurrentPage(page);

    sessionStorage.setItem("search", query);
    sessionStorage.setItem("animeList", JSON.stringify(data.data));
    sessionStorage.setItem("pagination", JSON.stringify(data.pagination));
    sessionStorage.setItem("currentPage", page);
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
  const handleClick = () => {
    localStorage.setItem("existingJson", JSON.stringify(jsonData));
    // localStorage.setItem("jsonData", JSON.stringify(jsonData));
    // No es necesario guardar jsonData aquí ya que ya se maneja en SearchAnime
  };

  if (loading) {
    return <Loader />;
  }

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
            Inicio
          </h1>
        </Link>
        <Link
          href={{
            pathname: "/vistos",
            query: { q: queryParam },
          }}
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
        seriesList={animeList} //este es el fetch de la lista anime
        queryParam={queryParam} // parametro ID de cual buscar
        jsonData={jsonData} // este es el fetch de la lista que estan guardados en la base
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
