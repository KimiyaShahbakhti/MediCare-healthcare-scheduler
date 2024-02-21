import React from 'react'
import HeroSection from '..//container/website/heroSection/heroSection';
import Intro from "../container/website/intro/introduction"
import Fandq from '../container/website/faq/fandq'
import Webnavbar from "../container/website/navbar/navbar";
import Footer from "../container/website/footer/footer";
import ScrollToTop from "../components/UI/scrollTop/scrollTop";

const Home =()=> {
  return (
    <React.Fragment>
      <Webnavbar />
      <ScrollToTop />
      <HeroSection />
      <Intro />
      <Fandq />
      <Footer />
    </React.Fragment>
  )
}

export default Home;
