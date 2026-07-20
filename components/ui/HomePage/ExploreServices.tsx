import React from "react";
import Link from "next/link";

const ExploreServices = () => {
  const services = [
    {
      name: "Haircut",
      price: "₹199",
      icon: (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 0L4 4m5.121 5.121L4 14"
          />
        </svg>
      ),
      query: "haircut",
    },
    {
      name: "Hair Color",
      price: "₹799",
      icon: (
        <svg
          className="w-8 h-8 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      query: "haircolor",
    },
    {
      name: "Facial",
      price: "₹499",
      icon: (
        <svg
          className="w-8 h-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      query: "facial",
    },
    {
      name: "Manicure",
      price: "₹299",
      icon: (
        <svg
          className="w-8 h-8 text-pink-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5a1.5 1.5 0 013 0v5m0 0V3a1.5 1.5 0 013 0v5.5"
          />
        </svg>
      ),
      query: "manicure",
    },
    {
      name: "Massage",
      price: "₹599",
      icon: (
        <svg
          className="w-8 h-8 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      query: "massage",
    },
  ];

  return (
    <div className="my-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center space-y-1 mb-8">
        <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">
          POPULAR SERVICES
        </p>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Explore Services
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Find the perfect service for you
        </p>
      </div>

      {/* Grid / Horizontal Scroll List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {services.map((item) => (
          <Link
            key={item.name}
            href={``}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="p-3.5 bg-blue-50/70 rounded-2xl group-hover:scale-110 transition-transform mb-3">
              {item.icon}
            </div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
              {item.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Starting{" "}
              <span className="font-semibold text-gray-700">{item.price}</span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExploreServices;
