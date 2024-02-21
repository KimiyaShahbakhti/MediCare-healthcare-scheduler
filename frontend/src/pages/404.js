import React from "react";
import notfound from "../assets/img/404.gif";
import "../assets/styles/notfound.css";

const NotFound = () => {
  return (
    <div className="notfound">
        <div className="box-ribbon">
        </div>
      <div className="box-404">
        <div className="img-404">
          <img src={notfound} alt="" />
        </div>
        <div className="alert-4040">صفحه‌ای با این آدرس یافت نشد!</div>
      </div>
    </div>
  );
};

export default NotFound;
