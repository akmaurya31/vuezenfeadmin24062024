import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { environmentVariables } from "../../../config/env.config";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
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

const CategoryPopup = ({
  data,
  open,
  setOpen,
  categoryInfo,
  setUpdatedState,
  updatedState,
}) => {
  const [selectedImage, setSelectedImage] = useState(categoryInfo?.image);
  const [category, setCategory] = useState(categoryInfo?.value);
  const [status, setStatus] = useState(categoryInfo?.status);
  const [isSubmit, setIsSubmit] = useState(false);

  const [specailOffer, setSpecialOffer] = useState(
    categoryInfo?.is_special_offer
  );
  const [genderInCategory, setGenderInCategory] = useState(
    categoryInfo?.gender_arr
  );
  const fileInputRef = useRef(null);

  const options = data?.gender
    ?.filter((item) => item.status == "active")
    .map((item) => ({
      label: item.value.charAt(0).toUpperCase() + item.value.slice(1), // Capitalize the first letter
      value: item.id?.toString(),
    }));

  const handleChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setStatus(newStatus);
  };
  const handleSwitchChangeSpecialOffer = (e) => {
    const newStatus = e.target.checked ? "1" : "0";
    setSpecialOffer(newStatus);
  };

  const handleOnchangeTheme = (val) => {
    const selectedValues = val.split(",");
    setGenderInCategory(selectedValues);
  };
  const EditButtonClicked = () => {
    setIsSubmit(true);
    const formdata = new FormData();
    formdata.append("image", selectedImage);
    formdata.append("title", category);
    formdata.append("value", category);
    formdata.append("slug", category);
    formdata.append("status", status);
    formdata.append("is_special_offer", specailOffer);
    formdata.append("id", categoryInfo?.id);
    for (let i = 0; i < genderInCategory.length; i++) {
      formdata.append(`gender_arr[${i}]`, genderInCategory[i]);
    }
    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_only_category`,
      withCredentials: true,
      data: formdata,
    };
    axios
      .request(config)
      .then((response) => {
        setIsSubmit(false);

        toast.success("Category Updated Successfully");
        setUpdatedState(!updatedState);
        setOpen(false);
      })
      .catch((error) => {
        setIsSubmit(false);

        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };
  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="category"
              className="logform-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>

          <Form.Group
            controlId="formBasicImage"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Image
              src={`${environmentVariables?.cdnUrl}uploads/filterProduct/category/${selectedImage}`}
            />
            {/* <Form.Label>Choose Image</Form.Label> */}
            <input
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              ref={fileInputRef}
              className="form-control"
            />
          </Form.Group>
          <MultiSelect
            className="multi-select"
            onChange={handleOnchangeTheme}
            options={options}
            defaultValue={genderInCategory}
          />
          <Form.Group
            controlId="custom-switch"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Form.Label
              htmlFor="custom-switch"
              style={{ marginLeft: "10px", marginBottom: "0" }}
            >
              Student Offer
            </Form.Label>
            <Form.Check
              type="switch"
              id="custom-switch"
              label=""
              checked={specailOffer === "1"}
              onChange={handleSwitchChangeSpecialOffer}
            />
          </Form.Group>

          <Form.Group
            controlId="custom-switch"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Form.Label
              htmlFor="custom-switch"
              style={{
                marginLeft: "10px",
                marginBottom: "0",
                marginTop: "10px",
              }}
            >
              Category Status
            </Form.Label>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Enable/Disable"
              checked={status === "active"}
              onChange={handleSwitchChange}
            />
          </Form.Group>
        </Form>

        <EditButton
          onClick={() => EditButtonClicked()}
          style={{ width: "200px", alignSelf: "end" }}
          disabled={isSubmit}
        >
          {isSubmit ? <ButtonLoader size={30} /> : "Edit Category"}
        </EditButton>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryPopup;
