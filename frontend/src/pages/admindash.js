import React,{ Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Row, Col, Nav } from "react-bootstrap";
import "./../assets/styles/dashboards.css";
import Navdash from "../components/navbardash/navdash";
import Loading from "../components/UI/loading/loading";
import Profile from "../components/profile/profile";
import Pharmacy from "../components/pharmacy/foradmin/pharmacy";
import Post from "../components/posts/foradmin/post";
import Notes from "../components/notes/note";
import Dashboard from "../components/dashboard/foradmin/dashboard";

const Admindash = () => {

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
      path: "/pharmacy",
      exact: true,
      element: (
        <Suspense fallback={<Loading />}>
          <Pharmacy />
        </Suspense>
      ),
    },
    {
      path: "/notes",
      exact: true,
      element: (
        <Suspense fallback={<Loading />}>
          <Notes />
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
  ];

  return (
    <React.Fragment>
      <Navdash admin={true} />
      <Row className="dash-content">
        <Col id="sidebar-wrapper">
          <Nav className="d-md-block sidebar">
            <Nav.Item>
              <Nav.Link href="/dashboardA/">
                <i className="fa fa-dashboard"></i>
                <p className="side-names">صفحه اصلی</p>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/dashboardA/profile">
                <i className="far fa-user-circle"></i>
                <p className="side-names">پروفایل</p>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/dashboardA/pharmacy">
                <i className="fas fa-pills"></i>
                <p className="side-names">داروخانه</p>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/dashboardA/notes">
                <i className="fas fa-pen"></i>
                <p className="side-names">یادداشت ها</p>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/dashboardA/posts">
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
  );
};

export default Admindash;
