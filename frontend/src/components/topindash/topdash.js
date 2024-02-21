import React from "react";
import "./topdash.css";

const Topdash = (props) => {

  return (
    <React.Fragment>
    <div className="topdashicon">
      <i className={props.icon}></i>
      <span>{props.children}</span>
    </div>
     </React.Fragment>
  );
};

export default Topdash;
