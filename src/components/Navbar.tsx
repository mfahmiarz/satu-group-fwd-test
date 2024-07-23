"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import debounce from "lodash/debounce";
import { useRouter, useSearchParams } from "next/navigation";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const performSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/pencarian?query=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => performSearch(query), 500),
    []
  );

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  return (
    <nav className="px-20 pt-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-semibold">
          <img
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=388,fit=crop,q=95/YX41e9wK07ikx6kP/satu-group-merah-2-AVL3wPZM8kSqxaN7.png"
            loading="lazy"
            width={200}
            className="hover:opacity-90 active:opacity-100"
          ></img>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/riwayat" className="text-slate-900 hover:underline hover:underline-offset-2">
            Riwayat
          </Link>
          <input
            type="text"
            placeholder="Pencarian lengkap..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 border rounded-lg"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
