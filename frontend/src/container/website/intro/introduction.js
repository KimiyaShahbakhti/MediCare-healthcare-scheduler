import React from "react";
import "./introduction.css";
import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import img1 from "../../../assets/img/intro1.png";
import img2 from "../../../assets/img/intro2.png";
import img3 from "../../../assets/img/intro3.png";

const Intro = () => {
  return (
    <div id="intro" className="web-intro">
      <div className="topline animate__animated wow animate__fadeInRight">
        <h2 className="introtitle">معرفی برنامه</h2>
        <div className="cols-md-4 container">
          <Carousel>
            <Carousel.Item>
              <img className="img-intro" src={img1} alt="First slide" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="img-intro" src={img2} alt="Second slide" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="img-intro" src={img3} alt="Third slide" />
            </Carousel.Item>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Intro;
