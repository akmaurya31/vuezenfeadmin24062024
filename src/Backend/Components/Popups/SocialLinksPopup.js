import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";
import ButtonLoader from "../ButtonLoader/ButtonLoader";

const Image = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border: 2px solid #ffffff;
  border-radius: 10px;
  box-shadow: 0px 0px 9px 3px #00000040;
  margin: 0 10px 10px 0;
`;

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

const SocialLinksPopup = ({
  open,
  setOpen,
  socialInfo,
  getResData,
  resData,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [name, setName] = useState(socialInfo?.url);
  const [selectedImage, setSelectedImage] = useState(socialInfo?.image);
  //   const [status, setStatus] = useState(genderInfo?.status);
  const fileInputRef = useRef(null);

  const handleChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setStatus(newStatus);
  };

  const EditButtonClicked = () => {
    setIsSubmit(true);

    const formdata = new FormData();
    formdata.append("social_media_image", selectedImage);
    formdata.append("url", name);
    formdata.append("social_id", socialInfo?.id);
    formdata.append("id", resData?.id);
    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/footer/add_social_media`,
      withCredentials: true,
      data: formdata,
    };

    axios
      .request(config)
      .then((response) => {
        toast.success("Social Link Data Updated Successfully");
        getResData();
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
  const handleChangeName = (event) => {
    // (e) => setName(e.target.value)
    const { value } = event.target;
    const sanitizedValue = value
      .replace(/\+/g, "") 
      .replace(/[^a-zA-Z0-9/_\-+@!#$%&*(){}|\.]/g, ""); 
    setName(sanitizedValue);
  };
  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Social Link</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="Name"
              className="logform-input"
              value={name}
              onChange={handleChangeName}
            />
          </Form.Group>

          <Form.Group controlId="formBasicImage">
            <Image
              src={`${environmentVariables?.cdnUrl}uploads/footer/${selectedImage}`}
            />
            {/* <Form.Label>Choose Image</Form.Label> */}
            <input
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              ref={fileInputRef}
            />
          </Form.Group>
          {/* <Form.Check
            type="switch"
            id="custom-switch"
            label="Enable/Disable"
            checked={status === "active"}
            onChange={handleSwitchChange}
          /> */}
        </Form>
        <EditButton
          onClick={() => EditButtonClicked()}
          style={{ width: "200px", alignSelf: "end" }}
          disabled={isSubmit}
        >
          {isSubmit ? <ButtonLoader size={30} /> : "Edit Social Link"}
        </EditButton>
      </Modal.Body>
    </Modal>
  );
};

export default SocialLinksPopup;
