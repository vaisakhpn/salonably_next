"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Search from "./icons/Search";

interface SearchBoxProps {
  label?: string;
}

const SearchInput = ({ label }: SearchBoxProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const currentQuery = searchParams.get("query");
    if (currentQuery) {
      setSearchTerm(currentQuery);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shops?query=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/shops");
    }
  };

  return (
    <div className="sm:w-96 w-56">
      <form
        onSubmit={handleSubmit}
        className="p-2  border border-blue-500 rounded-full flex items-center bg-white"
      >
        <div className=" relative flex w-full items-center">
          <input
            type="text"
            className="bg-transparent  w-full outline-none border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-500"
            placeholder={label || "Search..."}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button type="submit" className="absolute right-3 cursor-pointer text-gray-500">
            <Search />
          </button>
        </div>
      </form>
    </div>
  );
};

const SearchBox = (props: SearchBoxProps) => {
  return (
    <Suspense fallback={<div className="sm:w-96 w-56 h-10 bg-gray-100 rounded-full animate-pulse"></div>}>
      <SearchInput {...props} />
    </Suspense>
  );
};

export default SearchBox;
