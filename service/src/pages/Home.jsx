import React from "react";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import BuisnessList from "@/components/BuisnessList";

const Home = () => {
  return (
    <div>
        <Hero />
        <Categories />
        <BuisnessList />
    </div>
  );
};

export default Home;