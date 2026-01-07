import Banner from "@/components/ui/HomePage/Banner";
import DiscoverPage from "@/components/ui/HomePage/DiscoverPage";
import Header from "@/components/ui/HomePage/Header";
import TopShops from "@/components/ui/HomePage/TopShops";

const HomePage = () => {
  return (
    <div>
      <div>
        <Header />
        <div>
          <TopShops />
        </div>

        <DiscoverPage />
        <Banner />
      </div>
    </div>
  );
};

export default HomePage;
