import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "./modal.css";

const Modalshow = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.modalTitle}
        </Modal.Title>
        <Button className="closebtn" onClick={props.onHide}>
          <i class="fa fa-close"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
};

export default Modalshow;
