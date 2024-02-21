import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

function AlertComponent() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Oh you got an error!</Alert.Heading>
      </Alert>
    );
  }
  return <Button onClick={() => setShow(true)}>Show Alert</Button>;
}

export default AlertComponent;

user = {
  name: "Kimiya Shahbakhti",
  age: "23",
};
let options = {
  method: "POST",
  body: JSON.stringify(user),
};
fetch("url", options)
  .then((response) => response.json())
  .then((data) => console.log(data));

const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World! Welcome to Node.js");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Welcome to Medicare!");
});

app.listen(port, function (err) {
  console.log("Server is running at port 5000");
});




