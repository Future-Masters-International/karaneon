import Navbar from "@/components/Navbar";
import ServicesOverview from "@/components/ServicesOverview";
import Footer from "@/components/Footer";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <ServicesOverview />
      </div>
      <Footer />
    </div>
  );
};

export default Services;
