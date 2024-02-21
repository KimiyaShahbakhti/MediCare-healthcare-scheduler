import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./signlog.css";
import { Button, Spinner } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../context/auth/authContext";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import logologin from "../../assets/img/logo-login.png";

const Signlog = () => {
  const [showToast, setShowToast] = useState(false);
  const [showToastok, setShowToastok] = useState(false);
  const [alert, setAlert] = useState("");

  const [name, setname] = useState(" ");
  const [tell, settell] = useState(" ");
  const [email, setemail] = useState(" ");
  const [username, setusername] = useState(" ");
  const [password, setpassword] = useState(" ");
  const [password1, setpassword1] = useState(" ");
  const [password2, setpassword2] = useState(" ");

  const [passwordForReset1, setpasswordForReset1] = useState(" ");
  const [passwordForReset2, setpasswordForReset2] = useState(" ");

  const [errorPas, seterrorPas] = useState(false);
  const [errorTel, seterrorTel] = useState(false);
  const [errorEmail, seterrorEmail] = useState(false);

  const [alreadyReg, setalreadyReg] = useState(false);
  const [resetPass, setResetpass] = useState(false);
  const [validated, setValidated] = useState(false);

  const [loggedIn, setloggedIn] = useState();

  const { loginUser } = useContext(AuthContext);
  const { loginAdmin } = useContext(AuthContext);

  async function submitLogForm(e) {
    const form = e.currentTarget;
    setloggedIn("logging in");

    if (form.checkValidity() == false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();

      fetch("http://localhost:8080/postLogfrom", {
        method: "POST",
        headers: {
          Accept: "applicaion/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        withCredentials: true,
      })
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          setloggedIn("logged in");
          if (responseJson.message === "dataMatch-Admin") {
            loginAdmin(responseJson.token);
          } else if (responseJson.message === "dataMatch-User") {
            loginUser(responseJson.token);
          } else if (responseJson.message == "WrongPass") {
            setShowToast(true);
            setAlert("رمز عبور وارد شده اشتباه می‌باشد!");
          } else if (responseJson.message == "noUserFound") {
            setShowToast(true);
            setAlert("کاربری با این مشخصات در سیستم ثبت نشده است!");
          }
        });
    }
    setValidated(true);
  }
  
  async function submitRegForm(e) {
    setloggedIn("logging in");
    const form = e.currentTarget;

    seterrorPas(false);
    seterrorEmail(false);
    seterrorTel(false);

    const validateResult = validate();
    if (form.checkValidity() === false || !validateResult) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();

      fetch("http://localhost:8080/postRegfrom", {
        method: "POST",
        headers: {
          Accept: "applicaion/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: name,
          email: email,
          tell: tell,
          username: username,
          password1: password1,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          console.log(responseJson);
          setloggedIn("logged in");
          console.log(responseJson.message);
          if (responseJson.message === "usernameAlreadyTaken") {
            setShowToast(true);
            setAlert("نام کاربری وارد شده قبلا در سیستم ثبت شده است.");
          } else {
            setShowToastok(true);
            setAlert("ثبت نام شما با موفقیت انجام شد.");
          }
        });
    }
    setValidated(true);
  }
  async function submitResetpassForm(event) {
    const form = event.currentTarget;

    if (
      form.checkValidity() == false ||
      passwordForReset1 != passwordForReset2
    ) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();

      fetch("http://localhost:8080/resetPassword", {
        method: "POST",
        headers: {
          Accept: "applicaion/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: passwordForReset1,
        }),
        withCredentials: true,
      }).then(function (response) {
        return response.json();
      });

      setalreadyReg(true);
      setResetpass(false);
      setShowToast(true);
      setAlert("لطفا با نام کاربری و رمز عبور جدید وارد شوید.");
    }
    setValidated(true);
  }

  const validate = () => {
    if (!email.includes(".")) {
      console.log("email . ndre");
      seterrorEmail(true);
      return false;
    } else if (password1 !== password2) {
      seterrorPas(true);
      console.log("password ha yeki nistan");
      return false;
    } else if (tell.length < 11) {
      seterrorTel(true);
      console.log("shomare tedad kame");
      return false;
    } else {
      return true;
    }
  };
  const alreadyRegHandler = (event) => {
    event.preventDefault();
    document.querySelector(".welcome-res-logsign").classList += " sth";
    document.querySelector(".welcome-res-logsign2").classList += " sth";
    document.querySelector(".welcone-txt-res").classList += " sth";
    document.querySelector(".sidelogin").style.opacity = "1";
    if (!alreadyReg) {
      setalreadyReg(true);
    } else {
      setalreadyReg(false);
    }
  };
  const resetPassword = (event) => {
    event.preventDefault();
    document.querySelector(".welcome-res-logsign").classList += " sth";
    document.querySelector(".welcome-res-logsign2").classList += " sth";
    document.querySelector(".welcone-txt-res").classList += " sth";
    document.querySelector(".sidelogin").style.opacity = "1";
    if (!resetPass) {
      setResetpass(true);
    } else {
      setResetpass(false);
    }
  };

  let navigate = useNavigate();
  let authadmin = false;
  let authuser = false;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken.userInfo.admin) authadmin = true;
      if (!decodedToken.userInfo.admin) authuser = true;
    }
    if (!authadmin && !authuser) navigate("/signup", { replace: true });
    if (authadmin) navigate("/dashboardA/", { replace: true });
    if (authuser) navigate("/dashboardU/", { replace: true });
  }, []);

  return (
    <div className="signup">
      <div className="container">
        <div className="welcone-txt-res">
          خوش آمدید ! <br></br> <span>برای عضو/ثبت نام، کلیک کنید</span>
        </div>
        <div className="welcome-res-logsign2"></div>
        <div className="welcome-res-logsign"></div>
        <div className="row align-items-center rowallsign">
          <div className="col-lg-6 sidelogin">
            <div>
              <h1 className="wellcome">خوش آمدید!</h1>
              {alreadyReg ? (
                !resetPass ? (
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={submitLogForm}
                    method="POST"
                  >
                    <Row>
                      <Form.Group controlId="validationCustom01">
                        <Form.Control
                          required
                          type="text"
                          name="username"
                          placeholder="نام کاربری"
                          onChange={(event) => {
                            setusername(event.target.value);
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          نام کاربری را وارد نمایید.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="validationCustom02">
                        <Form.Control
                          required
                          type="password"
                          name="password"
                          placeholder="رمز عبور"
                          onChange={(event) => {
                            setpassword(event.target.value);
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          رمز عبور را وارد نمایید.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <div className="form-group mt-3 col-lg-12 mx-auto mb-0">
                        <Button className="form-btn" type="sumbit">
                          ورود
                          {loggedIn === "logging in" ? (
                            <Spinner animation="grow" />
                          ) : (
                            ""
                          )}
                        </Button>
                      </div>

                      <div className="form-group col-lg-12 mx-auto d-flex align-items-center my-3">
                        <div className="border-bottom w-100 ml-5"></div>
                        <div className="or px-2 small text-muted font-weight-bold text-muted">
                          OR
                        </div>

                        <div className="border-bottom w-100 mr-5"></div>
                      </div>
                      <div className="form-group col-lg-12 mx-auto">
                        <p className="already-reg text-muted font-weight-bold">
                          حساب کاربری ندارید؟
                          <a href="#" onClick={alreadyRegHandler}>
                            ثبت نام کنید
                          </a>
                          <br />
                          <a
                            href="#"
                            onClick={resetPassword}
                            className="resetpassword"
                          >
                            بازیابی رمز عبور
                          </a>
                          <br />
                          <a href="/" className="backtohome">
                            بازگشت به صفحه اصلی
                          </a>
                        </p>
                      </div>
                    </Row>
                  </Form>
                ) : (
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={submitResetpassForm}
                    method="POST"
                  >
                    <Row>
                      <Form.Group controlId="validationCustom01">
                        <Form.Control
                          required
                          type="text"
                          name="username"
                          placeholder="نام کاربری"
                          onChange={(event) => {
                            setusername(event.target.value);
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          نام کاربری را وارد نمایید.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="validationCustom02">
                        <Form.Control
                          required
                          type="password"
                          name="passwordreset1"
                          placeholder="رمز عبور جدید"
                          onChange={(event) => {
                            setpasswordForReset1(event.target.value);
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          رمز عبور را وارد نمایید.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="validationCustom02">
                        <Form.Control
                          required
                          type="password"
                          name="passwordreset2"
                          placeholder="تکرار رمز عبور جدید"
                          onChange={(event) => {
                            setpasswordForReset2(event.target.value);
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          رمز عبور را وارد نمایید.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <div className="form-group mt-3 col-lg-12 mx-auto mb-0">
                        <Button className="form-btn" type="sumbit">
                          تغییر رمز عبور
                          {loggedIn === "logging in" ? (
                            <Spinner animation="grow" />
                          ) : (
                            ""
                          )}
                        </Button>
                      </div>

                      <div className="form-group col-lg-12 mx-auto d-flex align-items-center my-3">
                        <div className="border-bottom w-100 ml-5"></div>
                        <div className="or px-2 small text-muted font-weight-bold text-muted">
                          OR
                        </div>

                        <div className="border-bottom w-100 mr-5"></div>
                      </div>
                      <div className="form-group col-lg-12 mx-auto">
                        <p className="already-reg text-muted font-weight-bold">
                          <a
                            href="#"
                            onClick={() => {
                              setalreadyReg(true);
                              setResetpass(false);
                            }}
                          >
                            ورود
                          </a>
                          <br />
                          <a href="/" className="backtohome">
                            بازگشت به صفحه اصلی
                          </a>
                        </p>
                      </div>
                    </Row>
                  </Form>
                )
              ) : (
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={submitRegForm}
                  method="POST"
                >
                  <Row>
                    <Form.Group controlId="validationCustom03">
                      <Form.Control
                        required
                        type="text"
                        name="name"
                        placeholder="نام و نام خانوادگی"
                        onChange={(event) => {
                          setname(event.target.value);
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        لطفانام و نام خانوادگی خود را وارد نمایید.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationCustom04">
                      <Form.Control
                        required
                        type="email"
                        name="email"
                        placeholder="ایمیل"
                        onChange={(event) => {
                          setemail(event.target.value);
                        }}
                        isInvalid={!!errorEmail}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errorEmail
                          ? `لطفا ایمیل خود را با ساختار درست وارد نمایید. `
                          : `لطفا ایمیل خود را با ساختار درست وارد نمایید.`}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationCustom05">
                      <Form.Control
                        required
                        type="tel"
                        name="tell"
                        placeholder="شماره تلفن"
                        onChange={(event) => {
                          settell(event.target.value);
                        }}
                        isInvalid={!!errorTel}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errorTel
                          ? `طول شماره تلفن وارد شده صحیح نمی‌باشد.`
                          : `لطفا شماره تلفن خود را وارد نمایید.`}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationCustom06">
                      <Form.Control
                        required
                        type="text"
                        name="username"
                        placeholder="نام کاربری"
                        onChange={(event) => {
                          setusername(event.target.value);
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        لطفا نام کاربری انتخابی خود را وارد نمایید.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationCustom07">
                      <Form.Control
                        required
                        type="password"
                        name="password"
                        placeholder="رمز عبور"
                        onChange={(event) => {
                          setpassword1(event.target.value);
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        لطفا رمز عبور انتخابی خود را وارد نمایید.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationCustom08">
                      <Form.Control
                        required
                        type="password"
                        name="passwordConfirmation"
                        placeholder="تکرار رمز عبور"
                        onChange={(event) => {
                          setpassword2(event.target.value);
                        }}
                        isInvalid={!!errorPas}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errorPas
                          ? `لطفا رمز عبور انتخابی خود را به درستی و با همان ساختار، تکرار نمایید.`
                          : `لطفا رمز عبور انتخابی خود را نمایید.`}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="form-group mt-3 col-lg-12 mx-auto mb-0">
                      <Button className="form-btn" type="sumbit">
                        ثبت نام
                        {loggedIn === "logging in" ? (
                          <Spinner animation="grow" />
                        ) : (
                          ""
                        )}
                      </Button>
                    </div>

                    <div className="form-group col-lg-12 mx-auto d-flex align-items-center my-3">
                      <div className="border-bottom w-100 ml-5"></div>
                      <div className="or px-2 small text-muted font-weight-bold text-muted">
                        OR
                      </div>

                      <div className="border-bottom w-100 mr-5"></div>
                    </div>
                    <div className="form-group col-lg-12 mx-auto">
                      <p className="already-reg text-muted font-weight-bold">
                        قبلا ثبت نام کردید؟
                        <a href="#" onClick={alreadyRegHandler}>
                          ورود
                        </a>
                        <br />
                        <a href="/" className="backtohome">
                          بازگشت به صفحه اصلی
                        </a>
                      </p>
                    </div>
                  </Row>
                </Form>
              )}
            </div>
          </div>

          <div className="col-lg-6 sidelogo">
            <img
              src={logologin}
              alt=""
              className="img-fluid mb-3 d-none d-md-block"
            />
          </div>
        </div>
      </div>

      <ToastContainer position="top-center">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={5000}
          autohide
        >
          <Toast.Header className="toastheader">
            <strong>اخطار⚠</strong>
          </Toast.Header>
          <Toast.Body className="toastbody">{alert}</Toast.Body>
        </Toast>
      </ToastContainer>

      <ToastContainer position="top-center">
        <Toast
          onClose={() => setShowToastok(false)}
          show={showToastok}
          delay={5000}
          autohide
        >
          <Toast.Header className="toastheaderok">
            <strong>تبریک✔</strong>
          </Toast.Header>
          <Toast.Body className="toastbodyok">{alert}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Signlog;
