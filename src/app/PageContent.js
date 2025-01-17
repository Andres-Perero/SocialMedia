//PageContent
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./pageContent.module.css";
import { fetchJsonData } from "src/lib/getdataFetch";
import Loader from "./Loader";
import {
  InstagramIcon,
  OkruIcon,
  TwitchIcon,
  YoutubeIcon,
  TiktokIcon,
  TwitterXIcon,
  DiscordIcon,
} from "./icons";

const iconComponents = {
  InstagramIcon,
  OkruIcon,
  TwitchIcon,
  YoutubeIcon,
  TiktokIcon,
  TwitterXIcon,
  DiscordIcon,
};

export default function PageContent() {
  const searchParams = useSearchParams();
  const [queryParam, setQueryParam] = useState("");
  const [jsonData, setJsonData] = useState(null);
  const folderId = process.env.NEXT_PUBLIC_SOCIAL_MEDIA_FOLDER_DATA_USER;

  useEffect(() => {
    const q = searchParams.get("q");
    setQueryParam(q);
  }, [searchParams]);

  useEffect(() => {
    if (!queryParam) return;
    const fetchData = async () => {
      try {
        const data = await fetchJsonData(folderId, queryParam);
        setJsonData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [folderId, queryParam]);

  useEffect(() => {
    if (!jsonData) return;

    const elements = document.querySelectorAll(
      `.${styles.animeImage}, .${styles.contactImage}`
    );

    const handleMouseMove = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateX = (y / rect.height - 0.5) * 40;
      const rotateY = (x / rect.width - 0.5) * -40;

      event.currentTarget.style.transform = `scale(1.1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = (event) => {
      event.currentTarget.style.transform = `scale(1) rotateX(0) rotateY(0)`;
    };

    elements.forEach((element) => {
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      elements.forEach((element) => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [jsonData]);

  useEffect(() => {
    if (!jsonData) return;

    const daysOfWeekInSpanish = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const tableHeaderCells = document.querySelectorAll(
      `.${styles.scheduleTable} th`
    );
    const tableBodyCells = document.querySelectorAll(
      `.${styles.scheduleTable} td`
    );

    tableHeaderCells.forEach((cell) => {
      if (cell.textContent === daysOfWeekInSpanish[dayOfWeek]) {
        cell.classList.add(styles.currentDay);
      }
    });

    tableBodyCells.forEach((cell, index) => {
      const cellIndex = index % 7;
      if (
        tableHeaderCells[cellIndex].textContent ===
        daysOfWeekInSpanish[dayOfWeek]
      ) {
        cell.classList.add(styles.currentDay);
      }
    });
  }, [jsonData]);

  if (!jsonData) {
    return <Loader />;
  }

  const { description, socials, animeImages, links } = jsonData;

  return (
    <>
      {/* Primera fila: Descripción, Vistos, Biblioteca, Torneo */}
      <div className={styles.firstRow}>
        <section className={styles.description}>
          <h2>{description.name}</h2>
          <h3>{description.title}</h3>
          <p>{description.bio}</p>
          <div className={styles.socials}>
            {socials.map((social) => {
              const IconComponent = iconComponents[social.icon];
              return (
                <a
                  key={social.name}
                  href={social.link}
                  data-tooltip={social.name}
                >
                  <IconComponent />
                </a>
              );
            })}
          </div>
        </section>

        <section className={styles.anime}>
          <Link
            href={{
              pathname: "/vistos",
              query: { q: queryParam },
            }}
          >
            <h2>VISTOS</h2>
            <div className={styles.animeImage}>
              <Image
                src={animeImages.img_folderAnime}
                alt="Anime Vistos"
                width={500}
                height={200}
                style={{ objectFit: "cover" }}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>
        </section>

        <section className={styles.anime}>
          <Link
            href={{
              pathname: "/search",
              query: { q: queryParam },
            }}
          >
            <h2>BIBLIOTECA</h2>
            <div className={styles.animeImage}>
              <Image
                src={animeImages.img_folderAnime}
                alt="Anime Biblioteca"
                width={500}
                height={200}
                style={{ objectFit: "cover" }}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>
        </section>

        <section className={styles.contact}>
          <Link href={links.battleSong} target="_blank">
            <h2>TORNEO DE OPENINGS</h2>
            <div className={styles.contactImage}>
              <Image
                src={animeImages.img_battleSong}
                alt="Battle Song"
                width={500}
                height={200}
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </Link>
        </section>
      </div>

      {/* Segunda fila: Horario - Cronograma */}
      <section className={styles.schedule}>
        <h2>HORARIO - CRONOGRAMA</h2>
        <table className={styles.scheduleTable}>
          <thead>
            <tr>
              {jsonData.schedule.header.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jsonData.schedule.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
