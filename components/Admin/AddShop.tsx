"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";

const AddShop: React.FC = () => {
  const [shopImg, setShopImg] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fees, setFees] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!shopImg) {
        toast.error("Please upload a shop image");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", shopImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("fees", fees);
      formData.append("about", about);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      const response = await fetch("/api/shop/add", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Reset form fields
        setShopImg(null);
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setFees("");
        setAddress1("");
        setAddress2("");
        setAbout("");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Add shop error:", error);
      toast.error("Failed to add shop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setShopImg(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Shop</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll scrollbar-hide">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <Image
              src={shopImg ? URL.createObjectURL(shopImg) : assets.upload_area}
              className="w-16 h-16 bg-gray-100 rounded-full cursor-pointer object-cover"
              width={64}
              height={64}
              alt="Shop Preview"
            />
          </label>
          <input
            onChange={handleImageChange}
            type="file"
            id="doc-img"
            hidden
            accept="image/*"
          />
          <p>
            Upload shop <br />
            picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Shop Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2 outline-blue-500"
                type="text"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Shop Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2 outline-blue-500"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Phone Number</p>
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                className="border rounded px-3 py-2 outline-blue-500"
                type="number" // basic HTML validation
                placeholder="Phone number"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Shop Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2 outline-blue-500"
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Service Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border rounded px-3 py-2 outline-blue-500"
                type="number"
                placeholder="Fees"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2 outline-blue-500 mb-2"
                type="text"
                placeholder="Address Line 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2 outline-blue-500"
                type="text"
                placeholder="Address Line 2"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Shop</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded outline-blue-500"
            placeholder="Write about the shop"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 cursor-pointer px-10 py-3 mt-4 rounded-full text-white disabled:opacity-70 hover:bg-blue-600 transition-all font-medium"
        >
          {loading ? "Adding Shop..." : "Add Shop"}
        </button>
      </div>
    </form>
  );
};

export default AddShop;
