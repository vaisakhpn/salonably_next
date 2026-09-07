import React from "react";
import contact from "@/assets/s3.png";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with LockMyTime. Reach out for support, inquiries, or salon partnerships.",
};

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center pt-10">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Contact <span className="text-blue-600">LockMyTime</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          We are here to assist with inquiries, support, and salon partnerships
        </p>
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <Image src={contact} className="w-full md:max-w-[360px]" alt="image" />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600">OUR OFFICE</p>
          <p className="text-gray-500">
            Sulthan Bathery
            <br />
            Kerala,India
          </p>
          <p className="text-gray-500">
            Tel:+91 7559092281
            <br />
            Email:vaisakhpn78@gmail.com
          </p>
          <p className="font-semibold text-lg text-gray-600">Career</p>
          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 ">
            Explore job
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
