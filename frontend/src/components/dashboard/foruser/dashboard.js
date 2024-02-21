import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Modalshow from "../../UI/modal/modal";
import Topdash from "../../topindash/topdash";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import jwt_decode from "jwt-decode";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const Dashboard = () => {
  const [showToast, setShowToast] = useState(false);

  const [problemBox, setproblemBox] = useState(false);
  const [modalStates, setModalStates] = useState({});

  //selectedBoxnames contains all med selected in add box form
  const [selectedBoxnames, setSelectedBoxnames] = useState([]);
  const [selectedNote, setSelectedNote] = useState([]);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [currentNote, setCurrentNote] = useState("");

  const [validated, setValidated] = useState(false);

  const [isFetchMedicines, setIsFetchMedicines] = useState(false);
  const [medicines, setMedicines] = useState(null);


  const [problems, setProblems] = useState(null);

  const [isFetchNote, setIsFetchNote] = useState(false);
  const [notes, setNotes] = useState([]);

  const [isFetchBoxes, setIsFetchBoxes] = useState(false);
  const [boxes, setBoxes] = useState([]);


  const [boxnameInput, setBoxnameInput] = useState("");
  const [selectedBoxname, setSelectedBoxname] = useState(null);
  const [filteredBoxname, setFilteredMedicines] = useState([]);

  async function addProblemBoxSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();

      const token = localStorage.getItem("token");
      const decodedToken = jwt_decode(token);
      const userID = decodedToken.userInfo._id;

      fetch("http://localhost:8080/postAddBoxFormPersonal", {
        method: "POST",
        headers: {
          Accept: "applicaion/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userID,
          boxName: title,
          desc: subtitle,
          medicines: selectedBoxnames,
          notes: selectedNote,
        }),
      }).then(function (response) {
        return response.json();
      });

      setproblemBox(false);
      setShowToast(true);
    }
    setValidated(true);
  }
  async function deleteProblembox(event) {
    const boxID = event.target.parentElement.id;
    console.log(boxID);
    fetch(`http://localhost:8080/postRemoveBoxPresonalForm/${boxID}`, {
      method: "POST",
    }).then(function (response) {
      return response.json();
    });
  }
  async function deleteMedicine(event) {
    const medID = event.target.parentElement.id;
    const boxID =
      event.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.parentElement.parentElement.id;
    fetch(
      `http://localhost:8080/postRemoveMedicineFromboxPresonal/${
        medID + `-` + boxID
      }`,
      {
        method: "POST",
      }
    ).then(function (response) {
      return response.json();
    });
  }
  async function deleteNote(event) {
    const noteID = event.target.parentElement.id;
    const boxID =
      event.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.parentElement.parentElement.id;
    console.log(boxID);
    fetch(
      `http://localhost:8080/postRemoveNoteFromboxPresonal/${
        noteID + `-` + boxID
      }`,
      {
        method: "POST",
      }
    ).then(function (response) {
      return response.json();
    });
  }
  async function editProblemBoxSubmit(event) {
    event.preventDefault();
    setModalStates((prevStates) => ({
      ...prevStates,
      [event.target.id]: false,
    }));

    let formData = new FormData(event.currentTarget);
    let boxsubtitle = formData.get("boxsubtitle");
    let boxName = formData.get("boxname");
    const form = event.currentTarget;

    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    const userID = decodedToken.userInfo._id;

    fetch(`http://localhost:8080/editBoxPersonal/${form.id}`, {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        Accept: "applicaion/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userID,
        boxName: boxName,
        desc: boxsubtitle,
        medicines: selectedBoxnames,
        notes: currentNote,
      }),
    }).then(function (response) {
      return response.json();
    });

    setSelectedBoxnames([]);
    setCurrentNote([]);
  }

  function handleMedicineSelect(event) {
    const { value } = event.target;
    const medicineId = value;
    if (selectedBoxnames.includes(medicineId)) {
      setSelectedBoxnames(selectedBoxnames.filter((id) => id !== medicineId));
    } else {
      setSelectedBoxnames([...selectedBoxnames, medicineId]);
    }
  }
  function handleNotesSelect(event) {
    const { value } = event.target;
    const noteId = value;
    if (selectedNote.includes(noteId)) {
      setSelectedNote(selectedNote.filter((id) => id !== noteId));
    } else {
      setSelectedNote([...selectedNote, noteId]);
    }
  }
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      addNoteSubmit(event);
      event.target.value = "";
    }
  }
  function addNoteSubmit(event) {
    event.preventDefault();
    if (currentNote.trim() !== "") {
      setSelectedNote([...selectedNote, currentNote]);
      setCurrentNote("");
    }
  }
  function fetchTitle(problem) {
    fetch(`http://localhost:8080/showSelectedProblem/${problem}`)
      .then(function (response) {
        return response.json();
      })
      .then((responseJson) => {
        setTitle(responseJson.data._id);

        fetch(
          `http://localhost:8080/showNoteWithSpecificProblem/${responseJson.data._id}`
        )
          .then(function (response) {
            return response.json();
          })
          .then((responseJson) => {
            setIsFetchNote(true);
            setNotes(responseJson.data);
          });
      });
  }
  const handleBoxnameInput = (event) => {
    setBoxnameInput(event.target.value);
    setTitle(event.target.value);
    setSelectedBoxname(event.target.value);
    setIsFetchNote(false);
  };
  const handleSelectBoxname = (problem) => {
    setTitle(problem.problem);
    setSelectedBoxname(problem.problem);
    setBoxnameInput("");

    let problemID = problem._id;
    fetch(`http://localhost:8080/showNoteWithSpecificProblem/${problemID}`)
      .then(function (response) {
        return response.json();
      })
      .then((responseJson) => {
        console.log(responseJson);
        setIsFetchNote(true);
        setNotes(responseJson.data);
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

    const decodedToken = jwt_decode(token);
    const userID = decodedToken.userInfo._id;
    setInterval(function () {
      fetch(`http://localhost:8080/showBoxes/${userID}`)
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          setIsFetchBoxes(true);
          setBoxes(responseJson.data);
        });
    }, 100);
    fetch(`http://localhost:8080/showMedicines/${userID}`)
      .then(function (response) {
        return response.json();
      })
      .then((responseJson) => {
        setIsFetchMedicines(true);
        setMedicines(responseJson.data[0].medicines);
      });
    fetch(`http://localhost:8080/showProblems`)
      .then(function (response) {
        return response.json();
      })
      .then((responseJson) => {
        setProblems(responseJson.data);
      });
  }, []);

  useEffect(() => {
    if (boxnameInput.trim() === "") {
      setFilteredMedicines([]);
      return;
    }
    const filtered = problems.filter((problem) =>
      problem.problem.includes(boxnameInput)
    );
    setFilteredMedicines(filtered);
  }, [boxnameInput, problems]);

  return (
    <React.Fragment>
      <Topdash icon="fas fa-home-user">خانه</Topdash>
      <div className="problem">
        <div className="row">
          {isFetchBoxes
            ? boxes.map((box) => {
                let medArray = [];
                box.medicines.map((med) => {
                  medArray.push(med._id);
                });
                return (
                  <div key={box._id} className="box-res col-6 mt-2">
                    <Card className="problem-box" key={box._id}>
                      <Card.Body>
                        <Card.Title>
                          <Button
                            id={box._id}
                            className="trashbtn"
                            onClick={deleteProblembox}
                          >
                            <i className="fas fa-trash-alt trash"></i>
                          </Button>
                          <Button
                            className="editbtn"
                            onClick={() => {
                              fetchTitle(box.boxName);
                              setModalStates((prevStates) => ({
                                ...prevStates,
                                [box._id]: true,
                              }));
                            }}
                          >
                            <i className="fas fa-pen pen"></i>
                          </Button>
                          <Modalshow
                            show={!!modalStates[box._id]}
                            onHide={() =>
                              setModalStates((prevStates) => ({
                                ...prevStates,
                                [box._id]: false,
                              }))
                            }
                            modalTitle="ویرایش صندوق سلامت"
                          >
                            <Form
                              noValidate
                              validated={validated}
                              method="POST"
                              id={box._id}
                              onSubmit={editProblemBoxSubmit}
                            >
                              <Row>
                                <p className="name-top mt-2">{box.boxName}</p>

                                <Form.Control
                                  name="boxname"
                                  type="text"
                                  Value={box.boxName}
                                  style={{ display: "none" }}
                                />

                                <Form.Group
                                  as={Col}
                                  md="6"
                                  controlId="validationCustom01"
                                >
                                  <Form.Label>توضیحات</Form.Label>
                                  <Form.Control
                                    name="boxsubtitle"
                                    type="text"
                                    Value={box.desc}
                                    onChange={(event) => {
                                      setSubtitle(event.target.value);
                                    }}
                                  />
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="6"
                                  controlId="formHorizontalSubtitle"
                                >
                                  <Form.Label column sm={2}>
                                    داروها
                                  </Form.Label>
                                  <Col sm={10}>
                                    <ListGroup variant="flush">
                                      {box.medicines.map((medicine) => {
                                        return (
                                          <ListGroup.Item key={medicine._id}>
                                            {medicine.medName}
                                            <Button
                                              id={medicine._id}
                                              onClick={() => {
                                                // medArray.remove(medicine._id);
                                                medArray.filter(
                                                  (item) =>
                                                    item !== medicine._id
                                                );
                                              }}
                                              className="trashbtnmodal"
                                            >
                                              <i
                                                className="fas fa-trash-alt trash"
                                                onClick={deleteMedicine}
                                              ></i>
                                            </Button>
                                          </ListGroup.Item>
                                        );
                                      })}
                                    </ListGroup>
                                  </Col>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="6"
                                  controlId="formHorizontalSubtitle"
                                >
                                  <Form.Label column sm={2}>
                                    یادداشت‌ها
                                  </Form.Label>
                                  <Col sm={10}>
                                    <ListGroup variant="flush">
                                      {box.medicalnotes.map((note) => {
                                        return (
                                          <ListGroup.Item key={note._id}>
                                            {note.text}
                                            <Button
                                              id={note._id}
                                              onClick={deleteNote}
                                              className="trashbtnmodal"
                                            >
                                              <i className="fas fa-trash-alt trash"></i>
                                            </Button>
                                          </ListGroup.Item>
                                        );
                                      })}
                                      {box.manualnotes.map((note) => {
                                        return (
                                          <ListGroup.Item key={note._id}>
                                            {note.note}
                                            <Button
                                              id={note._id}
                                              onClick={deleteNote}
                                              className="trashbtnmodal"
                                            >
                                              <i className="fas fa-trash-alt trash"></i>
                                            </Button>
                                          </ListGroup.Item>
                                        );
                                      })}
                                    </ListGroup>
                                  </Col>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="12"
                                  controlId="validationCustom01"
                                >
                                  <Form.Label>یادداشت جدید</Form.Label>

                                  <Form onSubmit={addNoteSubmit}>
                                    <Form.Control
                                      name="note"
                                      type="text"
                                      onChange={(event) => {
                                        setCurrentNote(event.target.value);
                                      }}
                                    />
                                  </Form>
                                </Form.Group>

                                <Form.Group
                                  as={Col}
                                  md="12"
                                  controlId="validationCustom02"
                                >
                                  <Form.Label>دارو جدید</Form.Label>
                                  <div className="medicines-check">
                                    {isFetchMedicines
                                      ? medicines.map((medicine) =>
                                          medArray.includes(
                                            medicine._id
                                          ) ? null : (
                                            <Form.Check
                                              className="form-check-dash"
                                              key={medicine._id}
                                              type="checkbox"
                                              label={medicine.medName}
                                              value={medicine._id}
                                              onChange={handleMedicineSelect}
                                              defaultChecked={selectedBoxnames.includes(
                                                medicine._id
                                              )}
                                            />
                                          )
                                        )
                                      : null}
                                  </div>
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
                          {box.boxName}
                        </Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {box.desc}
                        </Card.Subtitle>
                        <div className="row">
                          <div className="note-boxin-res col-6">
                            <Card.Text className="notelist">
                              <div className="title-subbox title-notesub">
                                یادداشت ها
                              </div>
                              <ListGroup variant="flush">
                                {box.medicalnotes.map((note) => {
                                  return (
                                    <ListGroup.Item key={note._id}>
                                      {note.text}
                                    </ListGroup.Item>
                                  );
                                })}
                                {box.manualnotes.map((note) => {
                                  return (
                                    <ListGroup.Item key={note._id}>
                                      {note.note}
                                    </ListGroup.Item>
                                  );
                                })}
                              </ListGroup>
                            </Card.Text>
                          </div>
                          <div className="med-boxin-res col-6">
                            <Card.Text>
                              <div className="title-subbox">دارو ها</div>
                              <ListGroup variant="flush">
                                {box.medicines.map((medicine) => {
                                  return (
                                    <ListGroup.Item key={medicine._id}>
                                      {medicine.medName}
                                    </ListGroup.Item>
                                  );
                                })}
                              </ListGroup>
                            </Card.Text>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                );
              })
            : null}

          <div className="box-res col-6 mt-2">
            <Card className="addbox">
              <Card.Body>
                <Button
                  className="addbox-plus"
                  onClick={() => setproblemBox(true)}
                >
                  <i className="fas fa-plus"></i>
                </Button>
                <Modalshow
                  show={problemBox}
                  onHide={() => setproblemBox(false)}
                  modalTitle="ایجاد صندوق سلامت "
                >
                  <Form
                    noValidate
                    validated={validated}
                    method="POST"
                    onSubmit={addProblemBoxSubmit}
                  >
                    <Row>
                      <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustom01"
                      >
                        <Form.Label>عنوان</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="عنوان مشکل پزشکی"
                          onChange={handleBoxnameInput}
                          value={selectedBoxname}
                          contentEditable
                        />
                        {filteredBoxname.length > 0 && (
                          <ListGroup className="mt-2 listgroup-selects">
                            {filteredBoxname.map((problem) => (
                              <ListGroup.Item
                                id={problem._id}
                                key={problem._id}
                                onClick={() => handleSelectBoxname(problem)}
                              >
                                {problem.problem}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustom01"
                      >
                        <Form.Label>توضیحات</Form.Label>
                        <Form.Control
                          name="boxsubtitle"
                          type="text"
                          onChange={(event) => {
                            setSubtitle(event.target.value);
                          }}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="12"
                        controlId="validationCustom01"
                      >
                        <Form.Label>یادداشت جدید</Form.Label>

                        <Form onSubmit={addNoteSubmit}>
                          <Form.Control
                            name="note"
                            type="text"
                            onKeyDown={handleKeyDown}
                            placeholder="یادداشت های خود را در این قسمت اضافه کنید."
                            onChange={(event) => {
                              setCurrentNote(event.target.value);
                            }}
                          />
                        </Form>

                        {isFetchNote
                          ? notes.map((note) => {
                              return (
                                <Form.Check
                                  className="form-check-dash"
                                  key={note._id}
                                  type="checkbox"
                                  label={note.text}
                                  value={note._id}
                                  onChange={handleNotesSelect}
                                  checked={selectedNote.includes(note._id)}
                                />
                              );
                            })
                          : null}
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="12"
                        controlId="validationCustom02"
                      >
                        <Form.Label>دارو جدید</Form.Label>
                        <div className="medicines-check">
                          {isFetchMedicines
                            ? medicines.map((medicine) => (
                                <Form.Check
                                  className="form-check-dash"
                                  key={medicine._id}
                                  type="checkbox"
                                  label={medicine.medName}
                                  value={medicine._id}
                                  onChange={handleMedicineSelect}
                                  checked={selectedBoxnames.includes(
                                    medicine._id
                                  )}
                                />
                              ))
                            : null}
                        </div>
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
              </Card.Body>
            </Card>
          </div>
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
          <Toast.Body>صندوق سلامت جدید شما با موفقیت اضافه شد✔</Toast.Body>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  );
};

export default Dashboard;
