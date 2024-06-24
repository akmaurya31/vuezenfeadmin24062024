import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { WeightGroupSchema } from "../../../common/Schemas/WeightGroupSchema";
import styled from "styled-components";
import { AddFrameTypeSchema } from "../../../common/Schemas/AddFrameTypeSchema";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";

const WeightAddForm = styled.div`
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

const FrameTypeForm = ({ updatedState, setUpdatedState }) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const initialValues = {
    frameTypeValue: "",
    isButtonDisabled: false,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddFrameTypeSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmit(true);
      let formData = new FormData();
      formData.append("mainTitle", "frame_type");
      formData.append("value", values?.frameTypeValue);
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
          toast.success("Frame Type Added Successfully");
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
    <WeightAddForm>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="Frame Type"
          className="logform-input"
          name="frameTypeValue"
          value={values.frameTypeValue}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.frameTypeValue && formik.errors.frameTypeValue ? (
          <div style={{ color: "red" }}>{formik.errors.frameTypeValue}</div>
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
        {isSubmit ? <ButtonLoader size={30} /> : "Add Frame Type"}
      </AddButton>
    </WeightAddForm>
  );
};

export default FrameTypeForm;
