"use client";

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Link
        href={{
          pathname: "/",
          query: { q: queryParam },
        }}
      >
        <p>INICIO</p>
      </Link>

      <div>
        {queryParam ? (
          <p>Buscaste: {queryParam}</p>
        ) : (
          <p>No se pasó ningún parámetro de consulta.</p>
        )}
      </div>

      <div>
        {jsonData ? (
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        ) : (
          <p>No se encontraron datos.</p>
        )}
      </div>
    </div>
  );
};

const WrappedVistos = () => (
  <Suspense fallback={<Loader />}>
    <Vistos />
  </Suspense>
);

export default WrappedVistos;
