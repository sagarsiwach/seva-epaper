"use client";

import { useEffect, useState } from "react";

export default function DebugPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoads, setImageLoads] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchEdition = async () => {
      try {
        const res = await fetch("/api/editions/2024-12-09");
        const edition = await res.json();
        console.log("Edition:", edition);

        if (edition.sections && edition.sections[0]) {
          const section = edition.sections[0];
          if (section.pages && section.pages[0]) {
            const firstPage = section.pages[0];
            console.log("First page:", firstPage);
            setImageUrl(firstPage.imageUrl);

            // Test each image
            const results: Record<string, boolean> = {};
            for (const page of section.pages) {
              try {
                const imgRes = await fetch(page.imageUrl);
                results[page.imageUrl] = imgRes.ok;
                console.log(
                  `Image ${page.pageNumber}: ${page.imageUrl} - ${imgRes.ok ? "✓" : "✗"}`
                );
              } catch (err) {
                results[page.imageUrl] = false;
                console.log(`Image ${page.pageNumber}: ${page.imageUrl} - ERROR`);
              }
            }
            setImageLoads(results);
          }
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchEdition();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Debug Page</h1>
      <h2>Edition 26 - 2024-12-09</h2>

      <h3>Test Image URL:</h3>
      <p>{imageUrl}</p>

      {imageUrl && (
        <>
          <h3>Testing Image:</h3>
          <img
            src={imageUrl}
            alt="test"
            style={{ maxWidth: "400px", border: "1px solid red" }}
            onLoad={() => console.log("Image loaded!")}
            onError={() => console.log("Image failed to load!")}
          />
        </>
      )}

      <h3>Image Loading Results:</h3>
      <ul>
        {Object.entries(imageLoads).map(([url, loaded]) => (
          <li key={url}>
            {loaded ? "✓" : "✗"} {url}
          </li>
        ))}
      </ul>
    </div>
  );
}
