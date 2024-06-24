import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";
import { AddVariantSchema } from "./../../../common/VariantSchema/variantSchema";
import { useFormik } from "formik";
import { AddCountryInVariantSchema } from "../../../common/VariantSchema/AddCountyInVariantSchema";
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

const EditVariantPopup = ({
  open,
  setOpen,
  categoryData,
  countryData,
  productId,
  varaintId,
  variantData,
  setUpdatedState,
  updatedState,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const initialValues = {
    // country: variantData?.,
    stock: variantData?.stock || 0,
    price: variantData?.price || 0,
    purchaseprice: variantData?.purchase_price || 0,
    discount: variantData?.discount || 0,
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddCountryInVariantSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmit(true);
      let data = {
        variant_id: varaintId?.variant_id?.toString(),
        country_code: variantData?.country_code,
        price: values?.price?.toString(),
        purchase_price: values?.purchaseprice?.toString(),
        stock: values?.stock?.toString(),
        discount: values?.discount?.toString(),
        status: "active",
      };

      let config = {
        method: "put",
        url: `${environmentVariables?.apiUrl}api/admin/product/add_country_data`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          setUpdatedState(!updatedState);
          setOpen(false);
          resetForm({});
          toast.success("New Variant Added Successfully");
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

  const handleStockChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    formik.setFieldValue("stock", alphanumericValue);
  };
  const handlePurchasePriceChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    formik.setFieldValue("purchaseprice", alphanumericValue);
  };
  const handleSalePriceChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    formik.setFieldValue("price", alphanumericValue);
  };
  const handleDiscountChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    formik.setFieldValue("discount", alphanumericValue);
  };
  const { values, errors, handleSubmit } = formik;
  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add Pricing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="text"
              name="stock"
              value={values.stock}
              onChange={handleStockChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.stock && formik.errors.stock ? (
              <div style={{ color: "red" }}>{formik.errors.stock}</div>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label> Purchase Price</Form.Label>
            <Form.Control
              type="text"
              name="purchaseprice"
              value={values.purchaseprice}
              onChange={handlePurchasePriceChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.purchaseprice && formik.errors.purchaseprice ? (
              <div style={{ color: "red" }}>{formik.errors.purchaseprice}</div>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label> Sale Price</Form.Label>
            <Form.Control
              type="text"
              name="price"
              value={values.price}
              onChange={handleSalePriceChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.price && formik.errors.price ? (
              <div style={{ color: "red" }}>{formik.errors.price}</div>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Discount(%)</Form.Label>
            <Form.Control
              type="text"
              name="discount"
              value={values.discount}
              onChange={handleDiscountChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.discount && formik.errors.discount ? (
              <div style={{ color: "red" }}>{formik.errors.discount}</div>
            ) : null}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Close
        </Button>
        <AddCategoryButton
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmit}
        >
          {isSubmit ? <ButtonLoader size={30} /> : "Save Changes"}
        </AddCategoryButton>
      </Modal.Footer>
    </Modal>
  );
};

export default EditVariantPopup;
