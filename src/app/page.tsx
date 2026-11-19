import CategoriesSection from "@/components/home/categories-section";
import FeaturedPizzasSection from "@/components/home/featured-pizzas-section";
import HeroSection from "@/components/home/hero-section";
import VendorCTASection from "@/components/home/vendor-cta-section";
import WhyChooseSection from "@/components/home/why-choose-section";

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <FeaturedPizzasSection />
      <WhyChooseSection />
      <VendorCTASection />
    </main>
  );
};

export default HomePage;