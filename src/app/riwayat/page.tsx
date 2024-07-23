"use client";

import { useEffect, useState } from "react";

interface Article {
  title: string;
  url: string;
  urlToImage: string;
  source: {
    name: string;
  };
}

const SavedArticles = () => {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    setSavedArticles(saved);
  }, []);

  return (
    <div className="container mx-auto px-20 py-8">
      <h1 className="text-2xl font-semibold mb-4">Riwayat</h1>
      <ul className="list-none p-0">
        {savedArticles.map((article, index) => (
          <li key={index} className="flex items-center border-b border-gray-200 py-4">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full"
            >
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-20 h-20 object-cover mr-4 rounded-lg"
              />
              <div className="flex flex-col">
                <p className="font-semibold text-lg truncate">{article.title}</p>
                <p className="text-gray-600 text-sm truncate">{article.url}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedArticles;
