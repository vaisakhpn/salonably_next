import Image from "next/image";
import slider_img from "../../../assets/hero.png";

const TopShops = () => {
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 ">
      <h1 className="text-3xl font-medium">Top Salon to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of salon shops.
      </p>
      <div className="w-full flex overflow-x-auto gap-4 pt-5 px-3 sm:px-0 sm:grid sm:grid-cols-auto sm:gap-y-6 sm:overflow-visible">
        <div className="w-60 border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-2.5 transition-all duration-500">
          <Image
            className="bg-blue-50 w-full h-40 object-cover rounded-t-xl"
            src={slider_img}
            alt="shop_image"
          />

          <div className="p-4">
            <div
              className="flex items-center gap-2 
                       text-sm text-center"
            >
              <p></p>
              <p className="text-sm">Opened</p>
            </div>
            <p className="text-gray-900 text-md font-medium">150</p>
            <p className="text-gray-500 text-sm font-light">cheeral</p>
            <p className="text-gray-500 text-sm font-light">bathery</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopShops;
