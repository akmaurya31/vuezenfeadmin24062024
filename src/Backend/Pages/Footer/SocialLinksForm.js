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
import { AddSocialLinkSchema } from "../../../common/Schemas/AddSocialLinkSchema";
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
  background-color: #e9e9e9;
  padding: 0px 10px;
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
  margin-bottom: 10px;
  margin-top: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  &:hover {
    background-color: lightgray;
  }
`;

const SocialLinksForm = ({ resData, getResData }) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageError, setSelectedImageError] = useState(false);

  const initialValues = {
    socialinkValue: "",
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddSocialLinkSchema,
    onSubmit: async (values, { resetForm }) => {
      if (selectedImage) {
        setIsSubmit(true);
        const formdata = new FormData();
        formdata.append("social_media_image", selectedImage);
        formdata.append("url", values?.socialinkValue);
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
            fileInputRef.current.value = null;
            toast.success(response?.data?.message);
            getResData();
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
  const handleOnchangeGender = (selectedOptions) => {
    const selectedValues = selectedOptions.split(",");

    // setGenderInCategory(selectedValues);
    formik.setFieldValue("genderInCategory", selectedValues);
  };
  const handleChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
    setSelectedImageError(false);
  };

  const handleSocialLinkValueChange = (event) => {
    const { value } = event.target;
    const sanitizedValue = value
      .replace(/\+/g, "") 
      .replace(/[^a-zA-Z0-9/_\-+@!#$%&*(){}|\.]/g, ""); 
    formik.setFieldValue("socialinkValue", sanitizedValue);
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
                placeholder="Enter Social Link Name"
                className=""
                name="socialinkValue"
                value={values.socialinkValue}
                onChange={handleSocialLinkValueChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.socialinkValue && formik.errors.socialinkValue ? (
                <div style={{ color: "red" }}>
                  {formik.errors.socialinkValue}
                </div>
              ) : null}
            </Form.Group>
          </TopInputs>
          <Form.Group controlId="formBasicImage">
            <input
              style={{ border: "0" }}
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
        </div>

        <AddCategoryButton onClick={() => handleSubmit()} disabled={isSubmit}>
          {isSubmit ? <ButtonLoader size={30} /> : "Add Social Link"}
        </AddCategoryButton>
      </CategoryAddForm>
    </CategoryAddFormMain>
  );
};

export default SocialLinksForm;
