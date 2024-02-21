const express = require("express");
const app = express();

// auth apis
const login_API = require("./auth/login_API");
const signup_API = require("./auth/signup_API");

// user apis
const medicineU_API = require("./users/medicine_APIs");
const boxU_API = require("./users/box_APIs");
const noteU_API = require("./users/note_APIs");
const reminderU_API = require('./users/Reminders_APIs')

// admin apis
const pharmacyA_API = require("./admin/pharmacy_APIs");
const postA_API = require("./admin/post_APIs");
const noteA_API = require("./admin/note_APIs");
const usersA_API = require("./admin/users_APIs");

//common apis
const common_API = require("./common_APIs");

const Notification_API = require('./users/Notification_API')

app.use(common_API);

app.use(login_API);
app.use(signup_API);

app.use(pharmacyA_API);
app.use(postA_API);
app.use(noteA_API);
app.use(usersA_API);

app.use(medicineU_API);
app.use(reminderU_API);
app.use(boxU_API);
app.use(noteU_API);
app.use(Notification_API)

module.exports = app;
