import React, { useState } from "react";
import "./button.css";
import { Link } from "react-router-dom";

const Button = (props) => {
    const{clicked,to,children,btnstyle,btnsize,btnheight,dis}=props
  
    return (
      <Link to={to} target="_blank">
          <button onClick={clicked} className={`btn ${dis} ${btnstyle} ${btnheight} ${btnsize}`}>
              {children}
          </button>
      </Link>
  );
};
export default Button;
