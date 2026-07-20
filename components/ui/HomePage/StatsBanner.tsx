import React from "react";

const StatsBanner = () => {
  const stats = [
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0H9m4 0h2" />
        </svg>
      ),
      value: "10,000+",
      label: "Partner Salons",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      value: "2M+",
      label: "Happy Customers",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      value: "500K+",
      label: "Appointments Booked",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      value: "4.8",
      label: "Average Rating",
    },
  ];

  return (
    <div className="my-8 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/60 rounded-2xl p-6 sm:p-8 border border-blue-100/60 shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-x-0 lg:divide-x divide-gray-200/60">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-2">
              <div className="p-3 bg-white rounded-2xl shadow-xs border border-gray-100 mb-2">
                {stat.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBanner;
