import React from "react";
import Link from "next/link";
import ShopCard, { ShopData } from "../ShopCard";
import ComingSoonArea from "../ComingSoonArea";

interface AllShopsProps {
  shops: ShopData[];
  currentPage: number;
  totalPages: number;
  query?: string;
}

const AllShops: React.FC<AllShopsProps> = ({
  shops,
  currentPage,
  totalPages,
  query,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ---------- Header ---------- */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-900">
          {query ? `Search Results for "${query}"` : "Salons"}
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          {query
            ? `Showing salons matching your search`
            : `Book your preferred time slot instantly`}
        </p>
      </div>

      {/* ---------- Shop Grid ---------- */}
      {shops.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </div>
      ) : (
        <ComingSoonArea query={query} />
      )}

      {/* ---------- Pagination ---------- */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-4">
          <Link
            href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              currentPage > 1
                ? "bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent"
            }`}
            aria-disabled={currentPage <= 1}
          >
            Previous
          </Link>

          <span className="text-sm font-medium text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <Link
            href={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              currentPage < totalPages
                ? "bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent"
            }`}
            aria-disabled={currentPage >= totalPages}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
};

export default AllShops;
