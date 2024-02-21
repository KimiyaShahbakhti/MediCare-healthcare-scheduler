import React, { useState, useEffect, useContext } from "react";
import "./navdash.css";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import { AuthContext } from "../../context/auth/authContext";
import jwt_decode from "jwt-decode";
import userimage from "../../assets/img/userprofile.png";

const Navdash = (props) => {
  const [profileData, setprofileData] = useState(null);
  const [isFetch, setIsFetch] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { logout } = useContext(AuthContext);

  const forUsers = [
    {
      path: "/dashboardU/",
      icon: "fa fa-dashboard",
      id: "1",
      title: "داشبورد",
    },
    {
      path: "/dashboardU/profile",
      icon: "far fa-user-circle",
      id: "2",
      title: "پروفایل",
    },
    {
      path: "/dashboardU/pharmacy",
      icon: "fas fa-pills",
      id: "3",
      title: "داروخانه",
    },
    {
      path: "/dashboardU/posts",
      icon: "fas fa-th-large",
      id: "4",
      title: "محتواهای پزشکی",
    },
    {
      path: "/dashboardU/calendar",
      icon: "far fa-calendar-alt",
      id: "5",
      title: "تقویم",
    },
  ];
  const forAdmin = [
    {
      path: "/dashboardA/",
      icon: "fa fa-dashboard",
      id: "6",
      title: "داشبورد",
    },
    {
      path: "/dashboardA/profile",
      icon: "far fa-user-circle",
      id: "7",
      title: "پروفایل",
    },
    {
      path: "/dashboardA/pharmacy",
      icon: "fas fa-pills",
      id: "8",
      title: "داروخانه",
    },
    {
      path: "/dashboardA/notes",
      icon: "fas fa-pen",
      id: "9",
      title: "یادداشت ها",
    },
    {
      path: "/dashboardA/posts",
      icon: "fas fa-th-large",
      id: "10",
      title: "محتواهای پزشکی",
    },
  ];

  const addActive = (event) => {
    let item = event.target;
    let itemParent = event.target.parentElement;
    let allItems = document.querySelectorAll(".tabmenu-mobile-btn-res");
    console.log(allItems);
    allItems.forEach((item) => {
      item.classList.remove("active");
    });
    item.classList.add("active");

    localStorage.setItem(`activeBtnID`, `${itemParent.id}`);
  };

  useEffect(() => {
    let allItems = document.querySelectorAll(".tabmenu-mobile-btn-res");
    allItems.forEach((item) => {
      if (localStorage.getItem("activeBtnID") == `${item.id}`) {
        item.classList.add("active");
      }
    });

    let currentUrl = window.location.href.substring(21);
    forAdmin.forEach((data) => {
      if (currentUrl == data.path) {
        allItems.forEach((item) => {
          item.classList.remove("active");
          if (item.id == data.id) item.classList.add("active");
        });
        localStorage.setItem(`activeBtnID`, `${data.id}`);
      }
    });
    forUsers.forEach((data) => {
      if (currentUrl == data.path) {
        allItems.forEach((item) => {
          item.classList.remove("active");
          if (item.id == data.id) item.classList.add("active");
        });
        localStorage.setItem(`activeBtnID`, `${data.id}`);
      }
    });

    const token = localStorage.getItem("token");
    const paramSent = jwt_decode(token).userInfo._id;
    fetch(`http://localhost:8080/profileInfo/${paramSent}`)
      .then(function (response) {
        return response.json();
      })
      .then((responseJson) => {
        setIsFetch(true);
        setprofileData(responseJson.data);
      });
  }, [5000]);

  return (
    <React.Fragment>
      <>
        <Nav className="dashnav">
          <Button onClick={handleShow} className="humbtn">
            <i className="fa fa-bars"></i>
          </Button>
          <Nav.Item>
            <Nav.Link className="dashbrand">MediCare</Nav.Link>
          </Nav.Item>

          <Nav.Item className="top-dash-intro">
            <div className="dashprofile">
              <div className="imgprofile">
                <img
                  src={
                    isFetch
                      ? profileData[0].image == undefined
                        ? userimage
                        : require(`../../assets/uploads/images/` +
                            profileData[0].image)
                      : null
                  }
                />
              </div>
              <div className="nameprofile">
                <p>{isFetch ? profileData[0].fullname : ""}</p>
              </div>
              <Nav.Link className="dashbrand btn-logout" onClick={logout}>
                <i className="fa fa-power-off logout"></i>
              </Nav.Link>
            </div>
          </Nav.Item>

          <Offcanvas show={show} onHide={handleClose} placement={"end"}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>MediCare</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end d-block pe-3 offcanvas-side">
                {props.admin
                  ? forAdmin.map((nav) => (
                      <Nav.Link key={nav.id} href={nav.path}>
                        <i className={nav.icon}></i>
                        <span className="span-offcanvas">{nav.title}</span>
                      </Nav.Link>
                    ))
                  : forUsers.map((nav) => (
                      <Nav.Link key={nav.id} href={nav.path}>
                        <i className={nav.icon}></i>
                        <span className="span-offcanvas">{nav.title}</span>
                      </Nav.Link>
                    ))}
              </Nav>

              <div className="logout-res">
                <Button className="logout" onClick={logout}>
                  <i className="fa fa-power-off logout"></i>
                </Button>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </Nav>

        <Nav className="tabmenu-mobile-res" justify>
          {props.admin
            ? forAdmin.map((nav) => (
                <Nav.Item key={nav.id}>
                  <Nav.Link
                    href={nav.path}
                    id={nav.id}
                    className="tabmenu-mobile-btn-res"
                  >
                    <i onClick={addActive} className={nav.icon}></i>
                  </Nav.Link>
                </Nav.Item>
              ))
            : forUsers.map((nav) => (
                <Nav.Item key={nav.id}>
                  <Nav.Link
                    href={nav.path}
                    id={nav.id}
                    className="tabmenu-mobile-btn-res"
                  >
                    <i onClick={addActive} className={nav.icon}></i>
                  </Nav.Link>
                </Nav.Item>
              ))}
        </Nav>
      </>
    </React.Fragment>
  );
};
export default Navdash;
