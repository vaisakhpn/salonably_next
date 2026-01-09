"use client";

import { useState } from "react";
import Image from "next/image";
import profile_pic from "../../../assets/profile_pic.png";


const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState("John Doe");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col gap-3 items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg max-w-lg bg-white">
        
        {/* Profile Image */}
        {isEdit ? (
          <label htmlFor="image" className="cursor-pointer">
            <div className="relative inline-block">
              <Image
                src={
                  image
                    ? URL.createObjectURL(image)
                    : profile_pic
                }
                alt="profile"
                width={144}
                height={144}
                className="rounded object-cover opacity-75"
              />

              {!image && (
                <div className="absolute bottom-12 right-12 bg-gray-200 p-2 rounded-full cursor-pointer">
                   <span className="text-xs">Upload</span>
                </div>
              )}
            </div>

            <input
              type="file"
              id="image"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>
        ) : (
          <Image
            src={profile_pic}
            alt="user"
            width={112}
            height={112}
            className="rounded-full object-cover"
          />
        )}

        {/* Name */}
        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-medium max-w-60 mt-4 text-center outline-none border-b"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">
            {name}
          </p>
        )}

        <hr className="bg-zinc-300 h-[1px] border-none w-full my-2" />

        {/* Contact Info */}
        <div className="w-full">
          <p className="text-neutral-500 underline mb-3">
            CONTACT INFORMATION
          </p>

          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 text-neutral-700">
            <p className="font-medium">Email:</p>
            <p className="text-blue-500">johndoe@email.com</p>

            <p className="font-medium">Phone:</p>
            <p>Not added</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8">
          {isEdit ? (
            <button
              className="border border-blue-500 px-8 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300"
              onClick={() => setIsEdit(false)}
            >
              Save information
            </button>
          ) : (
            <button
              className="border border-blue-500 px-8 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
