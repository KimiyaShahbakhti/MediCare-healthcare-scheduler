import React, { useState, Suspense, useEffect, useContext } from "react";
import { Row, Col, Nav } from "react-bootstrap";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./../assets/styles/dashboards.css";
import { SchedulerProvider } from "../context/schedular/schedularContext";
import Navdash from "../components/navbardash/navdash";
import Loading from "../components/UI/loading/loading";
import Dashboard from "../components/dashboard/foruser/dashboard";
import Profile from "../components/profile/profile";
import Calendar from "../components/calendar/calendar";
import Pharmacy from "../components/pharmacy/foruser/pharmacy";
import Post from "../components/posts/foruser/post";
import NotFound from "./404";
import * as shamsi from "shamsi-date-converter";
import icon from "../assets/img/logopng.png";
import jwt_decode from "jwt-decode";

const Userdash = () => {
  
  const routes = [
    {
      path: "/",
      exact: true,
      element: (
        <Suspense fallback={<Loading />}>
          <Dashboard />
        </Suspense>
      ),
    },
    {
      path: "/profile",
      exact: true,
      element: (
        <Suspense fallback={<Loading />}>
          <Profile />
        </Suspense>
      ),
    },
    {
      path: "/calendar",
      exact: true,
      element: (
        <Suspense fallback={<Loading />}>
          <Calendar />
        </Suspense>
      ),
    },
    {
      path: "/pharmacy",
      exact: true,
      element: (
        <Suspense fallback={<Loading />}>
          <Pharmacy />
        </Suspense>
      ),
    },
    {
      path: "/posts",
      exact: true,
      element: (
        <Suspense fallback={<Loading />}>
          <Post />
        </Suspense>
      ),
    },
    {
      path: "/*",
      exact: true,
      element: (
        <Suspense fallback={<Loading />}>
          <NotFound />
        </Suspense>
      ),
    },
  ];

  const [notifications, setNotifications] = useState([]);

  function toShamsi(y, m, d) {
    return shamsi
      .gregorianToJalali(parseInt(y), parseInt(m), parseInt(d))
      .join("/");
  }
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  function showNotification(notifications) {
    notifications.forEach((notif) => {
      let notifyDate = toShamsi(
        notif.forDate.split("-")[0],
        notif.forDate.split("-")[1],
        notif.forDate.split("-")[2]
      );
      let notifyTime = new Date(notif.forTime);
      let notifyHour = notifyTime
        .toLocaleString("en-US", options)
        .split(" ")[4];
      if (notifyHour.length == 7) {
        notifyHour = notifyHour.substring(0, 4);
      }
      if (notifyHour.length == 8) {
        notifyHour = notifyHour.substring(0, 5);
      }

      if (notif.type == "med") {
        return new Notification(
          `مصرف دارو  (` + notif.medicinename + `) یادت نره!`,
          {
            body: `امروز (` + notifyDate + `) ساعت ` + notifyHour,
            icon: icon,
            badge: icon,
          }
        );
      }

      if (notif.type == "apo") {
        return new Notification(
          `وقت پزشکی (` + notif.doctorname + `) یادت نره!`,
          {
            body: `امروز (` + notifyDate + `) ساعت ` + notifyHour,
            icon: icon,
            badge: icon,
          }
        );
      }
      if (notif.type == "service") {
        return new Notification(`انجام (` + notif.service + `) یادت نره!`, {
          body: `امروز (` + notifyDate + `) ساعت ` + notifyHour,
          icon: icon,
          badge: icon,
        });
      }
    });
  }
  let exNotifs = [];
  useEffect(() => {
    const token = localStorage.getItem("token");
    let userID;
    if (token) {
      const decodedToken = jwt_decode(token);
      userID = decodedToken.userInfo._id;
    }
    return () => {
      setInterval(() => {
        fetch(`http://localhost:8080/notifications/${userID}`)
          .then(function (response) {
            return response.json();
          })
          .then((responseJson) => {
            if (
              JSON.stringify(responseJson.data) !== JSON.stringify(exNotifs)
            ) {
              setNotifications(responseJson.data);
            }
            exNotifs = responseJson.data;
          });
      }, 1000);
    };
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      showNotification(notifications);
    }
  }, [notifications]);

  return (
    <SchedulerProvider>
      <React.Fragment>
        <Navdash admin={false} />
        <Row className="dash-content">
          <Col id="sidebar-wrapper">
            <Nav className="d-md-block sidebar">
              <Nav.Item>
                <Nav.Link href="/dashboardU/">
                  <i className="fa fa-dashboard"></i>
                  <p className="side-names">صفحه اصلی</p>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/dashboardU/profile">
                  <i className="far fa-user-circle"></i>
                  <p className="side-names">پروفایل</p>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/dashboardU/calendar">
                  <i className="far fa-calendar-alt"></i>
                  <p className="side-names">تقویم</p>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/dashboardU/pharmacy">
                  <i className="fas fa-pills"></i>
                  <p className="side-names">داروخانه</p>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/dashboardU/posts">
                  <i className="fas fa-th-large"></i>
                  <p className="side-names">محتواهای پزشکی</p>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col id="page-content-wrapper">
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  element={route.element}
                />
              ))}
            </Routes>
          </Col>
        </Row>
      </React.Fragment>
    </SchedulerProvider>
  );
};

export default Userdash;
