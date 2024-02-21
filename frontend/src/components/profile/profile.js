import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import Topdash from "../topindash/topdash";
import img from "../../assets/img/userprofile.png";
import Card from "react-bootstrap/Card";
import jwt_decode from "jwt-decode";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const Profile = () => {
  const [showToast, setShowToast] = useState(false);

  const [profileData, setprofileData] = useState(null);
  const [isFetch, setIsFetch] = useState(false);

  const [password1, setpassword1] = useState(" ");
  const [password2, setpassword2] = useState(" ");

  const inputRef = useRef(null);
  const handleUpload = () => {
    inputRef.current?.click();
  };

  let navigate = useNavigate();
  let authadmin = false;
  let authuser = false;

  async function submitEditProfile(e) {
    const isChecked = e.target.checkbox.checked;
    if (isChecked && password1 === password2) {
      e.preventDefault();

      const formData = new FormData();
      formData.append("uploadedimage", profileData[0].image);
      formData.append("_id", profileData[0]._id);
      formData.append("fullname", profileData[0].fullname);
      formData.append("email", profileData[0].email);
      formData.append("tell", profileData[0].tell);
      formData.append("password", password1);
      formData.append("username", profileData[0].username);

      fetch("http://localhost:8080/postProfilefrom", {
        method: "POST",
        headers: {
          Accept: "applicaion/json",
        },
        body: formData,
      }).then(function (response) {
        return response.json();
      });
      window.scrollTo(0, 0);
      setShowToast(true);
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken.userInfo.admin) {
        authadmin = true;
      }
      if (!decodedToken.userInfo.admin) {
        authuser = true;
      }
    }
    if (!authadmin && !authuser) {
      navigate("/signup", { replace: true });
    }

    const paramSent = jwt_decode(token).userInfo._id;
    fetch(`http://localhost:8080/profileInfo/${paramSent}`)
      .then(function (response) {
        return response.json();
      })
      .then((responseJson) => {
        setIsFetch(true);
        setprofileData(responseJson.data);
        console.log(responseJson.data[0].image);
      });
  }, []);

  return (
    <React.Fragment>
      <Topdash icon="fas fa-user">پروفایل</Topdash>

      <div className="profile">
        <Form
          className="form-profile"
          onSubmit={submitEditProfile}
          method="POST"
          encType="multipart/form-data"
        >
          <div className="top-profile"></div>

          <div className="image-profile">
            <Card className="image-card-profile">
              <Card.Img
                variant="top"
                src={
                  isFetch
                    ? profileData[0].image == undefined
                      ? img
                      : require(`../../assets/uploads/images/` +
                          profileData[0].image)
                    : null
                }
              />
              <Card.Body>
                <input
                  name="uploadedimage"
                  ref={inputRef}
                  className="d-none"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    profileData[0].image = event.target.files[0];
                  }}
                />
                <Button onClick={handleUpload} className="btn-file" type="file">
                  <i className="fas fa-plus"></i>
                </Button>
              </Card.Body>
            </Card>
          </div>

          <div className="form-in mt-4 ">
            <div className="row">
              <div className="col-6 form-input-res">
                <Form.Group className="form-item" controlId="formBasicName">
                  <Form.Label>نام و نام خانوادگی</Form.Label>
                  <FloatingLabel
                    controlId="floatingSelect"
                    label={<i className="fas fa-pen"></i>}
                  ></FloatingLabel>
                  <Form.Control
                    name="fullname"
                    type="text"
                    defaultValue={isFetch ? profileData[0].fullname : ""}
                    contentEditable="true"
                    onChange={(event) => {
                      profileData[0].fullname = event.target.value;
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-6 form-input-res">
                <Form.Group className="form-item" controlId="formBasicEmail">
                  <Form.Label>آدرس ایمیل</Form.Label>
                  <FloatingLabel
                    controlId="floatingSelect"
                    label={<i className="fas fa-pen"></i>}
                  ></FloatingLabel>

                  <Form.Control
                    name="email"
                    type="email"
                    defaultValue={isFetch ? profileData[0].email : ""}
                    contentEditable="true"
                    onChange={(event) => {
                      profileData[0].email = event.target.value;
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-6 form-input-res">
                <Form.Group className="mt-4 form-item" controlId="formBasicSex">
                  <Form.Label>نام کاربری</Form.Label>

                  <FloatingLabel
                    controlId="floatingSelect"
                    label={<i className="fas fa-pen"></i>}
                  ></FloatingLabel>
                  <Form.Control
                    name="username"
                    type="text"
                    defaultValue={isFetch ? profileData[0].username : ""}
                    contentEditable="true"
                    onChange={(event) => {
                      profileData[0].username = event.target.value;
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-6 form-input-res">
                <Form.Group
                  className="mt-4 form-item"
                  controlId="formBasicTell"
                >
                  <Form.Label>شماره تماس</Form.Label>
                  <FloatingLabel
                    controlId="floatingSelect"
                    label={<i className="fas fa-pen"></i>}
                  ></FloatingLabel>

                  <Form.Control
                    name="tell"
                    type="tell"
                    defaultValue={isFetch ? profileData[0].tell : ""}
                    contentEditable="true"
                    onChange={(event) => {
                      profileData[0].tell = event.target.value;
                    }}
                  />
                </Form.Group>
              </div>
            </div>
          </div>
          <div className="row mt-4 change-res">
            <p className="change-password">تغییر رمز عبور</p>
            <div className="col-6 form-input-res">
              <Form.Group className="form-item" controlId="formBasicPassword">
                <Form.Label> رمز عبور جدید</Form.Label>
                <Form.Control
                  name="password1"
                  className="passinput"
                  type="password"
                  placeholder="رمز عبور"
                  onChange={(event) => {
                    setpassword1(event.target.value);
                  }}
                />
              </Form.Group>
            </div>
            <div className="col-6 form-input-res">
              <Form.Group className="form-item" controlId="formBasicPassword2">
                <Form.Label>تکرار رمز عبور</Form.Label>
                <Form.Control
                  name="password2"
                  className="passinput"
                  type="password"
                  placeholder="تکرار رمز عبور"
                  onChange={(event) => {
                    setpassword2(event.target.value);
                  }}
                />
              </Form.Group>
            </div>

            <Form.Group
              className="mt-4 form-item"
              controlId="formBasicCheckbox"
            >
              <Form.Check
                id="checkbox"
                type="checkbox"
                name="checkbox"
                label="از تغییر پروفایل خود مطمئن هستم."
              />
            </Form.Group>
          </div>
          <div className="row mt-4">
            <Button className="btn-save" variant="primary" type="submit">
              ثبت
            </Button>
          </div>
        </Form>
      </div>

      <ToastContainer position="bottom-end">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={4000}
          autohide
        >
          <Toast.Header>
            <strong>تبریک!</strong>
          </Toast.Header>
          <Toast.Body>اطلاعات پروفایل شما با موفقیت به روزرسانی شد✔</Toast.Body>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  );
};

export default Profile;
