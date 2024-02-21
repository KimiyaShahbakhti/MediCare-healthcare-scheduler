const express = require("express");
const app = express();
const func = require("./../../dbFunctions");
const cron = require("node-cron");

// Medicine Reminder
app.get("/showMedicineReminder/:id", async (req, res) => {
  const find_medrem_personal = func.find_medrem_personal;
  try {
    let medReminders = await find_medrem_personal({
      user: req.params.id,
    }).populate("medicine");
    return res.status(200).json({
      success: true,
      count: medReminders.length,
      data: medReminders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/postRemoveReminderForm/:id", async (req, res) => {
  const delete_med_reminder_personal = func.delete_med_reminder_personal;
  try {
    let query = { _id: req.params.id };
    await delete_med_reminder_personal(query);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/editMedReminderPersonal/:id", async (req, res) => {
  const remID = req.params.id;
  const {
    dose,
    startDate,
    endDate,
    schedualeType,
    reminderTimes,
    startTime,
    specificHours,
    repeatHours,
    repeatDate,
    mintonotif,
  } = req.body;

  const findOneAndUpdate_med_reminder_personal =
    func.findOneAndUpdate_med_reminder_personal;

  if (schedualeType != null) {
    await findOneAndUpdate_med_reminder_personal(
      { _id: remID },
      {
        $set: {
          dose: dose,
          startDate: startDate,
          endDate: endDate,
          schedualeType: schedualeType,
          reminderTimes: reminderTimes,
          startTime: startTime,
          specificHours: specificHours,
          repeatHours: repeatHours,
          repeatDate: repeatDate,
          mintonotif: mintonotif,
        },
      }
    );
  }
  else if(schedualeType == null){
    await findOneAndUpdate_med_reminder_personal(
      { _id: remID },
      {
        $set: {
          dose: dose,
          mintonotif: mintonotif,
        },
      }
    );
  }
});

app.post("/postAddMedicineRemPersonal", async (req, res) => {
  const new_medrem_personal = func.new_medrem_personal;
  const {
    user,
    medicine,
    dose,
    startDate,
    endDate,
    schedualeType,
    reminderTimes,
    startTime,
    specificHours,
    repeatHours,
    repeatDate,
    mintonotif,
  } = req.body;

  await new_medrem_personal({
    user: user,
    medicine: medicine,
    dose: dose,
    startDate: startDate,
    endDate: endDate,
    schedualeType: schedualeType,
    reminderTimes: reminderTimes,
    startTime: startTime,
    specificHours: specificHours,
    repeatHours: repeatHours,
    repeatDate: repeatDate,
    mintonotif: mintonotif,
  }).save();
});

// Appointment Reminder
app.post("/postAddAppointmentRemPersonal", async (req, res) => {
  const new_aporem_personal = func.new_aporem_personal;
  const { user, drname, requirements, reason, reminderTime, mintoremapo } =
    req.body;

  await new_aporem_personal({
    user: user,
    doctorName: drname,
    requirements: requirements,
    reason: reason,
    reminderTime: reminderTime,
    mintonotif: mintoremapo,
  }).save();
});

app.get("/showAppointmentReminder/:id", async (req, res) => {
  const find_aporem_personal = func.find_aporem_personal;
  try {
    let apoReminders = await find_aporem_personal({
      user: req.params.id,
    });
    return res.status(200).json({
      success: true,
      count: apoReminders.length,
      data: apoReminders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/postRemoveApoReminderForm/:id", async (req, res) => {
  const delete_apo_reminder_personal = func.delete_apo_reminder_personal;
  try {
    let query = { _id: req.params.id };
    await delete_apo_reminder_personal(query);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/editApoReminderPersonal/:id", async (req, res) => {
  const remID = req.params.id;
  const { drname, requirements, reason, reminderTime, mintoremapo } = req.body;

  const findOneAndUpdate_apo_reminder_personal =
    func.findOneAndUpdate_apo_reminder_personal;

  await findOneAndUpdate_apo_reminder_personal(
    { _id: remID },
    {
      $set: {
        doctorName: drname,
        requirements: requirements,
        reason: reason,
        reminderTime: reminderTime,
        mintonotif: mintoremapo,
      },
    }
  );
});

app.post("/postRemoveApoReminderAfterMedForm/:id", async (req, res) => {
  const delete_med_reminder_personal = func.delete_med_reminder_personal;
  try {
    let query = { medicine: req.params.id };
    await delete_med_reminder_personal(query);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

//Medical Service Reminders
app.post("/postAddMedicalServiceRemPersonal", async (req, res) => {
  const new_servicerem_personal = func.new_servicerem_personal;
  const { user, serviceName, desc, reminderTime, mintoremservice } = req.body;
  console.log(req.body);
  await new_servicerem_personal({
    user: user,
    serivce: serviceName,
    desc: desc,
    reminderTime: reminderTime,
    reminderTime: reminderTime,
    mintonotif: mintoremservice,
  }).save();
});

app.get("/showMedicalServiceReminder/:id", async (req, res) => {
  const find_servicerem_personal = func.find_servicerem_personal;
  try {
    let serviceReminders = await find_servicerem_personal({
      user: req.params.id,
    });
    return res.status(200).json({
      success: true,
      count: serviceReminders.length,
      data: serviceReminders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/editMedicalServiceReminderPersonal/:id", async (req, res) => {
  const remID = req.params.id;
  const { desc, reminderTime, mintoremservice } = req.body;

  const findOneAndUpdate_service_reminder_personal =
    func.findOneAndUpdate_service_reminder_personal;

  await findOneAndUpdate_service_reminder_personal(
    { _id: remID },
    {
      $set: {
        desc: desc,
        reminderTime: reminderTime,
        mintonotif: mintoremservice,
      },
    }
  );
});

app.post("/postRemoveMedicalServiceReminderForm/:id", async (req, res) => {
  const delete_srevice_reminder_personal = func.delete_srevice_reminder_personal;
  try {
    let query = { _id: req.params.id };
    await delete_srevice_reminder_personal(query);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});



module.exports = app;
