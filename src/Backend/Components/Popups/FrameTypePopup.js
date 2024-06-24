import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";
import ButtonLoader from "../ButtonLoader/ButtonLoader";

const EditButton = styled.button`
  font-size: 18px;
  padding: 15px 20px;
  border: 1px solid #0000001f;
  background-color: #032140;
  color: #fff;
  cursor: pointer;
  width: 200px;
  margin: 20px auto;
  border-radius: 5px;
  text-align: center;
  display: flex;
  justify-content: center;
`;

const FrameTypePopup = ({
  open,
  setOpen,
  frameTypeInfo,
  setUpdatedState,
  updatedState,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [name, setName] = useState(frameTypeInfo?.value);
  const [status, setStatus] = useState(frameTypeInfo?.status);

  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setStatus(newStatus);
  };

  const EditButtonClicked = () => {
    setIsSubmit(true);
    let data = {
      mainTitle: "frame_type",
      value: name,
      status: status,
      id: frameTypeInfo?.id,
    };
    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_category`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        toast.success("Frame Type Updated Successfully");
        setUpdatedState(!updatedState);
        setOpen(false);
        setIsSubmit(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsSubmit(false);
      });
  };
  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Frame Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Name"
              className="logform-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Check
            type="switch"
            id="custom-switch"
            label="Enable/Disable"
            checked={status === "active"}
            onChange={handleSwitchChange}
          />
        </Form>
        <EditButton
          onClick={() => EditButtonClicked()}
          style={{ width: "200px", alignSelf: "end" }}
          disabled={isSubmit}
        >
          {isSubmit ? <ButtonLoader size={30} /> : "Edit Frame Type"}
        </EditButton>
      </Modal.Body>
    </Modal>
  );
};

export default FrameTypePopup;
