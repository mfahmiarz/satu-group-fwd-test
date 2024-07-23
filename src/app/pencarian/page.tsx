"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/utils/formatDate";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  source: {
    name: string;
  };
  author: string;
  publishedAt: string;
}

const Pencarian = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"terbaru" | "terlama">("terbaru");
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";

  useEffect(() => {
    const fetchArticles = async () => {
      if (query.trim() === "") return;

      setLoading(true);
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            query
          )}&apiKey=01f2ba7350f841c395113185b7a8f168`
        );
        const filteredArticles = response.data.articles.filter(
          (article: Article) => article.urlToImage
        );
        setArticles(filteredArticles);
      } catch (error) {
        console.error("Error fetching the articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [query]);

  useEffect(() => {
    if (sortOrder === "terbaru") {
      setArticles((prevArticles) =>
        [...prevArticles].sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        )
      );
    } else if (sortOrder === "terlama") {
      setArticles((prevArticles) =>
        [...prevArticles].sort(
          (a, b) =>
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
        )
      );
    }
  }, [sortOrder]);

  const handleSaveArticle = (article: Article) => {
    const savedArticles = JSON.parse(
      localStorage.getItem("savedArticles") || "[]"
    );
    if (!savedArticles.some((a: Article) => a.url === article.url)) {
      savedArticles.push(article);
      localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-20 py-8">
        <div className="mb-8">
          <Skeleton height={40} width={200} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex flex-col">
                <div className="border rounded-lg shadow-md overflow-hidden">
                  <Skeleton height={200} />
                  <div className="p-4">
                    <Skeleton count={1} height={30} />
                    <Skeleton count={2} height={20} />
                    <Skeleton count={1} height={20} width={100} />
                    <Skeleton count={1} height={20} width={150} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-20 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">
          Hasil Pencarian untuk "{query}"
        </h1>
        <div>
          <label htmlFor="sortOrder" className="mr-2">
            Urutkan dari:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "terbaru" | "terlama")
            }
            className="p-2 border rounded-lg"
          >
            <option value="terbaru">Terbaru</option>
            <option value="terlama">Terlama</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {articles.map((article, index) => (
          <div
            key={index}
            className="border rounded-lg shadow-md overflow-hidden"
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSaveArticle(article)}
            >
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover hover:opacity-90 active:opacity-100 hover:cursor-pointer"
              />
            </a>
            <div className="p-4">
              <h2 className="text-lg font-semibold line-clamp-2">
                {article.title}
              </h2>
              <p className="text-md text-gray-600 line-clamp-2">
                {article.description}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {article.author || "Unknown author"} -{" "}
                {formatDate(article.publishedAt)}
              </p>
              <p className="text-gray-500 text-sm">{article.source.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pencarian;
