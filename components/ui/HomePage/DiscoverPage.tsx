import React from "react";

const DiscoverPage = () => {
  return (
    <div className="flex items-center justify-center mt-16 mb-10 my-16 mx-10  ">
      <div className="flex flex-col items-start justify-center  md:gap-16 gap-3 w-full">
        <p className="text-black font-light md:text-5xl text-3xl ">
          Discover Top-Rated Salons Near you
        </p>
        <div className="flex flex-row  gap-7 ">
          <div className="flex flex-col gap-3 max-w-lg">
            <p className="md:text-3xl text-xl  font-light text-black">
              Find the Perfect Match
            </p>
            <p className="md:text-lg text-xs font-light text-black ">
              Search for salons based on your preferences, including
              location,service and rating
            </p>
          </div>
          <div className="flex flex-col gap-3 max-w-xl">
            <p className="md:text-3xl text-xl font-light text-black">
              Explore Diverse options
            </p>
            <p className="md:text-lg text-xs font-light text-black ">
              Browse through a curated selection of top-rated saloons in your
              area, from hair salons to nail salons and spas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
