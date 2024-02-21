const express = require("express");
const app = express();
const func = require("../../dbFunctions");

module.exports = app.get("/notifications/:id", async (req, res) => {
  const currentTime = new Date();
  const userID = req.params.id;
  let finalReminders = [];

  const find_aporem_personal = func.find_aporem_personal;
  const find_medrem_personal = func.find_medrem_personal;
  const find_servicerem_personal = func.find_servicerem_personal;

  const medReminders = await find_medrem_personal({
    reminderTimes: {
      $elemMatch: {
        $gte: currentTime,
      },
    },
    user: userID,
  }).populate("medicine")

  const apoReminders = await find_aporem_personal({
    $and: [{ reminderTime: { $gte: currentTime } }, { user: userID }],
  });

  const serviceReminders = await find_servicerem_personal({
    $and: [{ reminderTime: { $gte: currentTime } }, { user: userID }],
  });

  currentTime.setHours(currentTime.getHours() + 1);
  currentTime.setMilliseconds(0);
  currentTime.setSeconds(0);

  medReminders.forEach((reminder) => {
    let minutesToReminder = reminder.mintonotif;
    reminder.reminderTimes.forEach((rem) => {
      if (rem >= currentTime && rem.getTime() >= currentTime.getTime()) {
        const timeDifference = rem.getTime() - currentTime.getTime();
        const isLessThanNMinutes =
          timeDifference < minutesToReminder * 60 * 1000;
        if (isLessThanNMinutes) {
          finalReminders.push({
            forDate: rem,
            forTime: rem.toString(),
            medicinename: reminder.medicine.medName,
            type: "med",
          });
        }
      }
    });
  });

  apoReminders.forEach((reminder) => {
    let minutesToReminder = reminder.mintonotif;
    let rem = reminder.reminderTime;
    if (rem >= currentTime && rem.getTime() >= currentTime.getTime()) {
      const timeDifference = rem.getTime() - currentTime.getTime();
      const isLessThanNMinutes = timeDifference < minutesToReminder * 60 * 1000;
      if (isLessThanNMinutes) {
        finalReminders.push({
          forDate: rem,
          forTime: rem.toString(),
          doctorname: reminder.doctorName,
          requirements: reminder.requirements,
          reason: reminder.reason,
          type: "apo",
        });
      }
    }
  });

  serviceReminders.forEach((reminder) => {
    let minutesToReminder = reminder.mintonotif;
    let rem = reminder.reminderTime;
    if (rem >= currentTime && rem.getTime() >= currentTime.getTime()) {
      const timeDifference = rem.getTime() - currentTime.getTime();
      const isLessThanNMinutes =
        timeDifference <= minutesToReminder * 60 * 1000;
      if (isLessThanNMinutes) {
        finalReminders.push({
          forDate: rem,
          forTime: rem.toString(),
          service: reminder.serivce,
          desc: reminder.desc,
          type: "service",
        });
      }
    }
  });

  console.log(finalReminders);

  return res.status(200).json({
    success: true,
    count: finalReminders.length,
    data: finalReminders,
  });
});
