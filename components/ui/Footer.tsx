import Image from "next/image";
import Link from "next/link";
import salonably from "@/assets/salonably.png";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col border-t-2 p-2 sm:grid sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* Logo & Description */}
        <div>
          <Image className="mb-5 w-14" src={salonably} alt="LOGO" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Salonably helps you find and book nearby salons in seconds. Fast,
            easy, and hassle-free beauty appointments—anytime, anywhere.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+91 7559092281</li>
            <li>vaisakhpn78@gmail.com</li>
          </ul>
        </div>
      </div>

      <hr />
      <p className="text-center text-sm text-gray-500 py-4">
        © 2025 Salonably. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
