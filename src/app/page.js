"use client";

import Head from "next/head";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import styles from "./page.module.css";
import Loader from "./Loader";

const DynamicPageContent = dynamic(() => import("./PageContent.js"), {
  suspense: true,
});

export default function Page() {
  return (
    <div className={styles.container}>
      <Head>
        <title>WebPage</title>
        <meta name="description" content="Horario de Animes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Suspense fallback={<Loader />}>
          <DynamicPageContent />
        </Suspense>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Social Media</p>
      </footer>
    </div>
  );
}
