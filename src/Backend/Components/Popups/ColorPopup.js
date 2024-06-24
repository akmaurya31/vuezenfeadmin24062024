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

const ColorPopup = ({
  open,
  setOpen,
  colorInfo,
  setUpdatedState,
  updatedState,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [name, setName] = useState(colorInfo?.value);
  const [status, setStatus] = useState(colorInfo?.status);

  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setStatus(newStatus);
  };

  const EditButtonClicked = () => {
    setIsSubmit(true);
    let data = {
      mainTitle: "color",
      value: name,
      status: status,
      id: colorInfo?.id,
    };
    // console.log("data", data);
    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_category`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        toast.success("Color Updated Successfully");
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

    // for (let i = 0; i < genderInCategory.length; i++) {
    //   formdata.append(`gender_arr[${i}]`, genderInCategory[i]);
    // }
    // let config = {
    //   method: "post",
    //   url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_only_category`,
    //   withCredentials: true,
    //   data: formdata,
    // };
    // axios
    //   .request(config)
    //   .then((response) => {
    //     toast.success("Category Added Successfully");
    //     setUpdatedState(!updatedState);
    //     setOpen(false);
    //   })
    //   .catch((error) => {
    //     toast.error(error?.response?.data?.message || error?.message, {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //   });
  };
  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Color</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="color"
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
          {isSubmit ? <ButtonLoader size={30} /> : "Edit Color"}
        </EditButton>
      </Modal.Body>
    </Modal>
  );
};

export default ColorPopup;
