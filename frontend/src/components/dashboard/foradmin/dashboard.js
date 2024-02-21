import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Modalshow from "../../UI/modal/modal";
import Topdash from "../../topindash/topdash";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import * as shamsi from "shamsi-date-converter";
import jwt_decode from "jwt-decode";

const Dashboard = () => {
  const [usersData, setusersData] = useState(null);
  const [isFetch, setIsFetch] = useState(false);

  let navigate = useNavigate();
  let auth = false;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken.userInfo.admin) auth = true;
    }
    if (!auth) {
      navigate("/signup", { replace: true });
    }

    fetch("http://localhost:8080/showUsers")
      .then(function (response) {
        return response.json();
      })
      .then((responseJson) => {
        setIsFetch(true);
        setusersData(responseJson.data);
      });
  }, []);

  function toShamsi(y, m, d) {
    return shamsi
      .gregorianToJalali(parseInt(y), parseInt(m), parseInt(d))
      .join("/");
  }

  return (
    <React.Fragment>
      <Topdash icon="fas fa-home-user">خانه</Topdash>

      <div className="all-users">
        <p className="user-info">مشخصات کاربران</p>
        <Table responsive bordered size="lg" className="users-table">
          <thead>
            <tr>
              <th>ردیف</th>
              <th>نام و نام‌خانوادگی</th>
              <th>آدرس ایمیل</th>
              <th>نام کاربری</th>
              <th>شماره تماس</th>
              <th>تاریخ عضویت</th>
            </tr>
          </thead>
          <tbody>
            {isFetch
              ? usersData.map((user, index) => {
                  return (
                    <tr>
                      <th>{index + 1}</th>
                      <td>{user.fullname}</td>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                      <td>{user.tell}</td>
                      <td>
                        {toShamsi(
                          user.createdAt.substring(0, 4),
                          user.createdAt.substring(5, 7),
                          user.createdAt.substring(8, 10)
                        )}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
          <thead>
            <tr>
              <th>ردیف</th>
              <th>نام و نام‌خانوادگی</th>
              <th>آدرس ایمیل</th>
              <th>نام کاربری</th>
              <th>شماره تماس</th>
              <th>تاریخ عضویت</th>
            </tr>
          </thead>
        </Table>
      </div>

      <Row className="row-all-items">
        <Col md={4} className="show-items-res">
          <a href="/dashboardA/notes">
            <div className="all-notes">
              <i className="fas fa-pen"></i>
              مشاهده یادداشت ها
            </div>
          </a>
        </Col>
        <Col md={4} className="show-items-res">
          <a href="/dashboardA/pharmacy">
            <div className="all-medicines">
              <i className="fas fa-pills"></i>
              مشاهده دارو ها
            </div>
          </a>
        </Col>
        <Col md={4} className="show-items-res">
          <a href="/dashboardA/posts">
            <div className="all-posts">
              <i className="fas fa-th-large"></i>
              مشاهده پست ها
            </div>
          </a>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Dashboard;
