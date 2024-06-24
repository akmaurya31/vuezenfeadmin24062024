import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import { AddCategorySchema } from "../../../common/Schemas/AddCategorySchema";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";

// Create a styled component
const CategoryInput = styled.input`
  padding: 12px 15px;
  width: 300px;
  font-size: 15px;
  border-radius: 5px;
  border: 1px solid #00000026;
  margin-right: 20px;
  /* margin-bottom: 20px; */
`;

const CategoryAddFormMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const CategoryAddForm = styled.div`
  width: 100%;
  background-color: #f4f5f7;
  padding: 0px 20px;
  border: 1px solid #0000000a;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-top: 20px; */
`;
const TopInputs = styled.div`
  display: flex;
  align-items: center;
`;

const AddCategoryButton = styled.button`
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
  display: flex;
  justify-content: center;
  &:hover {
    background-color: lightgray;
  }
`;

const CategoryForm = ({ updatedState, setUpdatedState, data }) => {
  const fileInputRef = useRef(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [key, setKey] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageError, setSelectedImageError] = useState(false);
  const options = data?.gender
    ?.filter((item) => item.status == "active")
    .map((item) => ({
      label: item.value.charAt(0).toUpperCase() + item.value.slice(1), // Capitalize the first letter
      value: item.id,
    }));

  const initialValues = {
    categoryValue: "",
    genderInCategory: [],
    isButtonDisabled: false,
    isSpecialOffer: false,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddCategorySchema,
    onSubmit: async (values, { resetForm }) => {
      if (selectedImage) {
        setIsSubmit(true);
        const formdata = new FormData();
        formdata.append("image", selectedImage);
        formdata.append("title", values?.categoryValue);
        formdata.append("value", values?.categoryValue);
        formdata.append("slug", values?.categoryValue);
        formdata.append("is_special_offer", values?.isSpecialOffer ? "1" : "0");
        formdata.append(
          "status",
          values?.isButtonDisabled ? "active" : "inactive"
        );
        for (let i = 0; i < values?.genderInCategory.length; i++) {
          formdata.append(`gender_arr[${i}]`, values?.genderInCategory[i]);
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
            fileInputRef.current.value = null;
            toast.success("Category Added Successfully");
            setUpdatedState(!updatedState);
            resetForm({});
            formik.setFieldValue("genderInCategory", []);
            setIsSubmit(false);
            setKey((prevKey) => prevKey + 1);
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
    <CategoryAddFormMain>
      <CategoryAddForm>
        <div className="flex">
          <TopInputs>
            <Form.Group controlId="formBasicEmail">
              <CategoryInput
                type="text"
                placeholder="Enter Category Name"
                className="logform-input"
                name="categoryValue"
                value={values.categoryValue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.categoryValue && formik.errors.categoryValue ? (
                <div style={{ color: "red" }}>
                  {formik.errors.categoryValue}
                </div>
              ) : null}
            </Form.Group>

            <MultiSelect
              key={key}
              className="multi-select"
              onChange={handleOnchangeGender}
              placeholder="Select Sub-Categories"
              options={options}
              value={values.genderInCategory}
              style={{ width: "280px", marginRight: "10px" }}
            />
            {formik.touched.genderInCategory &&
            formik.errors.genderInCategory ? (
              <div style={{ color: "red" }}>
                {formik.errors.genderInCategory}
              </div>
            ) : null}
          </TopInputs>
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
        </div>

        <Form.Check
          style={{ display: "flex" }}
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
        <Form.Group
          controlId="custom-switch"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Form.Label
            htmlFor="custom-switch"
            style={{ marginLeft: "10px", marginBottom: "0" }}
          >
            Special Offer
          </Form.Label>
          <Form.Check
            type="switch"
            id="custom-switch"
            label=""
            checked={values.isSpecialOffer}
            onChange={() =>
              formik.setValues({
                ...formik.values,
                isSpecialOffer: !formik.values.isSpecialOffer,
              })
            }
          />
        </Form.Group>
        <AddCategoryButton onClick={() => handleSubmit()} disabled={isSubmit}>
          {isSubmit ? <ButtonLoader size={30} /> : "Add Category"}
        </AddCategoryButton>
      </CategoryAddForm>
    </CategoryAddFormMain>
  );
};

export default CategoryForm;
