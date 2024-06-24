import React, { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";
import { AddVariantSchema } from "./../../../common/VariantSchema/variantSchema";
import { useFormik } from "formik";

const CountryPopup = ({
  open,
  setOpen,
  countryData,
  selectedCountries,
  setSelectedCountries,
  variantData,
  //   categoryData,
  //   productId,
  setUpdatedState,
  updatedState,
}) => {
  const handleCheckboxChange = (countryCode) => {
    const selectedIndex = selectedCountries.indexOf(countryCode);
    let newSelectedCountries = [...selectedCountries];

    if (selectedIndex === -1) {
      newSelectedCountries.push(countryCode);
    } else {
      newSelectedCountries.splice(selectedIndex, 1);
    }

    setSelectedCountries(newSelectedCountries);
  };

  const handleSubmit = () => {
    const selectedCountryDetails = countryData.filter((country) =>
      selectedCountries.includes(country.country_code)
    );

    const selectedCountryDetailsWithStatus = selectedCountryDetails.map(
      (country) => ({
        ...country,
        status: "active",
      })
    );

    // Update the state with the modified array
    setSelectedCountries(selectedCountryDetailsWithStatus);

    // const axios = require("axios");
    let data = {
      variant_id: variantData?.variant_id?.toString(),
      country_data: selectedCountryDetailsWithStatus,
    };

    let config = {
      method: "put",
      url: `${environmentVariables?.apiUrl}api/admin/product/add_country_only`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setUpdatedState(!updatedState);
        toast.success("Country Added");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });

    setOpen(false);
  };

  //   const initialValues = {
  //     colorValue: "",
  //   };

  //   let formik = useFormik({
  //     initialValues: initialValues,
  //     validationSchema: AddVariantSchema,
  //     onSubmit: async (values, { resetForm }) => {
  //       let data = new FormData();
  //       data.append("color_id", values.colorValue);
  //       data.append("product_id", productId);

  //       let config = {
  //         method: "post",
  //         maxBodyLength: Infinity,
  //         url: `${environmentVariables?.apiUrl}api/admin/product/add_product_variant`,

  //         data: data,
  //       };

  //       axios
  //         .request(config)
  //         .then((response) => {
  //           setUpdatedState(!updatedState);
  //           setOpen(false);
  //           toast.success("New Variant Added Successfully");
  //         })
  //         .catch((error) => {
  //           toast.error(error?.response?.data?.message || error?.message, {
  //             position: toast.POSITION.TOP_RIGHT,
  //           });
  //         });

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
  //     },
  //   });

  //   const { values, errors, handleSubmit } = formik;
  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add Country</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {countryData.map((country) => (
            <Form.Check
              key={country.country_code}
              type="checkbox"
              id={country.country_code}
              label={country.country}
              checked={selectedCountries.includes(country.country_code)}
              onChange={() => handleCheckboxChange(country.country_code)}
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CountryPopup;
