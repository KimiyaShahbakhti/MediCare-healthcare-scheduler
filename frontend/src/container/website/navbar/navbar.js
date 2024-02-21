import React, { useState } from "react";
import "./navbar.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const Webnavbar = () => {
  return (
    <React.Fragment>
      <div className="navweb">
        <Navbar expand="lg"  className="justify-content-center bg-body-tertiary">
          <Navbar.Brand href="#">MediCare</Navbar.Brand>
        </Navbar>
      </div>
    </React.Fragment>
  );
};
export default Webnavbar;
