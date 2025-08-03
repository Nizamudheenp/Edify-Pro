import FinalCTA from "../components/home/FinalCTA";
import Footer from "../components/home/Footer";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import WhyEdify from "../components/home/WhyEdify";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <WhyEdify />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Home;
