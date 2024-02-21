import React, { useEffect, useState } from "react";
import "./heroSection.css";
import Button from "../../../components/UI/button/button";
import heroimg from "../../../assets/img/logogif.gif";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const HeroSection = () => {
  const [buttonRes, setbuttonRes] = useState(true);
  useEffect(() => {
    buttonInRes();
  }, []);

  const buttonInRes = () => {
    if (window.innerWidth <= 700) {
      setbuttonRes(false);
    } else {
      setbuttonRes(true);
    }
  };
  window.addEventListener("resize", buttonInRes);

  return (
    <div id="app" className="web-hero-container">
      <div className="hero-download">
        <Row>
          <Col
            className="introapp animate__animated wow animate__fadeInRight"
            xs={6}
          >
            <p>
              <i className="fa fa-check"></i>
              ِیادآوری داروهای مورد مصرف
            </p>
            <p>
              <i className="fa fa-check"></i>
              یادآوری وقت های پزشکی و خدمات درمانی
            </p>
            <p>
              <i className="fa fa-check"></i>
              نگهداری دارو های مصرفی به صورت دسته بندی شده
            </p>
            <p>
              <i className="fa fa-check"></i>
              یادداشت گذاری
            </p>
            <p>
              <i className="fa fa-check"></i>و امکاناتی دیگر...
            </p>
            <div className="download-btn-box">
              <Button
                to="/signup"
                btnstyle="btn-blue"
                btnsize={buttonRes ? "btn-90" : "btn-100"}
                btnheight="btn-h50"
              >
                نسخه وب اپلیکیشن
              </Button>
            </div>
          </Col>

          <Col
            className="heroimg animate__animated wow animate__fadeInRight"
            xs={6}
          >
            <img src={heroimg} alt="" />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HeroSection;
