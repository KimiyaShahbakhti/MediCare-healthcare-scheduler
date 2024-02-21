import React, { useEffect, useState, useContext } from "react";
import { JalaliDateTime } from "@webilix/jalali-date-time";
import jwt_decode from "jwt-decode";
import * as shamsi from "shamsi-date-converter";
import "./schedular.css";
import { SchedulerContext } from "../../context/schedular/schedularContext";

const Schedualr = () => {
  const [days, setDays] = useState("");
  const [now, setNow] = useState("");
  const [change, setChange] = useState(0);

  const [isFetchMedReminder, setIsFetchMedReminder] = useState(false);
  const [medReminder, setMedReminder] = useState(null);

  const [isFetchApoReminder, setIsFetchApoReminder] = useState(false);
  const [apoReminder, setApoReminder] = useState(null);

  const [isFetchMedicalServiceReminder, setIsFetchMedicalServiceReminder] = useState(false);
  const [medicalServiceReminder, setMedicalServiceReminder] = useState(null);

  const allevents = [];

  const jalali = JalaliDateTime();

  const { updateEvents } = useContext(SchedulerContext);

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

  function toShamsi(y, m, d) {
    return shamsi
      .gregorianToJalali(parseInt(y), parseInt(m), parseInt(d))
      .join("/");
  }

  function sendForTodayplan(date) {
    let reminders = [];
    allevents.forEach((event) => {
      if (event.dateMonth.length == 1) {
        event.dateMonth = `0` + event.dateMonth;
      }
      if (event.dateDay.length == 1) {
        event.dateDay = `0` + event.dateDay;
      }
      if (
        event.dateYear == date.split("-")[0] &&
        event.dateMonth == date.split("-")[1] &&
        event.dateDay == date.split("-")[2]
      ) {
        reminders.push(event);
      }
    });
    updateEvents(reminders);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    const userID = decodedToken.userInfo._id;

    setInterval(() => {
      fetch(`http://localhost:8080/showMedicineReminder/${userID}`)
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          setIsFetchMedReminder(true);
          setMedReminder(responseJson.data);
        });
    }, 100);

    setInterval(() => {
      fetch(`http://localhost:8080/showAppointmentReminder/${userID}`)
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          setIsFetchApoReminder(true);
          setApoReminder(responseJson.data);
        });
    }, 100);

    setInterval(() => {
      fetch(`http://localhost:8080/showMedicalServiceReminder/${userID}`)
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          setIsFetchMedicalServiceReminder(true);
          setMedicalServiceReminder(responseJson.data);
        });
    }, 100);

  }, []);

  useEffect(() => {
    const today = jalali.toObject(new Date());
    setNow(today);

    if (today.month + change < 13) {
      const result = jalali.calendar(
        `${today.year}-${today.month + change < 10 ? "0" : ""}${
          today.month + change
        }`
      );
      setDays(result);
    }
  }, [change]);

  if (isFetchMedReminder) {
    medReminder.forEach((reminder) => {
      reminder.reminderTimes.forEach((time) => {
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
          .split(",")[3];
        if (pmoram) {
          pmoram = "ب.ظ";
        } else if (!pmoram) {
          pmoram = "ق.ظ";
        }
        allevents.push({
          event_id: reminder._id,
          title:
            reminder.dose +
            ` ` +
            reminder.medicine.medName +
            ` ساعت ` +
            takeMedHour +
            pmoram,
          dateYear: date.split("/")[0],
          dateMonth: date.split("/")[1],
          dateDay: date.split("/")[2],
          time: takeMedHour + pmoram,
          plan: reminder.dose + ` ` + reminder.medicine.medName,
          remType: "مصرف دارو",
        });
      });
    });
  }
  if (isFetchApoReminder) {
    apoReminder.forEach((reminder) => {
      let date = toShamsi(
        reminder.reminderTime.substring(0, 4),
        reminder.reminderTime.substring(5, 7),
        reminder.reminderTime.substring(8, 10)
      );
      let dateForCalTime = new Date(reminder.reminderTime);
      let ApoHour = dateForCalTime
        .toLocaleString("en-US", options)
        .split(",")[3];
      if (ApoHour.length == 20) {
        ApoHour = ApoHour.substring(0, 5);
      }
      if (ApoHour.length == 21) {
        ApoHour = ApoHour.substring(0, 6);
      }
      let pmoram = dateForCalTime
        .toLocaleString("en-US", options)
        .split(",")[3]
        .includes("PM");
      if (pmoram) {
        pmoram = "ب.ظ";
      } else if (!pmoram) {
        pmoram = "ق.ظ";
      }

      allevents.push({
        event_id: reminder._id,
        title: reminder.doctorName + ` ساعت ` + ApoHour + pmoram,
        dateYear: date.split("/")[0],
        dateMonth: date.split("/")[1],
        dateDay: date.split("/")[2],
        time: ApoHour + pmoram,
        plan: reminder.doctorName + ` مراجعه به علت ` + reminder.reason,
        plan2: reminder.requirements,
        remType: "وقت‌های پزشکی",
      });
    });
  }
  if (isFetchMedicalServiceReminder) {
    medicalServiceReminder.forEach((reminder) => {
      let date = toShamsi(
        reminder.reminderTime.substring(0, 4),
        reminder.reminderTime.substring(5, 7),
        reminder.reminderTime.substring(8, 10)
      );
      let dateForCalTime = new Date(reminder.reminderTime);
      let serviceHour = dateForCalTime
        .toLocaleString("en-US", options)
        .split(",")[3];
      if (serviceHour.length == 20) {
        serviceHour = serviceHour.substring(0, 5);
      }
      if (serviceHour.length == 21) {
        serviceHour = serviceHour.substring(0, 6);
      }
      let pmoram = dateForCalTime
        .toLocaleString("en-US", options)
        .split(",")[3]
        .includes("PM");
      if (pmoram) {
        pmoram = "ب.ظ";
      } else if (!pmoram) {
        pmoram = "ق.ظ";
      }

      allevents.push({
        event_id: reminder._id,
        title: reminder.serivce + ` ساعت ` + serviceHour + pmoram,
        dateYear: date.split("/")[0],
        dateMonth: date.split("/")[1],
        dateDay: date.split("/")[2],
        time: serviceHour + pmoram,
        plan: reminder.serivce,
        plan2: reminder.desc,
        remType: "خدمات درمانی",
      });
    });
  }

  return (
    <div className="schedualr">
      <div className="schedularHeader">
        <div onClick={() => setChange(change - 1)}>
          <i className="far fa-arrow-alt-circle-right"></i>
        </div>
        <div className="schedularTitle">{days.title}</div>
        <div onClick={() => setChange(change + 1)}>
          <i className="far fa-arrow-alt-circle-left"></i>
        </div>
      </div>
      <div className="schedularWeek">
        <span>شنبه</span>
        <span>یکشنبه</span>
        <span>دوشنبه</span>
        <span>سه شنبه</span>
        <span>چهارشنبه</span>
        <span>پنج شنبه</span>
        <span>جمعه</span>
      </div>
      <div className="mainschedualr">
        {days &&
          days.weeks.map((day, index) => (
            <div className="daysRow" key={index}>
              {day.map((d, index) => (
                <div
                  className="day"
                  key={index}
                  onClick={() => {
                    sendForTodayplan(d.date);
                    document.querySelector(".date-show").innerHTML =
                      d.date.split("-")[0] +
                      "/" +
                      d.date.split("-")[1] +
                      "/" +
                      d.date.split("-")[2];
                  }}
                >
                  {now.day === d.day &&
                  `${now.year}-${now.month < 10 ? "0" : ""}${now.month}` ===
                    d.month ? (
                    <div className="today">{d.day + " - امروز"}</div>
                  ) : (
                    d.day
                  )}
                  {isFetchMedReminder
                    ? allevents.map((event) =>
                        `${event.dateYear}-${event.dateMonth < 10 ? "0" : ""}${
                          event.dateMonth
                        }-${event.dateDay < 10 ? "0" : ""}${event.dateDay}` ===
                        d.date ? (
                          <div
                            className={
                              event.remType == "مصرف دارو"
                                ? "eventmed"
                                : event.remType == "وقت‌های پزشکی"
                                ? "eventdr"
                                : "eventmedical"
                            }
                          >
                            {event.title}
                          </div>
                        ) : (
                          ""
                        )
                      )
                    : null}
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Schedualr;
