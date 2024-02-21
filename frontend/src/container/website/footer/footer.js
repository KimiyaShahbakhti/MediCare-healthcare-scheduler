import React, { useEffect, useState } from "react";
import "./footer.css";
import Button from "../../../components/UI/button/button";
import { Link } from "react-router-dom";
import imgfooter from "../../../assets/img/logopng.png";
const Footer = () => {
  const [notifyinput, setnotifyinput] = useState(" ");
  const [buttonRes, setbuttonRes] = useState(true);
  useEffect(() => {
    buttonInRes();
  }, []);

  const notifyhandler = (event) => {
    setnotifyinput(event.target.value);
  };
  const validate = () => {
    if (notifyinput === " ") {
      console.log("khalie");
      return false;
    } else if (!notifyinput.includes("@") || !notifyinput.includes(".")) {
      console.log("@ ya . ndre");
      return false;
    }
  };
  const notifybtnhandler = () => {
    const validateResult = validate();
    if (validateResult) {
      console.log("valid hast");
      return true;
    } else {
      console.log("valid nist");
      return false;
    }
  };

  const buttonInRes = () => {
    if (window.innerWidth <= 700) {
      setbuttonRes(false);
    } else {
      setbuttonRes(true);
    }
  };
  window.addEventListener("resize", buttonInRes);


  const scrollToFandq = () => {
    const fandqElement = document.getElementById("fandq");
    if (fandqElement) {
      fandqElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToIntro = () => {
    const introElement = document.getElementById("intro");
    if (introElement) {
      introElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToApp = () => {
    const appElement = document.getElementById("app");
    if (appElement) {
      appElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <div className="footer">
      <div className="footertop"></div>
      <div className="footercontent">
        <div className="footer-content">
          <div className="container">
            <div className="row brand-footer">
              <p>MediCare</p>
            </div>
            <div className="row">
              <div className="col-md-4">
                <p className="feinfooter">درباره ما</p>
                <div className="aboutinfooter">
                  <p>
                    وب‌اپلیکیشن مدی‌کر، یادآور داروها و خدمات درمانی شما
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <p className="feinfooter">راهنما</p>
                <ul>
                  <li>
                    <Link to="#fandq" onClick={scrollToFandq}>
                      سوالات متداول<i className="fa fa-chevron-right"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="#intro" onClick={scrollToIntro}>
                      امکانات برنامه<i className="fa fa-chevron-right"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="#app" onClick={scrollToApp}>
                      نسخه وب اپلیکیشن<i className="fa fa-chevron-right"></i>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-md-4 col-img">
                <img className="imgfooter" src={imgfooter} alt="" />
              </div>
            </div>

            <div className="row">
              <div className="copyright">
                <div>
                  <p className="text-center">copyright&copy;2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
