"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import debounce from "lodash/debounce";
import { formatDate } from '@/utils/formatDate';

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

const App = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchArticles = async (query: string) => {
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

  // Debounced fetch function
  const debouncedFetchArticles = useCallback(
    debounce((query: string) => fetchArticles(query), 500),
    []
  );

  useEffect(() => {
    debouncedFetchArticles(searchQuery || "viral");
  }, [searchQuery, debouncedFetchArticles]);

  useEffect(() => {
    const filterArticles = () => {
      const query = searchQuery.toLowerCase();
      const results = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query)
      );
      setFilteredArticles(results);
    };

    filterArticles();
  }, [searchQuery, articles]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderArticleSkeleton = () => (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <Skeleton height={200} />
      <div className="p-4">
        <Skeleton count={1} height={30} />
        <Skeleton count={2} height={20} />
        <Skeleton count={1} height={20} width={100} />
        <Skeleton count={1} height={20} width={150} />
      </div>
    </div>
  );

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {Array(2)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex flex-col">
                {renderArticleSkeleton()}
              </div>
            ))}
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array(2)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex flex-col">
                {renderArticleSkeleton()}
              </div>
            ))}
        </div>
      </div>
    );
  }

  const [mainArticle1, ...remainingArticles] = filteredArticles;
  const [smallArticles1, [mainArticle2, ...smallArticles2]] = [
    remainingArticles.slice(0, 4),
    remainingArticles.slice(4, 9),
  ];

  return (
    <div className="container mx-auto py-8 px-20">
      {/* Input Pencarian */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Pencarian cepat..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* SESI 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {mainArticle1 && (
          <div className="md:col-span-1 border rounded-lg shadow-md overflow-hidden">
            <a
              href={mainArticle1.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSaveArticle(mainArticle1)}
            >
              <img
                src={mainArticle1.urlToImage}
                alt={mainArticle1.title}
                className="w-full h-96 object-cover hover:opacity-90 active:opacity-100 hover:cursor-pointer"
              />
            </a>
            <div className="p-4">
              <h2 className="text-4xl font-semibold line-clamp-2">
                {mainArticle1.title}
              </h2>
              <p className="text-lg text-gray-600 line-clamp-2">
                {mainArticle1.description}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {mainArticle1.author || "Unknown author"} - {formatDate(mainArticle1.publishedAt)}
              </p>
              <p className="text-gray-500 text-sm">
                {mainArticle1.source.name}
              </p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-8">
          {smallArticles1.map((article, index) => (
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
                  className="w-full h-36 object-cover hover:opacity-90 active:opacity-100 hover:cursor-pointer"
                />
              </a>
              <div className="p-4">
                <h2 className="text-sm font-semibold line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {article.description}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  {article.author || "Unknown author"} - {formatDate(article.publishedAt)}
                </p>
                <p className="text-gray-500 text-xs">{article.source.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SESI 2 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-8">
          {smallArticles2.map((article, index) => (
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
                  className="w-full h-36 object-cover hover:opacity-90 active:opacity-100 hover:cursor-pointer"
                />
              </a>
              <div className="p-4">
                <h2 className="text-sm font-semibold line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {article.description}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  {article.author || "Unknown author"} - {formatDate(article.publishedAt)}
                </p>
                <p className="text-gray-500 text-xs">{article.source.name}</p>
              </div>
            </div>
          ))}
        </div>
        {mainArticle2 && (
          <div className="md:col-span-1 border rounded-lg shadow-md overflow-hidden">
            <a
              href={mainArticle2.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSaveArticle(mainArticle2)}
            >
              <img
                src={mainArticle2.urlToImage}
                alt={mainArticle2.title}
                className="w-full h-96 object-cover hover:opacity-90 active:opacity-100 hover:cursor-pointer"
              />
            </a>
            <div className="p-4">
              <h2 className="text-2xl font-semibold line-clamp-2">
                {mainArticle2.title}
              </h2>
              <p className="text-gray-600 line-clamp-2">
                {mainArticle2.description}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {mainArticle2.author || "Unknown author"} - {formatDate(mainArticle2.publishedAt)}
              </p>
              <p className="text-gray-500 text-sm">
                {mainArticle2.source.name}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
