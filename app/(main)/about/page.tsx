import about from "@/assets/s1.png";
import Image from "next/image";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <Image src={about} alt="image" className="w-full md:max-w-[360px]" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to Salonably, your one-stop destination for effortless salon
            and beauty appointments. We aim to bridge the gap between customers
            and salon professionals by providing a user-friendly platform that
            makes scheduling beauty services faster, easier, and more convenient
            than ever before. Whether you are looking for a quick trim, a
            luxurious spa session, or last-minute grooming services, we help you
            find the perfect slot at a salon near you.
          </p>
          <b className="text-gray-800">What We Offer</b>
          <p>
            We partner with top-rated salons to offer a wide range of services
            with flexible booking options tailored to your convenience. Our
            platform is designed with simplicity in mind—featuring real-time
            availability, secure user accounts, and a seamless booking
            experience. Whether you are a customer seeking reliability or a
            salon owner wanting to manage appointments effectively, our system
            is built to support your needs.
          </p>
          <b className="text-gray-800">Vision</b>
          <p>
            Our vision is to revolutionize the beauty and wellness industry by
            bringing it online, empowering both customers and salon owners. We
            envision a future where beauty services are just a click away,
            accessible to everyone, anytime, anywhere. By enabling smart
            scheduling and real-time booking updates, we strive to reduce wait
            times, increase efficiency, and promote better customer satisfaction
            across the board.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
