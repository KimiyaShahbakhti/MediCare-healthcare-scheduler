import React, { useState, useRef, useEffect } from "react";
import "./note.css";
import Modalshow from "../UI/modal/modal";
import Topdash from "../topindash/topdash";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ListGroup from "react-bootstrap/ListGroup";

const Notes = () => {
  const [showToast, setShowToast] = useState(false);

  const [text, setText] = useState(" ");
  const [problem, setProblem] = useState(" ");

  const [validated, setValidated] = useState(false);
  const [isFetch, setIsFetch] = useState(false);
  const [isFetchProblems, setIsFetchProblems] = useState(false);
  const [notes, setNotes] = useState(null);
  const [problems, setProblems] = useState(null);

  //modal
  const [modalStates, setModalStates] = useState({});

  async function addMedicalnoteSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();

      fetch("http://localhost:8080/postAddMedicalnoteForm", {
        method: "POST",
        // We convert the React state to JSON and send it as the POST body
        headers: {
          Accept: "applicaion/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem: problem,
          text: text,
        }),
      }).then(function (response) {
        return response.json();
      });
      window.scrollTo(0, 0);
      setShowToast(true);
    }
    setValidated(true);
  }
  async function removeNote(event) {
    const noteID = event.target.id;
    fetch(`http://localhost:8080/postRemoveNoteForm/${noteID}`, {
      method: "POST",
    }).then(function (response) {
      return response.json();
    });
  }
  async function editNoteSubmit(event) {
    event.preventDefault();

    setModalStates((prevStates) => ({
      ...prevStates,
      [event.target.id]: false,
    }));

    let formData = new FormData(event.currentTarget);
    let text = formData.get("text");

    const form = event.currentTarget;

    fetch(`http://localhost:8080/editMedicalNote/${form.id}`, {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        Accept: "applicaion/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    }).then(function (response) {
      return response.json();
    });
  }

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
    if (!authadmin && !authuser) {
      navigate("/signup", { replace: true });
    }

    setInterval(function () {
      fetch(`http://localhost:8080/showNotes`)
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          setIsFetch(true);
          setNotes(responseJson.data);
        });
    }, 100);

    fetch(`http://localhost:8080/showProblems`)
      .then(function (response) {
        return response.json();
      })
      .then((responseJson) => {
        setIsFetchProblems(true);
        setProblems(responseJson.data);
      });
  }, []);

  const [problemInput, setProblemInput] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [filteredProblems, setFilteredProblems] = useState([]);

  const handleProblemInput = (event) => {
    setProblemInput(event.target.value);
    setProblem(event.target.value);
    setSelectedProblem(event.target.value);
  };
  const handleSelectProblem = (problem) => {
    setProblem(problem.problem);
    setSelectedProblem(problem.problem);
    setProblemInput("");
  };

  useEffect(() => {
    if (problemInput.trim() === "") {
      setFilteredProblems([]);
      return;
    }
    const filtered = problems.filter((problem) =>
      problem.problem.includes(problemInput)
    );
    setFilteredProblems(filtered);
  }, [problemInput, problems]);

  return (
    <React.Fragment>
      <Topdash icon="fas fa-pen">یادداشت ها</Topdash>

      <div className="note">
        <div className="show-note">
          <Table responsive bordered className="note-table">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>دسته بندی</th>
                <th>متن یادداشت</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isFetch
                ? notes.map((note,index) => {
                    return (
                      <tr key={note._id}>
                        <th>{index+1}</th>
                        <td>{note.problem}</td>
                        <td>{note.text}</td>

                        <td>
                          <Button
                            id={note._id}
                            className="btn-delete"
                            type="submit"
                            onClick={removeNote}
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
                                [note._id]: true,
                              }));
                            }}
                          >
                            ویرایش
                          </Button>
                          <Modalshow
                            show={!!modalStates[note._id]}
                            onHide={() => {
                              setModalStates((prevStates) => ({
                                ...prevStates,
                                [note._id]: false,
                              }));
                            }}
                            modalTitle="ویرایش یادداشت"
                          >
                            <Form
                              id={note._id}
                              noValidate
                              validated={validated}
                              onSubmit={editNoteSubmit}
                              method="POST"
                            >
                              <p className="name-top mt-2">{note.problem}</p>

                              <Form.Group controlId="validationCustom02">
                                <Form.Label>متن یادداشت</Form.Label>
                                <Form.Control
                                  required
                                  as="textarea"
                                  rows={3}
                                  defaultValue={note.text}
                                  placeholder="متن یادداشت"
                                  name="text"
                                />
                              </Form.Group>

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
                <th>دسته بندی</th>
                <th>متن یادداشت</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
          </Table>
        </div>

        <div className="note-side">
          <Form
            noValidate
            validated={validated}
            onSubmit={addMedicalnoteSubmit}
            method="POST"
          >
            <p className="add-to-notes mb-3">
              از این قسمت می‌توانید یادداشت‌هایی را در حوزه های مختلف پزشکی به
              برنامه اضافه کنید.
            </p>

            <Form.Group as={Col} md="4" controlId="validationCustom02">
              <Form.Label>دسته‌بندی پزشکی</Form.Label>
              <Form.Control
                type="text"
                placeholder="میگرن"
                onChange={handleProblemInput}
                value={selectedProblem}
                contentEditable
              />
              {filteredProblems.length > 0 && (
                <ListGroup className="mt-2 listgroup-selects">
                  {filteredProblems.map((problem) => (
                    <ListGroup.Item
                      id={problem._id}
                      key={problem._id}
                      onClick={() => handleSelectProblem(problem)}
                    >
                      {problem.problem}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              <Form.Control.Feedback type="invalid">
                لطفا نوع یادداشت را مشخص کنید
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="validationCustom02">
              <Form.Label>متن یادداشت</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={3}
                placeholder="بیماران مبتلا به سردردهای میگرنی نباید در معرض هوای آلوده قرار بگیرند."
                onChange={(event) => {
                  setText(event.target.value);
                }}
              />
            </Form.Group>
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
          <Toast.Body>یادداشت جدید با موفقیت اضافه شد✔</Toast.Body>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  );
};

export default Notes;
