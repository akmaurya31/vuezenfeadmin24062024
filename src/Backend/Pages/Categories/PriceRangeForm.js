import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { PriceRangeSchema } from "../../../common/Schemas/PriceRangeSchema";
import styled from "styled-components";

const PriceAddForm = styled.div`
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
const AddButton = styled.div`
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
  &:hover {
    background-color: lightgray;
  }
`;

const PriceRangeForm = ({ updatedState, setUpdatedState }) => {
  const initialValues = {
    maxPriceValue: "",
    minPriceValue: "",
    isButtonDisabled: false,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: PriceRangeSchema,
    onSubmit: async (values, { resetForm }) => {
   
      let formData = new FormData();
      formData.append("mainTitle", "price_range");
      formData.append("min", values?.minPriceValue);
      formData.append("max", values?.maxPriceValue);
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
          toast.success("Price Range Added Successfully");
          setUpdatedState(!updatedState);
          resetForm({});
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || error?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        });

      // let formData = new FormData();
      // formData.append("mainTitle", "material");
      // formData.append("value", values?.materialValue);
      // formData.append(
      //   "status",
      //   values?.isButtonDisabled ? "active" : "inactive"
      // );

      // let config = {
      //   method: "post",
      //   url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_category`,
      //   withCredentials: true,
      //   data: formData,
      // };

      // axios
      //   .request(config)
      //   .then((response) => {
      //   })
      //   .catch((error) => {
      //   });

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
    <PriceAddForm>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="number"
          placeholder="Min Price"
          className="logform-input"
          name="minPriceValue"
          value={values.minPriceValue}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.minPriceValue && formik.errors.minPriceValue ? (
          <div style={{ color: "red" }}>{formik.errors.minPriceValue}</div>
        ) : null}
      </Form.Group>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="number"
          placeholder="Max Price"
          className="logform-input"
          name="maxPriceValue"
          value={values.maxPriceValue}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.maxPriceValue && formik.errors.maxPriceValue ? (
          <div style={{ color: "red" }}>{formik.errors.maxPriceValue}</div>
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
      >
        Add Price Range
      </AddButton>
    </PriceAddForm>
  );
};

export default PriceRangeForm;
