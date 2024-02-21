import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./post.css";
import Topdash from "../../topindash/topdash";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modalshow from "../../UI/modal/modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import jwt_decode from "jwt-decode";
import { Spinner } from "react-bootstrap";
import * as shamsi from "shamsi-date-converter";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ListGroup from "react-bootstrap/ListGroup";

const Post = () => {
  const [showToast, setShowToast] = useState(false);

  const [title, setTitle] = useState(" ");
  const [problem, setProblem] = useState(" ");
  const [postText, setPostText] = useState(" ");

  const [isFetch, setIsFetch] = useState(false);
  const [posts, setPosts] = useState(null);

  const [isFetchProblems, setIsFetchProblems] = useState(false);
  const [problems, setProblems] = useState(null);

  const [validated, setValidated] = useState(false);

  const [modalStates, setModalStates] = useState({});

  async function addPostSubmit(e) {
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();

      fetch("http://localhost:8080/postAddPostForm", {
        method: "POST",
        headers: {
          Accept: "applicaion/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          text: postText,
          problem: problem,
        }),
      }).then(function (response) {
        return response.json();
      });

      setShowToast(true);
    }
    setValidated(true);
  }
  async function removePost(event) {
    const postID = event.target.parentElement.id;
    fetch(`http://localhost:8080/postRemovePostForm/${postID}`, {
      method: "POST",
    }).then(function (response) {
      console.log(response);
      return response.json();
    });
  }
  async function editPostSubmit(event) {
    event.preventDefault();

    setModalStates((prevStates) => ({
      ...prevStates,
      [event.target.id]: false,
    }));

    let formData = new FormData(event.currentTarget);
    let title = formData.get("title");
    let problem = formData.get("problem");
    let posttext = formData.get("posttext");

    const form = event.currentTarget;

    fetch(`http://localhost:8080/editPost/${form.id}`, {
      method: "POST",
      // We convert the React state to JSON and send it as the POST body
      headers: {
        Accept: "applicaion/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        problem: problem,
        text: posttext,
      }),
    }).then(function (response) {
      return response.json();
    });
  }

  function toShamsi(y, m, d) {
    return shamsi
      .gregorianToJalali(parseInt(y), parseInt(m), parseInt(d))
      .join("/");
  }
  function like(e, alreadyliked) {
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    const userID = decodedToken.userInfo._id;
    let liked;
    if (alreadyliked == "yes") {
      liked = true;
    } else {
      liked = false;
    }
    liked = !liked;
    const postInfo =
      e.target.parentElement.parentElement.parentElement.id +
      `-${liked}` +
      "-like" +
      `-${userID}`;

    fetch(`http://localhost:8080/postLikeEdit/${postInfo}`, { method: "POST" });

    if (liked) e.target.style.color = "#84e18a";
    if (liked && e.target.classList.value.includes("alreadyliked"))
      e.target.style.color = "gray";
    if (!liked) e.target.style.color = "gray";

    document.querySelector(".dislikebtn").style.color = "gray";
  }
  function dislike(e, alreadydisliked) {
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    const userID = decodedToken.userInfo._id;

    let disliked;
    if (alreadydisliked == "yes") {
      disliked = true;
    } else {
      disliked = false;
    }
    disliked = !disliked;

    const postInfo =
      e.target.parentElement.parentElement.parentElement.id +
      `-${disliked}` +
      "-dislike" +
      `-${userID}`;

    fetch(`http://localhost:8080/postLikeEdit/${postInfo}`, { method: "POST" });

    if (disliked) e.target.style.color = "#ff5858";
    if (disliked && e.target.classList.value.includes("alreadydisliked"))
      e.target.style.color = "gray";
    if (!disliked) e.target.style.color = "gray";

    document.querySelector(".likebtn").style.color = "gray";
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
      fetch(`http://localhost:8080/showPosts`)
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          setIsFetch(true);
          setPosts(responseJson.data);
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
      <Topdash icon="fas fa-th-large">مطالب و محتوای پزشکی</Topdash>
      <div className="posts">
        <div className="show-posts">
          {isFetch ? (
            posts.map((post) => {
              return (
                <Card key={post._id} id={post._id}>
                  <Card.Body>
                    <Card.Title>
                      {post.title}
                      <Button
                        className="trashbtn"
                        id={post._id}
                        onClick={removePost}
                      >
                        <i className="fas fa-trash-alt trash"></i>
                      </Button>
                      <Button
                        className="editbtn"
                        onClick={() => {
                          setModalStates((prevStates) => ({
                            ...prevStates,
                            [post._id]: true,
                          }));
                        }}
                      >
                        <i className="fas fa-pen pen"></i>
                      </Button>
                      <Modalshow
                        show={!!modalStates[post._id]}
                        onHide={() => {
                          setModalStates((prevStates) => ({
                            ...prevStates,
                            [post._id]: false,
                          }));
                        }}
                        modalTitle="ویرایش محتوا"
                      >
                        <Form
                          id={post._id}
                          method="POST"
                          onSubmit={editPostSubmit}
                        >
                          <Row>
                            <Form.Group
                              as={Col}
                              md="6"
                              controlId="validationCustom01"
                            >
                              <Form.Label>عنوان محتوای پزشکی</Form.Label>
                              <Form.Control
                                defaultValue={post.title}
                                name="title"
                                required
                                type="text"
                                placeholder="عنوان"
                              />
                              <Form.Control.Feedback type="invalid">
                                لطفا عنوان را وارد نمایید.
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group
                              as={Col}
                              md="6"
                              controlId="validationCustom02"
                            >
                              <Form.Label>مشکلات پزشکی</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="میگرن"
                                name="problem"
                                onChange={handleProblemInput}
                                value={selectedProblem}
                                defaultValue={post.problem}
                                contentEditable
                              />
                              {filteredProblems.length > 0 && (
                                <ListGroup className="mt-2 listgroup-selects">
                                  {filteredProblems.map((problem) => (
                                    <ListGroup.Item
                                      id={problem._id}
                                      key={problem._id}
                                      onClick={() =>
                                        handleSelectProblem(problem)
                                      }
                                    >
                                      {problem.problem}
                                    </ListGroup.Item>
                                  ))}
                                </ListGroup>
                              )}
                            </Form.Group>

                            <Form.Group md="4" controlId="validationCustom02">
                              <Form.Label>متن محتوای پزشکی</Form.Label>
                              <Form.Control
                                required
                                as="textarea"
                                rows={4}
                                name="posttext"
                                placeholder="متن محتوا . . ."
                                defaultValue={post.text}
                              />
                              <Form.Control.Feedback type="invalid">
                                لطفا متن محتوای پزشکی را وارد نمایید.
                              </Form.Control.Feedback>
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
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {post.problem}
                    </Card.Subtitle>
                    <Card.Text style={{ whiteSpace: "pre-wrap" }}>
                      {post.text}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <p>
                      تاریخ بارگذاری :
                      {toShamsi(
                        post.createdAt.substring(0, 4),
                        post.createdAt.substring(5, 7),
                        post.createdAt.substring(8, 10)
                      )}
                    </p>
                    <p className="like">
                      <span>{post.likeCount}</span>
                      {post.likedBy.includes(
                        jwt_decode(localStorage.getItem("token")).userInfo._id
                      ) ? (
                        <i
                          className="fas fa-thumbs-up likebtn alreadyliked"
                          onClick={(event) => {
                            like(event, "yes");
                          }}
                        ></i>
                      ) : (
                        <i
                          className="fas fa-thumbs-up likebtn"
                          onClick={(event) => {
                            like(event, "no");
                          }}
                        ></i>
                      )}
                      <span>{post.dislikeCount}</span>
                      {post.dislikedBy.includes(
                        jwt_decode(localStorage.getItem("token")).userInfo._id
                      ) ? (
                        <i
                          className="fas fa-thumbs-down dislikebtn alreadydisliked"
                          onClick={(event) => {
                            dislike(event, "yes");
                          }}
                        ></i>
                      ) : (
                        <i
                          className="fas fa-thumbs-down dislikebtn"
                          onClick={dislike}
                        ></i>
                      )}
                    </p>
                  </Card.Footer>
                </Card>
              );
            })
          ) : (
            <Spinner animation="grow" />
          )}
        </div>
        <div className="form-post">
          <Form
            noValidate
            validated={validated}
            onSubmit={addPostSubmit}
            method="POST"
          >
            <Row>
              <Form.Group as={Col} md="6" controlId="validationCustom01">
                <Form.Label>عنوان محتوای پزشکی</Form.Label>
                <Form.Control
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                  name="title"
                  required
                  type="text"
                  placeholder="عنوان"
                />
                <Form.Control.Feedback type="invalid">
                  لطفا عنوان را وارد نمایید.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="validationCustom02">
                <Form.Label>مشکلات پزشکی</Form.Label>
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
              </Form.Group>

              <Form.Group md="4" controlId="validationCustom02">
                <Form.Label>متن محتوای پزشکی</Form.Label>
                <Form.Control
                  required
                  as="textarea"
                  rows={4}
                  placeholder="متن محتوا . . ."
                  onChange={(event) => {
                    setPostText(event.target.value);
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  لطفا متن محتوای پزشکی را وارد نمایید.
                </Form.Control.Feedback>
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
          <Toast.Body>محتوای جدید با موفقیت اضافه شد✔</Toast.Body>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  );
};

export default Post;
