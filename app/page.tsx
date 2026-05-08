"use client";

import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Blog from "./components/Blog";
import Beyond from "./components/Beyond";
import Contact from "./components/Contact";
import HomeLoader from "@/ui/HomeLoader";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader for enough time to complete the GSAP animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* {loading && <HomeLoader />}
      <div className={loading ? "hidden" : "block"}> */}
        <Hero />
        {/* <About /> */}
        {/* <Projects /> */}
        <Experience />
        <Education />
        <Skills />
        <Blog />
        <Beyond />
        <Contact />
        {/* Other sections will go here */}
      {/* </div> */}
    </>
  );
}
