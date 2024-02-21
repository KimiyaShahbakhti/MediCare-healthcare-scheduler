import React, { useState, useRef, useEffect } from "react";
import "./pharmacy.css";
import Topdash from "../../topindash/topdash";
import Modalshow from "../../UI/modal/modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const Pharmacy = () => {
  const [showToast, setShowToast] = useState(false);
  const [showToastError, setShowToastError] = useState(false);

  const [name, setname] = useState(" ");
  const [type, setType] = useState(" ");
  const [limitation, setLimitation] = useState(" ");
  const [sideEffect, setSideEffect] = useState(" ");
  const [color, setColor] = useState(" ");

  const [validated, setValidated] = useState(false);
  const [isFetch, setIsFetch] = useState(false);
  const [pharmacy, setPharmacy] = useState(null);

  //modal
  const [modalStates, setModalStates] = useState({});

  const onColorOfMedChange = ({ target: { value } }) => {
    setColor(value);
  };

  async function addMedSubmit(event) {
    const form = event.currentTarget;
    let pharmacyMeds = []
    pharmacy.map(med=>{pharmacyMeds.push(med.medName)})

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      if(pharmacyMeds.includes(name)){
        setShowToastError(true)
      }else{
        fetch("http://localhost:8080/postAddMedForm", {
        method: "POST",
        headers: {
          Accept: "applicaion/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medName: name,
          type: type,
          color: color,
          sideEffect: sideEffect,
          medLimitation: limitation,
        }),
      }).then(function (response) {
        return response.json();
      });
      setShowToast(true);
      }
      window.scrollTo(0, 0);
      
    }
    setValidated(true);
  }
  async function removeMed(event) {
    const medID = event.target.id;
    fetch(`http://localhost:8080/postRemoveMedForm/${medID}`, {
      method: "POST",
    }).then(function (response) {
      return response.json();
    });
  }
  async function editMedSubmit(event) {
    event.preventDefault();

    setModalStates((prevStates) => ({
      ...prevStates,
      [event.target.id]: false,
    }));

    let formData = new FormData(event.currentTarget);
    let name = formData.get("medname");
    let type = formData.get("type");
    let sideEffect = formData.get("sideEffect");
    let limitation = formData.get("limitation");

    const form = event.currentTarget;

    fetch(`http://localhost:8080/editMedInPharmacy/${form.id}`, {
      method: "POST",
      headers: {
        Accept: "applicaion/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        medName: name,
        type: type,
        color: color,
        sideEffect: sideEffect,
        medLimitation: limitation,
      }),
    }).then(function (response) {
      return response.json();
    });
  }

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

    setInterval(function () {
      fetch(`http://localhost:8080/showPharmacy`)
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          setIsFetch(true);
          setPharmacy(responseJson.data);
        });
    }, 100);
  }, []);

  return (
    <React.Fragment>
      <Topdash icon="fas fa-pills">داروخانه</Topdash>
      <div className="pharmacy">
        <div className="show-med">
          <Table responsive bordered className="med-table">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>نام کامل</th>
                <th>نوع</th>
                <th>رنگ</th>
                <th>عوارض‌جانبی</th>
                <th>محدودیت‌مصرف</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isFetch
                ? pharmacy.map((med, index) => {
                    return (
                      <tr key={med._id}>
                        <th>{index + 1}</th>
                        <td>{med.medName}</td>
                        <td>{med.type}</td>
                        <td>{med.color}</td>
                        <td>
                          {(() => {
                            if (med.sideEffect == " ") {
                              return "ندارد";
                            } else {
                              return med.sideEffect;
                            }
                          })()}
                        </td>
                        <td>
                          {med.medLimitation}
                          {(() => {
                            if (med.medLimitation == " ") {
                              return "ندارد";
                            }
                          })()}
                        </td>
                        <td>
                          <Button
                            id={med._id}
                            className="btn-delete"
                            type="submit"
                            onClick={removeMed}
                          >
                            حذف
                          </Button>
                        </td>
                        <td>
                          <Button
                            className="btn-edit"
                            type="submit"
                            onClick={() => {
                              setModalStates((prevStates) => ({
                                ...prevStates,
                                [med._id]: true,
                              }));
                            }}
                          >
                            ویرایش
                          </Button>
                          <Modalshow
                            show={!!modalStates[med._id]}
                            onHide={() => {
                              setModalStates((prevStates) => ({
                                ...prevStates,
                                [med._id]: false,
                              }));
                            }}
                            modalTitle="ویرایش دارو"
                          >
                            <Form
                              id={med._id}
                              noValidate
                              validated={validated}
                              onSubmit={editMedSubmit}
                              method="POST"
                            >
                              <Row>
                                <Form.Group
                                  as={Col}
                                  md="4"
                                  className="form-gp-forres"
                                  controlId="validationCustom01"
                                >
                                  <Form.Label>نام کامل دارو</Form.Label>     
                                  <Form.Control
                                    required
                                    type="text"
                                    name="medname"
                                    defaultValue={med.medName}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    لطفا نام دارو خود را وارد نمایید.
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="4"
                                  className="form-gp-forres"
                                  controlId="validationCustom02"
                                >
                                  <Form.Label>نوع دارو</Form.Label>
                                  <Form.Control
                                    required
                                    type="text"
                                    placeholder="قرص"
                                    defaultValue={med.type}
                                    name="type"
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    لطفا نوع دارو خود را وارد نمایید
                                    (کپسول،قرصريالسرم،آمپول و...).
                                  </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="4"
                                  className="form-gp-forres"
                                  controlId="validationCustom02"
                                >
                                  <Form.Label>محدودیت مصرف</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="مصرف به صورت ناشتا و ..."
                                    defaultValue={med.limitation}
                                    name="limitation"
                                  />
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="4"
                                  className="form-gp-forres"
                                  controlId="validationCustom02"
                                >
                                  <Form.Label>عوارض جانبی</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="سردرد،خواب آلودگی و..."
                                    defaultValue={med.sideEffect}
                                    name="sideEffect"
                                  />
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="4"
                                  className="form-gp-forres"
                                  controlId="validationCustom02"
                                >
                                  <Form.Label>رنگ دارو</Form.Label>
                                  <Form.Check
                                    inline
                                    label="سفید"
                                    name="color-white"
                                    type="radio"
                                    value="سفید"
                                    checked={color === "سفید"}
                                    onChange={onColorOfMedChange}
                                  />
                                  <Form.Check
                                    inline
                                    label="آبی"
                                    name="color-blue"
                                    type="radio"
                                    value="آبی"
                                    checked={color === "آبی"}
                                    onChange={onColorOfMedChange}
                                  />
                                  <Form.Check
                                    inline
                                    label="صورتی"
                                    name="color-pink"
                                    type="radio"
                                    value="صورتی"
                                    checked={color === "صورتی"}
                                    onChange={onColorOfMedChange}
                                  />
                                  <Form.Check
                                    inline
                                    label="زرد"
                                    name="color-yellow"
                                    type="radio"
                                    value="زرد"
                                    checked={color === "زرد"}
                                    onChange={onColorOfMedChange}
                                  />
                                  <Form.Check
                                    inline
                                    label="دیگر"
                                    name="color-other"
                                    type="radio"
                                    value="دیگر"
                                    checked={color === "دیگر"}
                                    onChange={onColorOfMedChange}
                                  />
                                </Form.Group>
                              </Row>

                              <div className="row mt-4">
                                <Button
                                  className="btn-save"
                                  variant="primary"
                                  type="submit"
                                >
                                  ثبت
                                </Button>
                              </div>
                            </Form>
                          </Modalshow>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
            <thead>
              <tr>
                <th>ردیف</th>
                <th>نام کامل</th>
                <th>نوع</th>
                <th>رنگ</th>
                <th>عوارض‌جانبی</th>
                <th>محدودیت‌مصرف</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
          </Table>
        </div>

        <div className="medicine-side">
          <Form
            noValidate
            validated={validated}
            onSubmit={addMedSubmit}
            method="POST"
          >
            <Row>
              <p className="add-to-pharmacy mb-3">
                از این قسمت می‌توانید داروها را به داروخانه اصلی اضافه کنید.
              </p>
              <Form.Group
                as={Col}
                md="4"
                className="form-gp-forres"
                controlId="validationCustom01"
              >
                <Form.Label>نام کامل دارو</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="استامینوفن 500"
                  onChange={(event) => {
                    setname(event.target.value);
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  لطفا نام دارو خود را وارد نمایید.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                as={Col}
                md="4"
                className="form-gp-forres"
                controlId="validationCustom02"
              >
                <Form.Label>نوع دارو</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="قرص"
                  onChange={(event) => {
                    setType(event.target.value);
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  لطفا نوع دارو خود را وارد نمایید (کپسول،قرصريالسرم،آمپول
                  و...).
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                as={Col}
                md="4"
                className="form-gp-forres"
                controlId="validationCustom02"
              >
                <Form.Label>محدودیت مصرف</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="مصرف به صورت ناشتا و ..."
                  onChange={(event) => {
                    setLimitation(event.target.value);
                  }}
                />
                {/* <Form.Control.Feedback type="invalid">
                لطفا سال انقضای دارو خود را جهت کنترل برای مصرف وارد نمایید.
              </Form.Control.Feedback> */}
              </Form.Group>

              <Form.Group
                as={Col}
                md="4"
                className="form-gp-forres"
                controlId="validationCustom02"
              >
                <Form.Label>عوارض جانبی</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="سردرد،خواب آلودگی و..."
                  onChange={(event) => {
                    setSideEffect(event.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group
                as={Col}
                md="4"
                className="form-gp-forres"
                controlId="validationCustom02"
              >
                <Form.Label>رنگ دارو</Form.Label>
                <Form.Check
                  inline
                  label="سفید"
                  name="color-white"
                  type="radio"
                  value="سفید"
                  checked={color === "سفید"}
                  onChange={onColorOfMedChange}
                />
                <Form.Check
                  inline
                  label="آبی"
                  name="color-blue"
                  type="radio"
                  value="آبی"
                  checked={color === "آبی"}
                  onChange={onColorOfMedChange}
                />
                <Form.Check
                  inline
                  label="صورتی"
                  name="color-pink"
                  type="radio"
                  value="صورتی"
                  checked={color === "صورتی"}
                  onChange={onColorOfMedChange}
                />
                <Form.Check
                  inline
                  label="زرد"
                  name="color-yellow"
                  type="radio"
                  value="زرد"
                  checked={color === "زرد"}
                  onChange={onColorOfMedChange}
                />
                <Form.Check
                  inline
                  label="دیگر"
                  name="color-other"
                  type="radio"
                  value="دیگر"
                  checked={color === "دیگر"}
                  onChange={onColorOfMedChange}
                />
              </Form.Group>
            </Row>

            <div className="row mt-4">
              <Button className="btn-save" variant="primary" type="submit">
                ثبت
              </Button>
            </div>
          </Form>
        </div>
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
          <Toast.Body>دارو جدید با موفقیت به داروخانه اضافه شد✔</Toast.Body>
        </Toast>
      </ToastContainer>

      <ToastContainer position="bottom-end">
        <Toast
          onClose={() => setShowToastError(false)}
          show={showToastError}
          delay={4000}
          autohide
        >
          <Toast.Header>
            <strong>اخطار!</strong>
          </Toast.Header>
          <Toast.Body>داروی مورد نظر در داروخانه موجود می‌باشد.</Toast.Body>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  );
};

export default Pharmacy;
