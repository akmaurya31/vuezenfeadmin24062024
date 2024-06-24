import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import { AddShapeSchema } from "../../../common/Schemas/AddShapeSchema";
import { useFormik } from "formik";
import { AddMaterialSchema } from "../../../common/Schemas/AddMaterialSchema";
import styled from "styled-components";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";

const MaterialAddForm = styled.div`
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

const MaterialForm = ({ updatedState, setUpdatedState }) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const initialValues = {
    materialValue: "",
    isButtonDisabled: false,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddMaterialSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmit(true);
      let formData = new FormData();
      formData.append("mainTitle", "material");
      formData.append("value", values?.materialValue);
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
          toast.success("Material Added Successfully");
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
    },
  });

  const { values, errors, handleSubmit } = formik;
  return (
    <MaterialAddForm>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="Material"
          className="logform-input"
          name="materialValue"
          value={values.materialValue}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.materialValue && formik.errors.materialValue ? (
          <div style={{ color: "red" }}>{formik.errors.materialValue}</div>
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
        {isSubmit ? <ButtonLoader size={30} /> : "Add Material"}
      </AddButton>
    </MaterialAddForm>
  );
};

export default MaterialForm;
