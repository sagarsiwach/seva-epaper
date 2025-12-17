"use client";

import { useState } from "react";
import { Page } from "@/types/edition";
import styles from "./SimpleViewer.module.css";

interface SimpleViewerProps {
  pages: Page[];
  sectionId: string;
}

export function SimpleViewer({ pages }: SimpleViewerProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = pages[currentPageIndex];

  const handlePrevious = () => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPageIndex((prev) => Math.min(prev + 1, pages.length - 1));
  };

  return (
    <div className={styles.container}>
      <div className={styles.viewer}>
        {currentPage ? (
          <>
            <img
              src={currentPage.imageUrl}
              alt={`Page ${currentPage.pageNumber}`}
              className={styles.pageImage}
              onError={(e) => {
                console.error(
                  `Failed to load image: ${currentPage.imageUrl}`,
                  e
                );
              }}
              onLoad={() => {
                console.log(`Loaded image: ${currentPage.imageUrl}`);
              }}
            />
            <div className={styles.pageInfo}>
              Page {currentPageIndex + 1} of {pages.length}
            </div>
          </>
        ) : (
          <div className={styles.noPage}>No pages available</div>
        )}
      </div>

      <div className={styles.controls}>
        <button
          onClick={handlePrevious}
          disabled={currentPageIndex === 0}
          className={styles.button}
        >
          ← Previous
        </button>

        <div className={styles.pageCounter}>
          {currentPageIndex + 1} / {pages.length}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPageIndex === pages.length - 1}
          className={styles.button}
        >
          Next →
        </button>
      </div>

      <div className={styles.thumbnails}>
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={`${styles.thumbnail} ${
              index === currentPageIndex ? styles.active : ""
            }`}
            onClick={() => setCurrentPageIndex(index)}
            title={`Page ${page.pageNumber}`}
          >
            <img
              src={page.imageUrl}
              alt={`Thumbnail ${page.pageNumber}`}
              className={styles.thumbnailImage}
            />
            <span className={styles.thumbnailLabel}>{page.pageNumber}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
