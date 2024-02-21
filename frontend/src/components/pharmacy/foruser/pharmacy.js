import React, { useState, useRef, useEffect } from "react";
import "./pharmacy.css";
import Topdash from "../../topindash/topdash";
import Modalshow from "../../UI/modal/modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Col from "react-bootstrap/Col";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ListGroup from "react-bootstrap/ListGroup";

const Pharmacy = () => {
  const [showToast, setShowToast] = useState(false);

  const [name, setname] = useState(" ");
  const [color, setColor] = useState(" ");

  const [validated, setValidated] = useState(false);
  const [isFetchMed, setIsFetchMed] = useState(false);
  const [isFetchMedicines, setIsFetchMedicines] = useState(false);
  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState(null);
  const [medInfo, setMedInfo] = useState(null);

  const [modalStates, setModalStates] = useState({});

  const [medicineInput, setMedicineInput] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  async function addMedSubmitPersonal(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let sideEffect = formData.get("sideeffect");
    let type = formData.get("type");
    let limitation = formData.get("limitation");

    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    const userID = decodedToken.userInfo._id;
    
    fetch("http://localhost:8080/postAddMedFormPersonal", {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        Accept: "applicaion/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userID,
        medName: name,
        type: type,
        color: color,
        sideEffect: sideEffect,
        medLimitation: limitation,
      }),
    }).then(function (response) {
      return response.json();
    });
    window.scrollTo(0, 0);
    setShowToast(true);
    setValidated(true);
  }
  async function removeMed(event) {
    const medID = event.target.parentElement.id;
    fetch(`http://localhost:8080/postRemoveMedPresonalForm/${medID}`, {
      method: "POST",
    }).then(function (response) {
      return response.json();
    });

    fetch(`http://localhost:8080/postRemoveApoReminderAfterMedForm/${medID}`, {
      method: "POST",
    }).then(function (response) {
      return response.json();
    });

    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    const userID = decodedToken.userInfo._id;

    fetch(
      `http://localhost:8080/postRemoveMedicineFromboxAftermedPresonal/${
        medID + `-` + userID
      }`,
      {
        method: "POST",
      }
    ).then(function (response) {
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
    let type = formData.get("type");
    let sideEffect = formData.get("sideeffect");
    let limitation = formData.get("limitation");
  
    const form = event.currentTarget;

    fetch(`http://localhost:8080/editMedInPharmacyPersonal/${form.id}`, {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        Accept: "applicaion/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: type,
        color: color,
        sideEffect: sideEffect,
        medLimitation: limitation,
      }),
    }).then(function (response) {
      return response.json();
    });

    window.scrollTo(0, 0);
  }

  const onColorOfMedChange = (event) => {
    const newValue = event.target.checked ? event.target.value : "";
    setColor(newValue);
  };

  const handleMedicineInput = (event) => {
    setMedicineInput(event.target.value);
    setname(event.target.value);
    setSelectedMedicine(event.target.value)
  };
  const handleSelectMedicine = (medicine) => {
    setname(medicine.medName);
    setSelectedMedicine(medicine.medName);
    setMedicineInput("");

    const medID = medicine._id;
    fetch(`http://localhost:8080/showSelectedMedicine/${medID}`)
      .then(function (response) {
        return response.json();
      })
      .then((responseJson) => {
        setIsFetchMed(true);
        setMedInfo(responseJson.data);
        setColor(responseJson.data[0].color);
      });
  };

  let navigate = useNavigate();
  let auth = false;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      if (!decodedToken.userInfo.admin) auth = true;
    }
    if (!auth) {
      navigate("/signup", { replace: true });
    }

    fetch(`http://localhost:8080/showPharmacy`)
      .then(function (response) {
        return response.json();
      })
      .then((responseJson) => {
        setPharmacy(responseJson.data);
      });

    const decodedToken = jwt_decode(token);
    const userID = decodedToken.userInfo._id;
    setInterval(function () {
      fetch(`http://localhost:8080/showMedicines/${userID}`)
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          setIsFetchMedicines(true);
          setMedicines(responseJson.data[0].medicines);
        });
    }, 100);
  }, []);

  useEffect(() => {
    if (medicineInput.trim() === "") {
      setFilteredMedicines([]);
      return;
    }
    const filtered = pharmacy.filter((medicine) =>
      medicine.medName.includes(medicineInput)
    );
    setFilteredMedicines(filtered);
  }, [medicineInput, pharmacy]);

  return (
    <React.Fragment>
      <Topdash icon="fas fa-pills">داروخانه</Topdash>
      <div className="pharmacy">
        <div className="pharmacy-side">
          <div className="pharmacy-content">
            {isFetchMedicines
              ? medicines.map((medicine) => (
                  <OverlayTrigger
                    key={medicine._id}
                    placement="bottom"
                    overlay={
                      <Tooltip id={`tooltip-bottom`} className="tooltip">
                        <Card>
                          <Card.Body>
                            <Card.Title>{medicine.medName}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              <i className="fas fa-pills"></i>
                              نوع‌ دارو:
                              {medicine.type}
                            </Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">
                              <i className="fas fa-exclamation-circle"></i>
                              محدودیت مصرف:
                              {(() => {
                                if (medicine.medLimitation == "") {
                                  return "ندارد";
                                } else {
                                  return medicine.medLimitation;
                                }
                              })()}
                            </Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">
                              <i className="fas fa-question-circle"></i>
                              عوارض جانبی:
                              {medicine.sideEffect}
                            </Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">
                              <i className="fas fa-palette"></i>
                              رنگ دارو:
                              {medicine.color}
                            </Card.Subtitle>
                          </Card.Body>
                        </Card>
                      </Tooltip>
                    }
                  >
                    <div className="medicine-item">
                      <Button className="medicine">
                        <div className="btns-med">
                          <Button
                            className="trashbtn"
                            id={medicine._id}
                            onClick={removeMed}
                          >
                            <i className="fas fa-trash-alt trash"></i>
                          </Button>
                          <Button
                            className="editbtn"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(document.querySelectorAll(".tooltip"));
                              document.querySelectorAll(".tooltip").forEach(tootip=>{
                                tootip.classList.remove('show')
                                tootip.style.display ="none";
                              })
                              setModalStates((prevStates) => ({
                                ...prevStates,
                                [medicine._id]: true,
                              }));
                            }}
                          >
                            <i className="fas fa-pen pen"></i>
                          </Button>
                        </div>
                        <Modalshow
                          show={!!modalStates[medicine._id]}
                          onHide={() => {
                            document.querySelector(".tooltip").style.display =
                              "none";
                            setModalStates((prevStates) => ({
                              ...prevStates,
                              [medicine._id]: false,
                            }));
                          }}
                          modalTitle="ویرایش دارو"
                        >
                          <p className="name-top mt-2">
                                {medicine.medName}
                        </p>
                          <Form
                            noValidate
                            validated={validated}
                            id={medicine._id}
                            method="POST"
                            onSubmit={editMedSubmit}
                          >
                            <Row>
                              <Form.Group
                                as={Col}
                                md="4"
                                className="fg-pha-res type-med"
                                controlId="validationCustom02"
                              >
                                <Form.Label>نوع دارو</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="قرص"
                                  name="type"
                                  value={medicine.type}
                                />
                                <Form.Control.Feedback type="invalid">
                                  لطفا نوع دارو خود را وارد نمایید
                                  (کپسول،قرصريالسرم،آمپول و...).
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="4"
                                className="fg-pha-res"
                                controlId="validationCustom02"
                              >
                                <Form.Label>محدودیت مصرف</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="مصرف به صورت ناشتا و ..."
                                  value={medicine.medLimitation}
                                  name="limitation"
                                />
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="4"
                                className="fg-pha-res sideeffect-med"
                                controlId="validationCustom02"
                              >
                                <Form.Label>عوارض جانبی</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="سردرد،خواب آلودگی و..."
                                  name="sideeffect"
                                  value={medicine.sideEffect}
                                />
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="4"
                                className="fg-pha-res color-med"
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
                        {medicine.medName}
                        <hr />
                        <p className="more-for-med"> بیشتر ...</p>
                      </Button>
                    </div>
                  </OverlayTrigger>
                ))
              : null}
          </div>
        </div>

        <div className="medicine-side">
          <Form
            noValidate
            validated={validated}
            onSubmit={addMedSubmitPersonal}
            method="POST"
          >
            <Row>
              <p className="add-to-pharmacy mb-3">
                از این قسمت می‌توانید داروهای مورد استفاده را به داروخانه شخصی
                خود اضافه کنید.
              </p>

              <Form.Group
                as={Col}
                md="4"
                className="fg-pha-res"
                controlId="validationCustom01"
              >
                <Form.Label>نام کامل دارو</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="نام دارو"
                  onChange={handleMedicineInput}
                  value={selectedMedicine}
                  contentEditable
                />
                {filteredMedicines.length > 0 && (
                  <ListGroup className="mt-2 listgroup-selects">
                    {filteredMedicines.map((medicine) => (
                      <ListGroup.Item
                        id={medicine._id}
                        key={medicine._id}
                        onClick={() => handleSelectMedicine(medicine)}
                      >
                        {medicine.medName}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Form.Group>

              <Form.Group
                as={Col}
                md="4"
                className="fg-pha-res type-med"
                controlId="validationCustom02"
              >
                <Form.Label>نوع دارو</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="قرص"
                  name="type"
                  defaultValue={isFetchMed ? medInfo[0].type : null}
                  
                  contentEditable
                />
                <Form.Control.Feedback type="invalid">
                  لطفا نوع دارو خود را وارد نمایید (کپسول،قرصريالسرم،آمپول
                  و...).
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                as={Col}
                md="4"
                className="fg-pha-res"
                controlId="validationCustom02"
              >
                <Form.Label>محدودیت مصرف</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="مصرف به صورت ناشتا و ..."
                  defaultValue={isFetchMed ? medInfo[0].medLimitation : null}
                  contentEditable
                  name="limitation"
                />
              </Form.Group>

              <Form.Group
                as={Col}
                md="4"
                className="fg-pha-res sideeffect-med"
                controlId="validationCustom02"
              >
                <Form.Label>عوارض جانبی</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="سردرد،خواب آلودگی و..."
                  name="sideeffect"
                  defaultValue={isFetchMed ? medInfo[0].sideEffect : null}
                  contentEditable
                />
              </Form.Group>

              <Form.Group
                as={Col}
                md="4"
                className="fg-pha-res color-med"
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
          <Toast.Body>یک داروی جدید به داروخانه شما اضافه شد✔</Toast.Body>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  );
};

export default Pharmacy;
