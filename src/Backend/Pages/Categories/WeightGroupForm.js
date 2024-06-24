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

const WeightGroupForm = ({ updatedState, setUpdatedState }) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const initialValues = {
    weightValue: "",
    isButtonDisabled: false,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: WeightGroupSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmit(true);
      let formData = new FormData();
      formData.append("mainTitle", "weight_group");
      formData.append("value", values?.weightValue);
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
          toast.success("Weight Group Added Successfully");
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

      //   const formdata = new FormData();
      //   formdata.append("image", selectedImage);
      //   formdata.append("value", values?.genderValue);
      //   formdata.append(
      //     "status",
      //     values?.isButtonDisabled ? "active" : "inactive"
      //   );
      //   let config = {
      //     method: "post",
      //     url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_only_gender`,
      //     withCredentials: true,
      //     data: formdata,
      //   };
      //   axios
      //     .request(config)
      //     .then((response) => {
      //       fileInputRef.current.value = null;
      //       toast.success("Category Added Successfully");
      //       setUpdatedState(!updatedState);
      //       resetForm({});
      //       formik.setFieldValue("genderInCategory", []);
      //     })
      //     .catch((error) => {
      //       toast.error(error?.response?.data?.message || error?.message, {
      //         position: toast.POSITION.TOP_RIGHT,
      //       });
      //     });
    },
  });

  const { values, errors, handleSubmit } = formik;
  return (
    <WeightAddForm>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="Weight"
          className="logform-input"
          name="weightValue"
          value={values.weightValue}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.weightValue && formik.errors.weightValue ? (
          <div style={{ color: "red" }}>{formik.errors.weightValue}</div>
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
        {isSubmit ? <ButtonLoader size={30} /> : " Add Weight"}
      </AddButton>
    </WeightAddForm>
  );
};

export default WeightGroupForm;
