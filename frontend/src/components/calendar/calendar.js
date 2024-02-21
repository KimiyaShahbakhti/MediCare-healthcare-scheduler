import React, { useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import "./calendar.css";
import Topdash from "../topindash/topdash";
import Button from "./../UI/button/button";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Schedular from "./../schedular/schedular";
import DatePicker from "react-multi-date-picker";
import moment from "moment-jalaali";
import { SchedulerContext } from "../../context/schedular/schedularContext";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Modalshow from "../UI/modal/modal";
import * as shamsi from "shamsi-date-converter";
import ListGroup from "react-bootstrap/ListGroup";

const Callender = () => {
  const [showToast, setShowToast] = useState(false);
  const [validated, setValidated] = useState(false);

  const [isFetchMedicines, setIsFetchMedicines] = useState(false);
  const [medicines, setMedicines] = useState(null);

  const [isFetchMedReminders, setIsFetchMedReminders] = useState(null);
  const [medReminders, setMedReminders] = useState(null);

  const [isFetchApoReminders, setIsFetchApoReminders] = useState(null);
  const [apoReminders, setApoReminders] = useState(null);

  const [isFetchServiceReminders, setIsFetchServiceReminders] = useState(null);
  const [serviceReminders, setServiceReminders] = useState(null);

  const [services, setServices] = useState(null);

  const [medicine, setMedicine] = useState(null);
  const [dose, setDose] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [scheduale, setScheduale] = useState(null);
  const [takemedTime, setTakemedTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [repeathour, setRepeathour] = useState(null);
  const [repeatDate, setRepeatDate] = useState(null);
  const [mintorem, setMintorem] = useState(null);

  const [reason, setReason] = useState(null);
  const [visitDate, setVisitDate] = useState(null);
  const [visitTime, setVisitTime] = useState(null);
  const [drname, setDrname] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const [mintoremapo, setMintoremapo] = useState(null);

  const [medicalServiceDesc, setMedicalServiceDesc] = useState(null);
  const [serviceName, setServiceName] = useState(null);
  const [serviceDate, setServiceDate] = useState(null);
  const [serviceTime, setServiceTime] = useState(null);
  const [mintoremservice, setMintoremservice] = useState(null);

  const [state, setState] = useState({ format: "YYYY/MM/DD" });

  const [serviceInput, setServiceInput] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);

  //modals
  const [modalStates, setModalStates] = useState({});

  let finallReminders = [];

  const { events } = useContext(SchedulerContext);

  //medicine reminders
  async function addReminderSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      finallReminders = [];

      const token = localStorage.getItem("token");
      const decodedToken = jwt_decode(token);
      const userID = decodedToken.userInfo._id;

      const p2e = (item) =>
        item.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
      const start = moment(p2e(startDate), "jYYYY/jMM/jDD").toDate();
      const end = moment(p2e(endDate), "jYYYY/jMM/jDD").toDate();

      finallReminders = calculateReminderTimes(
        start,
        end,
        scheduale,
        takemedTime,
        repeatDate,
        repeathour,
        startTime
      );
      console.log(finallReminders);

      fetch("http://localhost:8080/postAddMedicineRemPersonal", {
        method: "POST",
        // We convert the React state to JSON and send it as the POST body
        headers: {
          Accept: "applicaion/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userID,
          medicine: medicine,
          dose: dose,
          startDate: start,
          endDate: end,
          schedualeType: scheduale,
          reminderTimes: finallReminders,
          startTime: startTime,
          specificHours: takemedTime,
          repeatHours: repeathour,
          repeatDate: repeatDate,
          mintonotif: mintorem,
        }),
      }).then(function (response) {
        return response.json();
      });

      setShowToast(true);
    }
    setValidated(true);
  }
  async function removeMedReminder(event) {
    const remID = event.target.id;
    console.log(remID);
    fetch(`http://localhost:8080/postRemoveReminderForm/${remID}`, {
      method: "POST",
    }).then(function (response) {
      return response.json();
    });
  }
  async function editMedReminderSubmit(event) {
    setModalStates((prevStates) => ({
      ...prevStates,
      [event.target.id]: false,
    }));
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();

      finallReminders = [];

      let start;
      let end;
      if (startDate != null && endDate != null && scheduale != null) {
        const p2e = (item) =>
          item.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
        start = moment(p2e(startDate), "jYYYY/jMM/jDD").toDate();
        end = moment(p2e(endDate), "jYYYY/jMM/jDD").toDate();

        finallReminders = calculateReminderTimes(
          start,
          end,
          scheduale,
          takemedTime,
          repeatDate,
          repeathour,
          startTime
        );
      }

      let formData = new FormData(event.currentTarget);
      let dose = formData.get("dose");
      let mintonotif = formData.get("mintonotif");

      let form = event.currentTarget;

      console.log("here");
      fetch(`http://localhost:8080/editMedReminderPersonal/${form.id}`, {
        method: "POST",
        headers: {
          Accept: "applicaion/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dose: dose,
          startDate: start,
          endDate: end,
          schedualeType: scheduale,
          reminderTimes: finallReminders,
          startTime: startTime,
          specificHours: takemedTime,
          repeatHours: repeathour,
          repeatDate: repeatDate,
          mintonotif: mintonotif,
        }),
      }).then(function (response) {
        return response.json();
      });
    }
  }

  //doctor appointments reminders
  async function addAppointmentSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();

      const token = localStorage.getItem("token");
      const decodedToken = jwt_decode(token);
      const userID = decodedToken.userInfo._id;

      const p2e = (item) =>
        item.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
      const visitD = moment(p2e(visitDate), "jYYYY/jMM/jDD").toDate();

      const [hours, minutes] = visitTime.split(":");
      visitD.setHours(hours);
      visitD.setMinutes(minutes);

      fetch("http://localhost:8080/postAddAppointmentRemPersonal", {
        method: "POST",
        // We convert the React state to JSON and send it as the POST body
        headers: {
          Accept: "applicaion/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userID,
          drname: drname,
          requirements: requirements,
          reason: reason,
          reminderTime: visitD,
          mintoremapo: mintoremapo,
        }),
      }).then(function (response) {
        return response.json();
      });
      setShowToast(true);
      window.scrollTo(0, 0);
    }
    setValidated(true);
  }
  async function removeAppointmentReminder(event) {
    const remID = event.target.id;
    fetch(`http://localhost:8080/postRemoveApoReminderForm/${remID}`, {
      method: "POST",
    }).then(function (response) {
      return response.json();
    });
    window.scrollTo(0, 0);
  }
  async function editAppointmentReminderSubmit(event) {
    setModalStates((prevStates) => ({
      ...prevStates,
      [event.target.id]: false,
    }));
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      let formData = new FormData(event.currentTarget);
      let doctorname = formData.get("drname");
      let problem = formData.get("reason");
      let requirement = formData.get("requirements");
      let mintoremapo = formData.get("mintoremapo");
      console.log(mintoremapo);

      const p2e = (item) =>
        item.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
      const visitD = moment(p2e(visitDate), "jYYYY/jMM/jDD").toDate();

      const [hours, minutes] = visitTime.split(":");
      visitD.setHours(hours);
      visitD.setMinutes(minutes);

      console.log(visitD);
      let form = event.currentTarget;
      fetch(`http://localhost:8080/editApoReminderPersonal/${form.id}`, {
        method: "POST",
        headers: {
          Accept: "applicaion/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drname: doctorname,
          requirements: requirement,
          reason: problem,
          reminderTime: visitD,
          mintoremapo: mintoremapo,
        }),
      }).then(function (response) {
        return response.json();
      });
      window.scrollTo(0, 0);
    }
  }

  //medical resvices remindres
  async function addMedicalServiceSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();

      const token = localStorage.getItem("token");
      const decodedToken = jwt_decode(token);
      const userID = decodedToken.userInfo._id;

      const p2e = (item) =>
        item.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
      const serviceD = moment(p2e(serviceDate), "jYYYY/jMM/jDD").toDate();

      const [hours, minutes] = serviceTime.split(":");
      serviceD.setHours(hours);
      serviceD.setMinutes(minutes);

      fetch("http://localhost:8080/postAddMedicalServiceRemPersonal", {
        method: "POST",
        // We convert the React state to JSON and send it as the POST body
        headers: {
          Accept: "applicaion/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userID,
          serviceName: serviceName,
          desc: medicalServiceDesc,
          reminderTime: serviceD,
          mintoremservice: mintoremservice,
        }),
      }).then(function (response) {
        return response.json();
      });
      setShowToast(true);
      window.scrollTo(0, 0);
    }
    setValidated(true);
  }
  async function removeMedicalServiceReminder(event) {
    const remID = event.target.id;
    fetch(
      `http://localhost:8080/postRemoveMedicalServiceReminderForm/${remID}`,
      {
        method: "POST",
      }
    ).then(function (response) {
      return response.json();
    });
    window.scrollTo(0, 0);
  }
  async function editMedicalServiceReminderSubmit(event) {
    setModalStates((prevStates) => ({
      ...prevStates,
      [event.target.id]: false,
    }));
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      let formData = new FormData(event.currentTarget);
      let servicetime = formData.get("servicetime");
      let mintoremservice = formData.get("mintoremservice");
      let desc = formData.get("desc");

      const p2e = (item) =>
        item.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
      const serviceD = moment(p2e(serviceDate), "jYYYY/jMM/jDD").toDate();

      const [hours, minutes] = servicetime.split(":");
      serviceD.setHours(hours);
      serviceD.setMinutes(minutes);

      let form = event.currentTarget;

      fetch(
        `http://localhost:8080/editMedicalServiceReminderPersonal/${form.id}`,
        {
          method: "POST",
          headers: {
            Accept: "applicaion/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            desc: desc,
            reminderTime: serviceD,
            mintoremservice: mintoremservice,
          }),
        }
      ).then(function (response) {
        return response.json();
      });
      window.scrollTo(0, 0);
    }
  }

  function calculateReminderTimes(
    start,
    end,
    scheduale,
    takemedTime,
    repeatDate,
    repeathour,
    startTime
  ) {
    let reminderTimes = [];

    if (scheduale == "specificHour") {
      const [hours, minutes] = takemedTime.split(":");

      start.setHours(hours);
      start.setMinutes(minutes);

      switch (repeatDate) {
        case "everyday":
          reminderTimes = calculateDays(start, end, hours, minutes, 1);
          break;
        case "each2days":
          reminderTimes = calculateDays(start, end, hours, minutes, 2);
          break;
        case "each3days":
          reminderTimes = calculateDays(start, end, hours, minutes, 3);
          break;
        case "each4days":
          reminderTimes = calculateDays(start, end, hours, minutes, 4);
          break;
        case "each5days":
          reminderTimes = calculateDays(start, end, hours, minutes, 5);
          break;
        case "each7days":
          reminderTimes = calculateDays(start, end, hours, minutes, 6);
          break;
        case "everyweek":
          reminderTimes = calculateDays(start, end, hours, minutes, 7);
          break;
        case "everymonth":
          reminderTimes = calculateDays(start, end, hours, minutes, 30);
          break;
        default:
          break;
      }
    } else if (scheduale == "everyHour") {
      const [hours, minutes] = startTime.split(":");

      start.setHours(hours);
      start.setMinutes(minutes);

      switch (repeathour) {
        case "each6hour":
          reminderTimes = calculateTimes(start, end, hours, minutes, 6);
          break;
        case "each8hour":
          reminderTimes = calculateTimes(start, end, hours, minutes, 8);
          break;
        case "each12hour":
          reminderTimes = calculateTimes(start, end, hours, minutes, 12);
          break;
      }
    }

    return reminderTimes;
  }
  function calculateDays(start, end, hours, minutes, dayCount) {
    let reminderTimes = [];
    while (start <= end) {
      reminderTimes.push(new Date(start));
      start.setDate(start.getDate() + dayCount);
      if (start.getDate() == end.getDate()) {
        end.setHours(hours);
        end.setMinutes(minutes);
      }
    }
    return reminderTimes;
  }
  function calculateTimes(start, end, hours, minutes, eachHour) {
    let reminderTimes = [];
    while (start <= end) {
      reminderTimes.push(new Date(start));
      start.setTime(start.getTime() + eachHour * 60 * 60 * 1000);

      // console.log(start, end,start.toISOString().substring(0,10),end.toISOString().substring(0,10));
      if (start.getDate() == end.getDate()) {
        end.setHours(hours);
        end.setMinutes(minutes);
      }
    }
    return reminderTimes;
  }
  function selecttiming(event) {
    let selected = event.target.value;
    const td = document.querySelector(".timing-day-items");
    const tx = document.querySelector(".timing-xhour");
    const txm = document.querySelector(".timing-xhour-modal");
    const tdm = document.querySelector(".timing-day-items-modal");

    if (selected == "specificHour") {
      tx.style.display = "none";
      td.style.display = "block";
    } else if (selected == "everyHour") {
      td.style.display = "none";
      tx.style.display = "block";
    } else if (selected == "everyHour-modal") {
      selected = "everyHour";
      tdm.style.display = "none";
      txm.style.display = "block";
    } else if (selected == "specificHour-modal") {
      selected = "specificHour";
      tdm.style.display = "block";
      txm.style.display = "none";
    } else if (selected == "choose") {
      td.style.display = "none";
      tx.style.display = "none";
    } else if (selected == "choose-modal") {
      tdm.style.display = "none";
      txm.style.display = "none";
    }

    event.target.size = 1;
    event.target.blur();
    setScheduale(selected);
  }
  function convertStartdate(date, format = state.format) {
    let object = { date, format };
    setStartDate(new DateObject(object).format());
  }
  function convertVisitdate(date, format = state.format) {
    let object = { date, format };
    setVisitDate(new DateObject(object).format());
  }
  function convertEnddate(date, format = state.format) {
    let object = { date, format };
    setEndDate(new DateObject(object).format());
  }
  function convertServicedate(date, format = state.format) {
    let object = { date, format };
    setServiceDate(new DateObject(object).format());
  }

  function showAlert(display) {
    document.querySelector(".no-plan").style.display = display;
    document.querySelector(".cardsScroll").style.padding = "10px 0px";
    document.querySelector(".cardsScroll").style.marginTop = "10px";
  }
  function changeStyle() {
    setTimeout(() => {
      document.querySelector(".cardsScroll").style.padding = "0";
      document.querySelector(".cardsScroll").style.margin = "0";
    }, 500);
  }
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
  function calculateRemTime(time) {
    let date = toShamsi(
      time.substring(0, 4),
      time.substring(5, 7),
      time.substring(8, 10)
    );

    let dateForCalTime = new Date(time);
    let takeMedHour = dateForCalTime
      .toLocaleString("en-US", options)
      .split(",")[3];
    if (takeMedHour.length == 20) {
      takeMedHour = takeMedHour.substring(0, 5);
    }
    if (takeMedHour.length == 21) {
      takeMedHour = takeMedHour.substring(0, 6);
    }
    let pmoram = dateForCalTime
      .toLocaleString("en-US", options)
      .split(",")[3]
      .includes("PM");
    if (pmoram) {
      pmoram = "بعدازظهر";
    } else if (!pmoram) {
      pmoram = "قبل‌ازظهر";
    }

    return "مورخ " + date + " ساعت " + takeMedHour + " " + pmoram;
  }

  const handleServiceInput = (event) => {
    setServiceInput(event.target.value);
    setServiceName(event.target.value);
    setSelectedService(event.target.value);
  };
  const handleSelectService = (service) => {
    setServiceName(service.service);
    setSelectedService(service.service);
    setServiceInput("");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    const userID = decodedToken.userInfo._id;

    fetch(`http://localhost:8080/showMedicines/${userID}`)
      .then(function (response) {
        return response.json();
      })
      .then((responseJson) => {
        setIsFetchMedicines(true);
        setMedicines(responseJson.data[0].medicines);
      });

    setInterval(() => {
      fetch(`http://localhost:8080/showMedicineReminder/${userID}`)
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          setIsFetchMedReminders(true);
          setMedReminders(responseJson.data);
        });
    }, 100);

    setInterval(() => {
      fetch(`http://localhost:8080/showAppointmentReminder/${userID}`)
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          setIsFetchApoReminders(true);
          setApoReminders(responseJson.data);
        });
    }, 100);

    setInterval(() => {
      fetch(`http://localhost:8080/showMedicalServiceReminder/${userID}`)
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          setIsFetchServiceReminders(true);
          setServiceReminders(responseJson.data);
        });
    }, 100);

    fetch(`http://localhost:8080/showMedicalServices`)
      .then(function (response) {
        return response.json();
      })
      .then((responseJson) => {
        setServices(responseJson.data);
      });
  }, []);
  useEffect(() => {
    if (serviceInput.trim() === "") {
      setFilteredServices([]);
      return;
    }

    const filtered = services.filter((service) =>
      service.service.includes(serviceInput)
    );
    setFilteredServices(filtered);
  }, [serviceInput, services]);

  return (
    <React.Fragment>
      <Topdash icon="far fa-calendar-alt">مدیریت یادآورها</Topdash>
      <div className="calendar">
        <Row>
          <div className="schedular-side">
            <Schedular />
          </div>
          <div className="today-side">
            <div className="today-plan">
              <p className="today-plan-date">
                <p>تاریخ : </p>
                <p className="date-show">
                  بر روی روز مورد نظر در تقویم بالا کلیک کنید.
                </p>
              </p>
              <div className="cardsScroll">
                <p className="no-plan">
                  برنامه‌ای برای این روز موجود نمی‌باشد.
                </p>
                {events == undefined
                  ? changeStyle()
                  : events == ""
                  ? showAlert("block")
                  : events.map((todayEvent) => {
                      showAlert("none");
                      return (
                        <Card className="today-card" id={todayEvent.event_id}>
                          <Card.Body>
                            <Card.Title>{todayEvent.remType}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {todayEvent.time}
                            </Card.Subtitle>
                            <Card.Text className="mt-3">
                              <div className="medicine">
                                <i
                                  className={
                                    todayEvent.remType == "وقت‌های پزشکی"
                                      ? "fa fa-user-md"
                                      : todayEvent.remType == "مصرف دارو"
                                      ? "fas fa-capsules"
                                      : "fas fa-hospital-symbol"
                                  }
                                ></i>
                                <p className="med-use">{todayEvent.plan}</p>
                                <br />
                                {todayEvent.remType == "وقت‌های پزشکی" ? (
                                  <div>
                                    <i className="fas fa-notes-medical"></i>
                                    <p className="med-use">
                                      پیش‌نیاز مراجعه : {todayEvent.plan2}
                                    </p>
                                  </div>
                                ) : todayEvent.remType == "خدمات درمانی" ? (
                                  <div>
                                    <i className="fas fa-notes-medical"></i>
                                    <p className="med-use">
                                      توضیحات :{" "}
                                      {todayEvent.plan2 != null
                                        ? todayEvent.plan2
                                        : "-"}
                                    </p>
                                  </div>
                                ) : null}
                              </div>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      );
                    })}
              </div>
            </div>
            <div className="addrem">
              <p className="addrem-main-title">
                <p className="addrem-title">اضافه کردن یادآور</p>
              </p>
              <Tabs id="fill-tab-example" className="classify-tab">
                <Tab eventKey="medicine-time" title="مصرف دارو">
                  <Form
                    noValidate
                    validated={validated}
                    method="POST"
                    onSubmit={addReminderSubmit}
                    className="addrem-form"
                  >
                    <Form.Group as={Row} className="mb-4 fg-calform-res">
                      <Form.Label column sm="4">
                        انتخاب دارو
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <Form.Control
                          onFocus={(event) => {
                            event.target.size = 3;
                          }}
                          onBlur={(event) => {
                            event.target.size = 1;
                          }}
                          as="select"
                          name="medicine"
                          onChange={(event) => {
                            setMedicine(event.target.value);
                            event.target.size = 1;
                            event.target.blur();
                          }}
                        >
                          <option value="choose">انتخاب کنید</option>
                          {isFetchMedicines
                            ? medicines.map((medicine) => {
                                return (
                                  <option value={medicine._id}>
                                    {medicine.medName}
                                  </option>
                                );
                              })
                            : null}
                        </Form.Control>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-4 fg-calform-res">
                      <Form.Label column sm="4">
                        مقدار مصرف
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <Form.Control
                          required
                          name="dose"
                          type="text"
                          onChange={(event) => {
                            setDose(event.target.value);
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          لطفا مقدار مصرف دارو را مشخص کنید.
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group className="mb-4 fg-calform-res" as={Row}>
                      <Form.Label column sm="4">
                        تاریخ شروع
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <DatePicker
                          onChange={convertStartdate}
                          calendar={persian}
                          locale={persian_fa}
                        ></DatePicker>
                      </Col>
                    </Form.Group>

                    <Form.Group className="mb-4 fg-calform-res" as={Row}>
                      <Form.Label column sm="4">
                        زمان‌بندی
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <Form.Control
                          onFocus={(event) => {
                            event.target.size = 3;
                          }}
                          onBlur={(event) => {
                            event.target.size = 1;
                          }}
                          as="select"
                          id="timing-type"
                          onChange={selecttiming}
                        >
                          <option value="choose">انتخاب کنید</option>
                          <option value="specificHour">ساعت مشخص</option>
                          <option value="everyHour">هر چند؟ ساعت</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>

                    <div className="timing-day-items">
                      <Form.Group className="mb-4 fg-calform-res" as={Row}>
                        <Form.Label column sm="4">
                          زمان مصرف
                        </Form.Label>
                        <Col sm="8" className="input-res">
                          <Form.Control
                            type="time"
                            name="taketime"
                            onChange={(event) => {
                              setTakemedTime(event.target.value);
                            }}
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group className="mb-4 fg-calform-res" as={Row}>
                        <Form.Label column sm="4">
                          تکرار
                        </Form.Label>
                        <Col sm="8" className="input-res">
                          <Form.Control
                            onFocus={(event) => {
                              event.target.size = 5;
                            }}
                            onBlur={(event) => {
                              event.target.size = 1;
                            }}
                            as="select"
                            id="timing-type"
                            onChange={(event) => {
                              setRepeatDate(event.target.value);
                              event.target.size = 1;
                              event.target.blur();
                            }}
                          >
                            <option value="choose">انتخاب کنید</option>
                            <option value="everyday">هر روز</option>
                            <option value="each2days">هر2روز</option>
                            <option value="each3days">هر3روز</option>
                            <option value="each4days">هر4روز</option>
                            <option value="each5days">هر5روز</option>
                            <option value="each6days">هر6روز</option>
                            <option value="everyweek">هر هفته</option>
                            <option value="everymonth">هر ماه</option>
                          </Form.Control>
                        </Col>
                      </Form.Group>
                    </div>

                    <div className="timing-xhour">
                      <Form.Group className="mb-4 fg-calform-res" as={Row}>
                        <Form.Label column sm="4">
                          زمان شروع
                        </Form.Label>
                        <Col sm="8" className="input-res">
                          <Form.Control
                            type="time"
                            name="starttime"
                            onChange={(event) => {
                              setStartTime(event.target.value);
                            }}
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group className="mb-4 fg-calform-res" as={Row}>
                        <Form.Label column sm="4">
                          تکرار
                        </Form.Label>
                        <Col sm="8" className="input-res">
                          <Form.Control
                            onFocus={(event) => {
                              event.target.size = 4;
                            }}
                            onBlur={(event) => {
                              event.target.size = 1;
                            }}
                            as="select"
                            name="repeathour"
                            onChange={(event) => {
                              setRepeathour(event.target.value);
                              event.target.size = 1;
                              event.target.blur();
                            }}
                          >
                            <option value="choose">انتخاب کنید</option>
                            <option value="each6hour">هر 6 ساعت</option>
                            <option value="each8hour">هر 8 ساعت</option>
                            <option value="each12hour">هر 12 ساعت</option>
                          </Form.Control>
                        </Col>
                      </Form.Group>
                    </div>

                    <Form.Group className="mb-4 fg-calform-res" as={Row}>
                      <Form.Label column sm="4">
                        تاریخ پایان
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <DatePicker
                          onChange={convertEnddate}
                          calendar={persian}
                          locale={persian_fa}
                        ></DatePicker>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-4 fg-calform-res">
                      <Form.Label column sm="4">
                        زمان مانده به نمایش اعلان
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <Form.Control
                          placeholder="5 (5 دقیقه مانده به زمان یادآور)"
                          name="mintonotif"
                          type="text"
                          onChange={(event) => {
                            setMintorem(event.target.value);
                          }}
                        />
                      </Col>
                    </Form.Group>

                    <Row className="done-btn">
                      <Button
                        btnheight="btn-h40"
                        btnsize="btn-100"
                        btnstyle="btn-pink"
                      >
                        ثبت
                      </Button>
                    </Row>
                  </Form>
                </Tab>
                <Tab eventKey="appointment-time" title="نوبت پزشکی">
                  <Form
                    noValidate
                    validated={validated}
                    method="POST"
                    onSubmit={addAppointmentSubmit}
                    className="addrem-form"
                  >
                    <Form.Group as={Row} className="mb-4 fg-calform-res">
                      <Form.Label column sm="4">
                        نام پزشک
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <Form.Control
                          required
                          name="drname"
                          onChange={(event) => {
                            setDrname(event.target.value);
                          }}
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">
                          لطفا نام پزشک خود را وارد کنید.
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-4 fg-calform-res">
                      <Form.Label column sm="4">
                        علت مراجعه
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <Form.Control
                          name="reason"
                          type="text"
                          onChange={(event) => {
                            setReason(event.target.value);
                          }}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group className="mb-4 fg-calform-res" as={Row}>
                      <Form.Label column sm="4">
                        تاریخ مراجعه
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <DatePicker
                          onChange={convertVisitdate}
                          calendar={persian}
                          locale={persian_fa}
                        ></DatePicker>
                      </Col>
                    </Form.Group>

                    <Form.Group className="mb-4 fg-calform-res" as={Row}>
                      <Form.Label column sm="4">
                        زمان مراجعه
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <Form.Control
                          type="time"
                          name="visittime"
                          onChange={(event) => {
                            setVisitTime(event.target.value);
                          }}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-4 fg-calform-res">
                      <Form.Label column sm="4">
                        پیش‌نیاز مراجعه
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <Form.Control
                          name="requirements"
                          type="text"
                          onChange={(event) => {
                            setRequirements(event.target.value);
                          }}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-4 fg-calform-res">
                      <Form.Label column sm="4">
                        زمان مانده به نمایش اعلان
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <Form.Control
                          placeholder="5 (5 دقیقه مانده به زمان یادآور)"
                          name="mintoremapo"
                          type="text"
                          onChange={(event) => {
                            setMintoremapo(event.target.value);
                          }}
                        />
                      </Col>
                    </Form.Group>

                    <Row className="done-btn">
                      <Button
                        btnheight="btn-h40"
                        btnsize="btn-100"
                        btnstyle="btn-pink"
                      >
                        ثبت
                      </Button>
                    </Row>
                  </Form>
                </Tab>

                <Tab eventKey="medical-time" title="خدمات درمانی">
                  <Form
                    noValidate
                    validated={validated}
                    method="POST"
                    onSubmit={addMedicalServiceSubmit}
                    className="addrem-form"
                  >
                    <Form.Group as={Row} className="mb-4 fg-calform-res">
                      <Form.Label column sm="4">
                        عنوان خدمات
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <Form.Control
                          type="text"
                          placeholder="آزمایش خون و ..."
                          onChange={handleServiceInput}
                          value={selectedService}
                          contentEditable
                        />
                        {filteredServices.length > 0 && (
                          <ListGroup className="mt-2 listgroup-selects-cal">
                            {filteredServices.map((service) => (
                              <ListGroup.Item
                                id={service._id}
                                key={service._id}
                                onClick={() => handleSelectService(service)}
                              >
                                {service.service}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </Col>
                    </Form.Group>

                    <Form.Group className="mb-4 fg-calform-res" as={Row}>
                      <Form.Label column sm="4">
                        تاریخ
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <DatePicker
                          onChange={convertServicedate}
                          calendar={persian}
                          locale={persian_fa}
                        ></DatePicker>
                      </Col>
                    </Form.Group>

                    <Form.Group className="mb-4 fg-calform-res" as={Row}>
                      <Form.Label column sm="4">
                        زمان
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <Form.Control
                          type="time"
                          name="visittime"
                          onChange={(event) => {
                            setServiceTime(event.target.value);
                          }}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-4 fg-calform-res">
                      <Form.Label column sm="4">
                        توضیحات
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <Form.Control
                          name="requirements"
                          type="text"
                          onChange={(event) => {
                            setMedicalServiceDesc(event.target.value);
                          }}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-4 fg-calform-res">
                      <Form.Label column sm="4">
                        زمان مانده به نمایش اعلان
                      </Form.Label>
                      <Col sm="8" className="input-res">
                        <Form.Control
                          placeholder="5 (5 دقیقه مانده به زمان یادآور)"
                          name="mintoremapo"
                          type="text"
                          onChange={(event) => {
                            setMintoremservice(event.target.value);
                          }}
                        />
                      </Col>
                    </Form.Group>

                    <Row className="done-btn">
                      <Button
                        btnheight="btn-h40"
                        btnsize="btn-100"
                        btnstyle="btn-pink"
                      >
                        ثبت
                      </Button>
                    </Row>
                  </Form>
                </Tab>
              </Tabs>
            </div>
          </div>

          <div className="show-reminders">
            <div className="reminders">
              <p className="reminder-title">یادآورها</p>
              <Tabs id="fill-tab-example" className="reminder-tab">
                {isFetchMedReminders
                  ? medReminders.map((reminder) => {
                      return (
                        <Tab
                          eventKey={`calendar/${reminder._id}`}
                          title={reminder.medicine.medName}
                        >
                          <div className="buttons-in-showreminderr">
                            <span>جهت حذف یادآور بر روی </span>
                            <button
                              btnheight="btn-h40"
                              btnsize="btn-50"
                              id={reminder._id}
                              className="btn-delete"
                              type="submit"
                              onClick={removeMedReminder}
                            >
                              حذف
                            </button>
                            <span>و ویرایش آن بر روی</span>
                            <button
                              btnheight="btn-h40"
                              btnsize="btn-50"
                              className="btn-edit"
                              type="submit"
                              onClick={() => {
                                setModalStates((prevStates) => ({
                                  ...prevStates,
                                  [reminder._id]: true,
                                }));
                              }}
                            >
                              ویرایش
                            </button>
                            <span>کلیک کنید.</span>
                          </div>

                          <Modalshow
                            show={!!modalStates[reminder._id]}
                            onHide={() => {
                              setModalStates((prevStates) => ({
                                ...prevStates,
                                [reminder._id]: false,
                              }));
                            }}
                            modalTitle="ویرایش یادآور"
                          >
                            <Form
                              noValidate
                              validated={validated}
                              method="POST"
                              onSubmit={editMedReminderSubmit}
                              className="editrem-form"
                              id={reminder._id}
                            >
                              <p className="name-top">
                                {reminder.medicine.medName}
                              </p>

                              <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                  مقدار مصرف
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <Form.Control
                                    required
                                    name="dose"
                                    type="text"
                                    onChange={(event) => {
                                      setDose(event.target.value);
                                    }}
                                    Value={reminder.dose}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    لطفا مقدار مصرف دارو را مشخص کنید.
                                  </Form.Control.Feedback>
                                </Col>
                              </Form.Group>

                              <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                  تاریخ شروع
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <DatePicker
                                    name="startdate"
                                    onChange={convertStartdate}
                                    calendar={persian}
                                    locale={persian_fa}
                                  ></DatePicker>
                                </Col>
                              </Form.Group>

                              <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                  تاریخ پایان
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <DatePicker
                                    name="enddate"
                                    onChange={convertEnddate}
                                    calendar={persian}
                                    locale={persian_fa}
                                  ></DatePicker>
                                </Col>
                              </Form.Group>

                              <Form.Group className="mb-3" as={Row}>
                                <Form.Label column sm="4">
                                  زمان‌بندی
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <Form.Control
                                    onFocus={(event) => {
                                      event.target.size = 3;
                                    }}
                                    onBlur={(event) => {
                                      event.target.size = 1;
                                    }}
                                    as="select"
                                    name="scheduale"
                                    id="timing-type"
                                    onChange={selecttiming}
                                  >
                                    <option value="choose-modal">
                                      انتخاب کنید
                                    </option>
                                    <option value="specificHour-modal">
                                      ساعت مشخص
                                    </option>
                                    <option value="everyHour-modal">
                                      هر چند؟ ساعت
                                    </option>
                                  </Form.Control>
                                </Col>
                              </Form.Group>

                              <div className="mb-3 timing-day-items-modal">
                                <Form.Group
                                  className="mb-3 fg-remform-res"
                                  as={Row}
                                >
                                  <Form.Label column sm="4">
                                    زمان مصرف
                                  </Form.Label>
                                  <Col sm="8" className="input-res">
                                    <Form.Control
                                      type="time"
                                      name="taketime"
                                      onChange={(event) => {
                                        setTakemedTime(event.target.value);
                                      }}
                                    />
                                  </Col>
                                </Form.Group>
                                <Form.Group className="fg-remform-res" as={Row}>
                                  <Form.Label column sm="4">
                                    تکرار
                                  </Form.Label>
                                  <Col sm="8" className="input-res">
                                    <Form.Control
                                      onFocus={(event) => {
                                        event.target.size = 5;
                                      }}
                                      onBlur={(event) => {
                                        event.target.size = 1;
                                      }}
                                      as="select"
                                      id="timing-type"
                                      name="daysrepeat"
                                      onChange={(event) => {
                                        setRepeatDate(event.target.value);
                                        event.target.size = 1;
                                        event.target.blur();
                                      }}
                                    >
                                      <option value="choose">
                                        انتخاب کنید
                                      </option>
                                      <option value="everyday">هر روز</option>
                                      <option value="each2days">هر2روز</option>
                                      <option value="each3days">هر3روز</option>
                                      <option value="each4days">هر4روز</option>
                                      <option value="each5days">هر5روز</option>
                                      <option value="each6days">هر6روز</option>
                                      <option value="everyweek">هر هفته</option>
                                      <option value="everymonth">هر ماه</option>
                                    </Form.Control>
                                  </Col>
                                </Form.Group>
                              </div>

                              <div className=" mb-3 timing-xhour-modal">
                                <Form.Group
                                  className="mb-3 fg-remform-res"
                                  as={Row}
                                >
                                  <Form.Label column sm="4">
                                    زمان شروع
                                  </Form.Label>
                                  <Col sm="8" className="input-res">
                                    <Form.Control
                                      type="time"
                                      name="starttime"
                                      onChange={(event) => {
                                        setStartTime(event.target.value);
                                      }}
                                    />
                                  </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                  <Form.Label column sm="4">
                                    تکرار
                                  </Form.Label>
                                  <Col sm="8" className="input-res">
                                    <Form.Control
                                      onFocus={(event) => {
                                        event.target.size = 4;
                                      }}
                                      onBlur={(event) => {
                                        event.target.size = 1;
                                      }}
                                      as="select"
                                      name="repeathour"
                                      onChange={(event) => {
                                        setRepeathour(event.target.value);
                                        event.target.size = 1;
                                        event.target.blur();
                                      }}
                                    >
                                      <option value="choose">
                                        انتخاب کنید
                                      </option>
                                      <option value="each6hour">
                                        هر 6 ساعت
                                      </option>
                                      <option value="each8hour">
                                        هر 8 ساعت
                                      </option>
                                      <option value="each12hour">
                                        هر 12 ساعت
                                      </option>
                                    </Form.Control>
                                  </Col>
                                </Form.Group>
                              </div>

                              <Form.Group
                                as={Row}
                                className="mb-3 fg-calform-res"
                              >
                                <Form.Label column sm="4">
                                  زمان مانده به نمایش اعلان
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <Form.Control
                                    placeholder="5 (5 دقیقه مانده به زمان یادآور)"
                                    name="mintonotif"
                                    type="text"
                                    onChange={(event) => {
                                      setMintorem(event.target.value);
                                    }}
                                    Value={reminder.mintonotif}
                                  />
                                </Col>
                              </Form.Group>

                              <Row className="done-btn">
                                <Button
                                  btnheight="btn-h40"
                                  btnsize="btn-100"
                                  btnstyle="btn-pink"
                                >
                                  ثبت
                                </Button>
                              </Row>
                            </Form>
                          </Modalshow>

                          {reminder.reminderTimes.map((remtime) => {
                            // if (reminder.problem === reminder.boxName) {
                            return (
                              <div className="each-rem">
                                <Card id={remtime}>
                                  <Card.Body>
                                    <Card.Title>
                                      {reminder.medicine.medName}
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                      مقدار مصرف :{reminder.dose}
                                    </Card.Subtitle>
                                    <Card.Text>
                                      {calculateRemTime(remtime)}
                                    </Card.Text>
                                  </Card.Body>
                                </Card>
                              </div>
                            );
                          })}
                        </Tab>
                      );
                    })
                  : null}
                {isFetchApoReminders
                  ? apoReminders.map((reminder) => {
                      return (
                        <Tab
                          eventKey={`apopointment/${reminder._id}`}
                          title={reminder.doctorName}
                        >
                          <div className="buttons-in-showreminderr">
                            <span>جهت حذف یادآور بر روی </span>
                            <button
                              btnheight="btn-h40"
                              btnsize="btn-50"
                              id={reminder._id}
                              className="btn-delete"
                              type="submit"
                              onClick={removeAppointmentReminder}
                            >
                              حذف
                            </button>
                            <span>و ویرایش آن بر روی</span>
                            <button
                              btnheight="btn-h40"
                              btnsize="btn-50"
                              className="btn-edit"
                              type="submit"
                              onClick={() => {
                                setModalStates((prevStates) => ({
                                  ...prevStates,
                                  [reminder._id]: true,
                                }));
                              }}
                            >
                              ویرایش
                            </button>
                            <span>کلیک کنید.</span>
                          </div>
                          <Modalshow
                            show={!!modalStates[reminder._id]}
                            onHide={() => {
                              setModalStates((prevStates) => ({
                                ...prevStates,
                                [reminder._id]: false,
                              }));
                            }}
                            modalTitle="ویرایش یادآور"
                          >
                            <Form
                              noValidate
                              validated={validated}
                              method="POST"
                              onSubmit={editAppointmentReminderSubmit}
                              className="editrem-form"
                              id={reminder._id}
                            >
                              <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                  نام پزشک
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <Form.Control
                                    required
                                    name="drname"
                                    onChange={(event) => {
                                      setDrname(event.target.value);
                                    }}
                                    Value={reminder.doctorName}
                                  ></Form.Control>
                                  <Form.Control.Feedback type="invalid">
                                    لطفا نام پزشک خود را وارد کنید.
                                  </Form.Control.Feedback>
                                </Col>
                              </Form.Group>

                              <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                  علت مراجعه
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <Form.Control
                                    name="reason"
                                    type="text"
                                    onChange={(event) => {
                                      setReason(event.target.value);
                                    }}
                                    Value={reminder.reason}
                                  />
                                </Col>
                              </Form.Group>

                              <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                  تاریخ مراجعه
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <DatePicker
                                    onChange={convertVisitdate}
                                    calendar={persian}
                                    locale={persian_fa}
                                  ></DatePicker>
                                </Col>
                              </Form.Group>

                              <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                  زمان مراجعه
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <Form.Control
                                    type="time"
                                    name="visittime"
                                    onChange={(event) => {
                                      setVisitTime(event.target.value);
                                    }}
                                  />
                                </Col>
                              </Form.Group>

                              <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                  پیش‌نیاز مراجعه
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <Form.Control
                                    name="requirements"
                                    type="text"
                                    onChange={(event) => {
                                      setRequirements(event.target.value);
                                    }}
                                    Value={reminder.requirements}
                                  />
                                </Col>
                              </Form.Group>

                              <Form.Group as={Row} className="mb-4 ">
                                <Form.Label column sm="4">
                                  زمان مانده به نمایش اعلان
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <Form.Control
                                    placeholder="5 (5 دقیقه مانده به زمان یادآور)"
                                    type="text"
                                    name="mintoremapo"
                                    onChange={(event) => {
                                      setMintoremapo(event.target.value);
                                    }}
                                    Value={reminder.mintonotif}
                                  />
                                </Col>
                              </Form.Group>

                              <Row className="done-btn">
                                <Button
                                  btnheight="btn-h40"
                                  btnsize="btn-100"
                                  btnstyle="btn-pink"
                                >
                                  ثبت
                                </Button>
                              </Row>
                            </Form>
                          </Modalshow>

                          <div className="each-rem">
                            <Card>
                              <Card.Body>
                                <Card.Title>{reminder.doctorName}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                  نیازمندی های مراجعه :{reminder.requirements}
                                </Card.Subtitle>
                                <Card.Text>
                                  {calculateRemTime(reminder.reminderTime)}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </div>
                        </Tab>
                      );
                    })
                  : null}

                {isFetchServiceReminders
                  ? serviceReminders.map((reminder) => {
                      return (
                        <Tab
                          eventKey={`medicalservice/${reminder._id}`}
                          title={reminder.serivce}
                        >
                          <div className="buttons-in-showreminderr">
                            <span>جهت حذف یادآور بر روی </span>
                            <button
                              btnheight="btn-h40"
                              btnsize="btn-50"
                              id={reminder._id}
                              className="btn-delete"
                              type="submit"
                              onClick={removeMedicalServiceReminder}
                            >
                              حذف
                            </button>
                            <span>و ویرایش آن بر روی</span>
                            <button
                              btnheight="btn-h40"
                              btnsize="btn-50"
                              className="btn-edit"
                              type="submit"
                              onClick={() => {
                                setModalStates((prevStates) => ({
                                  ...prevStates,
                                  [reminder._id]: true,
                                }));
                              }}
                            >
                              ویرایش
                            </button>
                            <span>کلیک کنید.</span>
                          </div>
                          <Modalshow
                            show={!!modalStates[reminder._id]}
                            onHide={() => {
                              setModalStates((prevStates) => ({
                                ...prevStates,
                                [reminder._id]: false,
                              }));
                            }}
                            modalTitle="ویرایش یادآور"
                          >
                            <Form
                              noValidate
                              validated={validated}
                              method="POST"
                              onSubmit={editMedicalServiceReminderSubmit}
                              className="editrem-form"
                              id={reminder._id}
                            >
                              <p className="name-top">{reminder.serivce}</p>

                              <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                  تاریخ
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <DatePicker
                                    onChange={convertServicedate}
                                    calendar={persian}
                                    locale={persian_fa}
                                  ></DatePicker>
                                </Col>
                              </Form.Group>

                              <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                  زمان
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <Form.Control
                                    type="time"
                                    name="servicetime"
                                    onChange={(event) => {
                                      setServiceTime(event.target.value);
                                    }}
                                  />
                                </Col>
                              </Form.Group>

                              <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                  توضیحات
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <Form.Control
                                    name="desc"
                                    type="text"
                                    onChange={(event) => {
                                      setMedicalServiceDesc(event.target.value);
                                    }}
                                    Value={reminder.desc}
                                  />
                                </Col>
                              </Form.Group>

                              <Form.Group as={Row} className="mb-4">
                                <Form.Label column sm="4">
                                  زمان مانده به نمایش اعلان
                                </Form.Label>
                                <Col sm="8" className="input-res">
                                  <Form.Control
                                    placeholder="5 (5 دقیقه مانده به زمان یادآور)"
                                    name="mintoremservice"
                                    type="text"
                                    onChange={(event) => {
                                      setMintoremservice(event.target.value);
                                    }}
                                    Value={reminder.mintonotif}
                                  />
                                </Col>
                              </Form.Group>

                              <Row className="done-btn">
                                <Button
                                  btnheight="btn-h40"
                                  btnsize="btn-100"
                                  btnstyle="btn-pink"
                                >
                                  ثبت
                                </Button>
                              </Row>
                            </Form>
                          </Modalshow>

                          <div className="each-rem">
                            <Card>
                              <Card.Body>
                                <Card.Title>{reminder.serivce}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                  توضیحات :{" "}
                                  {reminder.desc != null
                                    ? reminder.desc
                                    : "ندارد"}
                                </Card.Subtitle>
                                <Card.Text>
                                  {calculateRemTime(reminder.reminderTime)}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </div>
                        </Tab>
                      );
                    })
                  : null}
              </Tabs>
            </div>
          </div>
        </Row>
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
          <Toast.Body>یادآور جدید با موفقیت اضافه شد✔</Toast.Body>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  );
};

export default Callender;
