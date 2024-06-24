import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import { AddShapeSchema } from "../../../common/Schemas/AddShapeSchema";
import { useFormik } from "formik";
import styled from "styled-components";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";

const ShapeAddForm = styled.div`
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

const ShapeForm = ({ updatedState, setUpdatedState }) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [selectedImageError, setSelectedImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const initialValues = {
    shapeValue: "",
    isButtonDisabled: false,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddShapeSchema,
    onSubmit: async (values, { resetForm }) => {
      if (selectedImage) {
        setIsSubmit(true);
        let formData = new FormData();
        formData.append("mainTitle", "shape");
        formData.append("value", values?.shapeValue);
        formData.append("shape_image", selectedImage);

        formData.append(
          "status",
          values?.isButtonDisabled ? "active" : "inactive"
        );

        let config = {
          method: "post",
          url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_category`,
          withCredentials: true,
          data: formData,
        };

        axios
          .request(config)
          .then((response) => {
            fileInputRef.current.value = null;
            formik.setFieldValue("genderInCategory", []);
            toast.success("Shape Added Successfully");
            setUpdatedState(!updatedState);
            resetForm({});
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

  const { values, errors, handleSubmit } = formik;
  const handleChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
    setSelectedImageError(false);
  };
  return (
    <ShapeAddForm>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="Shape"
          className="logform-input"
          name="shapeValue"
          value={values.shapeValue}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.shapeValue && formik.errors.shapeValue ? (
          <div style={{ color: "red" }}>{formik.errors.shapeValue}</div>
        ) : null}
      </Form.Group>

      <Form.Group controlId="formBasicImage">
        {/* <Form.Label>Choose Image : </Form.Label> */}
        <input
          type="file"
          accept="image/*"
          name="selectedImage"
          onChange={handleChangeImage}
          // value={formik.values.selectedImage}
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
      <AddButton
        style={{ width: "200px", alignSelf: "end" }}
        onClick={() => handleSubmit()}
        disabled={isSubmit}
      >
        {isSubmit ? <ButtonLoader size={30} /> : "Add Shape"}
      </AddButton>
    </ShapeAddForm>
  );
};

export default ShapeForm;
