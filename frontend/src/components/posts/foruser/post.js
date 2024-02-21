import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./post.css";
import Topdash from "../../topindash/topdash";
import Card from "react-bootstrap/Card";
import jwt_decode from "jwt-decode";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import * as shamsi from "shamsi-date-converter";
import { Spinner } from "react-bootstrap";
const notfound = require("../../../assets/img/notfound.gif");

const Post = () => {
  const [isFetchBoxes, setIsFetchBoxes] = useState(false);
  const [boxes, setBoxes] = useState([]);

  const [isFetchAllPosts, setIsFetchAllPosts] = useState(false);
  const [allPosts, setAllPosts] = useState([]);

  let navigate = useNavigate();
  let auth = false;

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
  function toShamsi(y, m, d) {
    return shamsi
      .gregorianToJalali(parseInt(y), parseInt(m), parseInt(d))
      .join("/");
  }

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
    fetch(`http://localhost:8080/showBoxes/${userID}`)
      .then(function (response) {
        return response.json();
      })
      .then((responseJson) => {
        setIsFetchBoxes(true);
        setBoxes(responseJson.data);
      });

    setInterval(function () {
      fetch(`http://localhost:8080/showPosts`)
        .then(function (response) {
          return response.json();
        })
        .then((responseJson) => {
          setIsFetchAllPosts(true);
          setAllPosts(responseJson.data);
        });
    }, 100);
  }, []);

  return (
    <React.Fragment>
      <Topdash icon="fas fa-th-large">مطالب و محتوای پزشکی</Topdash>
      <div className="posts">
        <Tabs
          defaultActiveKey="all"
          id="fill-tab-example"
          className="posts-tab"
        >
          <Tab eventKey="all" title="همه" style={{ flexShrink: 1 }}>
            {isFetchAllPosts ? (
              allPosts.map((post) => {
                if (post) {
                  return (
                    <Card key={post._id} id={post._id}>
                      <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {post.problem}
                        </Card.Subtitle>
                        <Card.Text style={{ whiteSpace: "pre-wrap" }}>{post.text}</Card.Text>
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
                            jwt_decode(localStorage.getItem("token")).userInfo
                              ._id
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
                            jwt_decode(localStorage.getItem("token")).userInfo
                              ._id
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
                } else {
                  return (
                    <div className="no-data-fetch">
                      <img src={notfound} />
                      <p> با عرض پوزش، در حال حاضر محتوایی وجود ندارد.</p>
                    </div>
                  );
                }
              })
            ) : (
              <Spinner className="spinner" animation="grow" />
            )}
          </Tab>

          {isFetchBoxes
            ? boxes.map((box) => {
                let count = 0;
                return (
                  <Tab eventKey={`posts/${box.slug}`} title={box.boxName}>
                    {isFetchAllPosts ? (
                      allPosts.map((post) => {
                        if (post) {
                          if (post.problem === box.boxName) {
                            count++;
                            return (
                              <Card key={post._id} id={post._id}>
                                <Card.Body>
                                  <Card.Title>{post.title}</Card.Title>
                                  <Card.Subtitle className="mb-2 text-muted">
                                    {post.problem}
                                  </Card.Subtitle>
                                  <Card.Text style={{ whiteSpace: "pre-wrap" }}>{post.text}</Card.Text>
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
                                      jwt_decode(localStorage.getItem("token"))
                                        .userInfo._id
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
                                      jwt_decode(localStorage.getItem("token"))
                                        .userInfo._id
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
                          }
                        } else {
                          return (
                            <div className="no-data-fetch">
                              <img src={notfound} />
                              <p>
                                {" "}
                                با عرض پوزش، در حال حاضر  محتوایی در این حوزه وجود ندارد.
                              </p>
                            </div>
                          );
                        }
                      })
                    ) : (
                      <Spinner className="spinner" animation="grow" />
                    )}
                    {count == 0 ? (
                      <div className="no-data-fetch">
                        <img src={notfound} />
                        <p>
                          با عرض پوزش، در حال حاضر محتوایی در رابطه با مورد انتخاب
                          شده وجود ندارد.
                        </p>
                      </div>
                    ) : null}
                  </Tab>
                );
              })
            : null}
        </Tabs>
      </div>
    </React.Fragment>
  );
};

export default Post;
