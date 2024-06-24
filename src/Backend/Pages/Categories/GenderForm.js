import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { AddGenderSchema } from "../../../common/Schemas/AddGenderSchema";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";
import styled from "styled-components";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";

const GenderAddForm = styled.div`
  width: 100%;
  background-color: #f4f5f7;
  padding: 0px 20px;
  border: 1px solid #0000000a;
  border-radius: 5px;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  gap: 20px;
`;
const AddButton = styled.button`
  font-size: 18px;
  padding: 15px 20px;
  border: 1px solid #0000001f;
  background-color: #032140;
  color: #fff;
  cursor: pointer;
  width: 200px;
  margin-bottom: 20px;
  margin-top: 20px;
  border-radius: 5px;
  text-align: center;
  display: flex;
  justify-content: center;
  &:hover {
    background-color: lightgray;
  }
`;
const TopInputs = styled.div`
  display: flex;
`;

const GenderForm = ({ updatedState, setUpdatedState }) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageError, setSelectedImageError] = useState(false);

  const initialValues = {
    genderValue: "",
    isButtonDisabled: false,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddGenderSchema,
    onSubmit: async (values, { resetForm }) => {
      if (selectedImage) {
        setIsSubmit(true);
        const formdata = new FormData();
        formdata.append("image", selectedImage);
        formdata.append("value", values?.genderValue);
        formdata.append(
          "status",
          values?.isButtonDisabled ? "active" : "inactive"
        );
        let config = {
          method: "post",
          url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_only_gender`,
          withCredentials: true,
          data: formdata,
        };
        axios
          .request(config)
          .then((response) => {
            fileInputRef.current.value = null;
            toast.success("Gender Added Successfully");
            setUpdatedState(!updatedState);
            resetForm({});
            formik.setFieldValue("genderInCategory", []);
            setIsSubmit(false);
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || error?.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            setIsSubmit(false);
          });
      } else {
        setSelectedImageError(true);
      }
    },
  });
  const handleOnchangeGender = (selectedOptions) => {
    const selectedValues = selectedOptions.split(",");

    // setGenderInCategory(selectedValues);
    formik.setFieldValue("genderInCategory", selectedValues);
  };
  const handleChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
    setSelectedImageError(false);
  };
  const { values, errors, handleSubmit } = formik;
  return (
    <GenderAddForm>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="Gender"
          className="logform-input"
          name="genderValue"
          value={values.genderValue}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          style={{ width: "300px" }}
        />
        {formik.touched.genderValue && formik.errors.genderValue ? (
          <div style={{ color: "red" }}>{formik.errors.genderValue}</div>
        ) : null}
      </Form.Group>
      <Form.Group controlId="formBasicImage">
        {/* <Form.Label>Choose Image</Form.Label> */}
        <input
          type="file"
          accept="image/*"
          name="selectedImage"
          onChange={handleChangeImage}
          ref={fileInputRef}
        />
        {selectedImageError ? (
          <div style={{ color: "red" }}>Image is required</div>
        ) : null}
      </Form.Group>

      <Form.Check
        type="switch"
        id="custom-switch"
        label="Enable/Disable"
        checked={values.isButtonDisabled}
        onChange={() =>
          formik.setValues({
            ...formik.values,
            isButtonDisabled: !formik.values.isButtonDisabled,
          })
        }
      />
      <AddButton onClick={() => handleSubmit()} disabled={isSubmit}>
        {isSubmit ? <ButtonLoader size={30} /> : "Add Gender"}
      </AddButton>
    </GenderAddForm>
  );
};

export default GenderForm;
