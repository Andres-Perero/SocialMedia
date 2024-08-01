import React, { useState, useEffect } from "react";
import styles from "./Pagination.module.css";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handleGoClick = () => {
    const page = parseInt(inputPage, 10);
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className={styles.pagination}>
      <button onClick={handlePrevClick} disabled={currentPage === 1}>
        Anterior
      </button>
      <input
        type="number"
        value={inputPage}
        min="1"
        max={totalPages}
        onChange={handleInputChange}
        onBlur={handleGoClick} // Go to page when input loses focus
        className={styles.pageInput}
      /> 
       <span>
        de {totalPages}
      </span>
      <button onClick={handleGoClick} disabled={inputPage == currentPage}>
        Ir
      </button>
      <button onClick={handleNextClick} disabled={currentPage === totalPages}>
        Siguiente
      </button>
    </div>
  );
};
