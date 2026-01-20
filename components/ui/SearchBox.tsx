"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense, useRef } from "react";
import Search from "./icons/Search";
import Link from "next/link";
import Image from "next/image";

interface SearchBoxProps {
  label?: string;
}

interface Suggestion {
  _id: string;
  name: string;
  address: {
    line1: string;
    line2?: string;
  };
  image: string;
}

const SearchInput = ({ label }: SearchBoxProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentQuery = searchParams.get("query");
    if (currentQuery) {
      setSearchTerm(currentQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `/api/shop/suggestions?query=${encodeURIComponent(searchTerm)}`,
          { signal },
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.suggestions)) {
            setSuggestions(data.suggestions);
          } else {
            setSuggestions([]);
          }
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching suggestions:", error);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchTerm.trim()) {
      router.push(`/shops?query=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/shops");
    }
  };

  return (
    <div ref={wrapperRef} className="relative sm:w-96 w-full">
      <form
        onSubmit={handleSubmit}
        className="sm:p-2 p-1 border border-blue-500 rounded-full flex items-center bg-white"
      >
        <div className="relative flex w-full items-center">
          <input
            type="text"
            className="bg-transparent w-full outline-none border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-500 pl-2"
            placeholder={label || "Search..."}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            value={searchTerm}
          />
          <button
            type="submit"
            className="absolute right-3 cursor-pointer text-gray-500"
          >
            <Search />
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion._id}
              href={`/shops/${suggestion._id}`}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              onClick={() => setShowSuggestions(false)}
            >
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={suggestion.image}
                  alt={suggestion.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {suggestion.name}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {suggestion.address.line1}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchBox = (props: SearchBoxProps) => {
  return (
    <Suspense
      fallback={
        <div className="sm:w-96 w-44 h-7 bg-gray-100 rounded-full animate-pulse"></div>
      }
    >
      <SearchInput {...props} />
    </Suspense>
  );
};

export default SearchBox;
