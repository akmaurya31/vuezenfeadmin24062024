import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";
import { AddVariantSchema } from "./../../../common/VariantSchema/variantSchema";
import { useFormik } from "formik";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";

const AddCategoryButton = styled.button`
  font-size: 14px;
  padding: 7px 8px;
  border: 1px solid #0000001f;
  background-color: #032140;
  color: #fff;
  cursor: pointer;
  width: 120px;
  /* margin-bottom: 20px; */
  /* margin-top: 20px; */
  border-radius: 5px;
  display: flex;
  justify-content: center;
  &:hover {
    background-color: lightgray;
  }
`;

const AddVariantPopup = ({
  open,
  setOpen,
  categoryData,
  productId,
  setUpdatedState,
  updatedState,
}) => {
  const initialValues = {
    colorValue: "",
  };
  const [isSubmit, setIsSubmit] = useState(false);

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddVariantSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmit(true);
      let data = new FormData();
      data.append("color_id", values.colorValue);
      data.append("product_id", productId);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${environmentVariables?.apiUrl}api/admin/product/add_product_variant`,

        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          setUpdatedState(!updatedState);
          setOpen(false);
          toast.success("New Variant Added Successfully");
          setIsSubmit(false);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || error?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setIsSubmit(false);
        });

      //   let formData = new FormData();
      //   formData.append("mainTitle", "color");
      //   let config = {
      //     method: "post",
      //     url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/add_category`,
      //     withCredentials: true,
      //     data: formData,
      //   };
      //   axios
      //     .request(config)
      //     .then((response) => {
      //       toast.success("Color Added Successfully");
      //       setUpdatedState(!updatedState);
      //       resetForm({});
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
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add Color</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Color</Form.Label>
            <Form.Select
              value={values.colorValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="colorValue"
            >
              <option value="" disabled>
                Select color
              </option>

              {categoryData?.color?.map((item, index) => {
                return (
                  <option
                    value={item?.id}
                    key={index}
                    style={{ backgroundColor: item?.value }}
                  >
                    {item?.value}
                  </option>
                );
              })}
            </Form.Select>
            {formik.touched.colorValue && formik.errors.colorValue ? (
              <div style={{ color: "red" }}>{formik.errors.colorValue}</div>
            ) : null}
          </Form.Group>
        </Form>
        <AddCategoryButton
          onClick={() => handleSubmit()}
          style={{ width: "200px", alignSelf: "end" }}
          disabled={isSubmit}
        >
          {isSubmit ? <ButtonLoader size={30} /> : "Add new Variant"}
        </AddCategoryButton>
      </Modal.Body>
    </Modal>
  );
};

export default AddVariantPopup;
