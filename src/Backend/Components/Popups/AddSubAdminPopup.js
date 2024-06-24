import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import axios from "axios";
import { AddNewSubAdmin } from "../../../common/SubAdminSchemas/AddSubAdminSchema";
import { useFormik } from "formik";
import { countryContext } from "../../../context/countryContext";
import styled from "styled-components";
import ButtonLoader from "../ButtonLoader/ButtonLoader";

const AddButton = styled.div`
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

const AddSubAdminPopup = ({
  open,
  setOpen,
  updatedState,
  setUpdatedState,
  adminData,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [rolesData, setRolesData] = useState([]);
  const { allCountries } = useContext(countryContext);

  const initialValues = {
    name: adminData?.name || "",
    email: adminData?.email || "",
    role: adminData?.role_id || "",
    country: adminData?.country || "",
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewSubAdmin,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmit(true);
      let data = {
        name: values?.name,
        email: values?.email,
        role_id: values?.role,
        country: values?.country,
      };

      if (adminData && adminData?.id) {
        data.id = adminData?.id;
      }

      // console.log(data);
      let config = {
        method: adminData ? "put" : "post",
        url: adminData
          ? `${environmentVariables?.apiUrl}api/admin/edit_admin`
          : `${environmentVariables?.apiUrl}api/admin/create_admin`,
        withCredentials: true,
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          toast.success(response?.data?.message);
          setUpdatedState(!updatedState);
          setOpen(false);
          resetForm({});
          setIsSubmit(false);
        })
        .catch((error) => {
          // console.log(error);
          setOpen(false);
          toast.error(error?.response?.data?.message || error?.message);
          setIsSubmit(false);
        });
    },
  });

  const handleChangeRoles = (e) => {
    formik.setFieldValue("role", e.target.value);
  };
  const handleChangeCountry = (e) => {
    formik.setFieldValue("country", e.target.value);
  };

  const handleNameChange = (event) => {
    const { value } = event.target;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, ""); // Keep only valid email characters
    formik.setFieldValue("name", sanitizedValue);
  };
  const handleEmailChange = (event) => {
    const { value } = event.target;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9._@+-]/g, ""); // Keep only valid email characters
    formik.setFieldValue("email", sanitizedValue);
  };
  const { values, errors, handleSubmit } = formik;

  const getAllRoles = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/role/get_active`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setRolesData(response.data.data);
      })
      .catch((error) => {
        // console.log(error);
        setRolesData([]);
      });
  };
  useEffect(() => {
    getAllRoles();
  }, []);

  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{adminData ? "Edit" : "Add New"} SubAdmin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              value={values?.name}
              onChange={handleNameChange}
              onBlur={formik.handleBlur}
              name="name"
            />
            {formik.touched.name && formik.errors.name ? (
              <div style={{ color: "red" }}>{formik.errors.name}</div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={values?.email}
              onChange={handleEmailChange}
              onBlur={formik.handleBlur}
              readOnly={adminData ? true : false}
            />
            {formik.touched.email && formik.errors.email ? (
              <div style={{ color: "red" }}>{formik.errors.email}</div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={values?.role}
              onChange={handleChangeRoles}
              name="role"
              onBlur={formik.handleBlur}
            >
              <option value="" disabled selected>
                Select Role
              </option>
              {rolesData?.map((val, index) => (
                <option value={val?.id} key={index}>
                  {val?.name}
                </option>
              ))}
            </Form.Select>
            {formik.touched.role && formik.errors.role ? (
              <div style={{ color: "red" }}>{formik.errors.role}</div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>Country</Form.Label>
            <Form.Select
              value={values?.country}
              onChange={handleChangeCountry}
              name="country"
              onBlur={formik.handleBlur}
              disabled={!!adminData}
            >
              <option value="" disabled selected>
                Select Country
              </option>
              {/* {countryCodes.map((val) => (
                <option value={val?.name}>{val?.name}</option>
              ))} */}
              {allCountries &&
                allCountries.map((val, idex) => (
                  <option value={val?.country_code} key={idex}>
                    {val?.country}
                  </option>
                ))}
            </Form.Select>
            {formik.touched.country && formik.errors.country ? (
              <div style={{ color: "red" }}>{formik.errors.country}</div>
            ) : null}
          </Form.Group>
        </Form>
        <AddButton
          onClick={handleSubmit}
          style={{ width: "200px", alignSelf: "end" }}
          disabled={isSubmit}
        >
          {isSubmit ? (
            <ButtonLoader size={30} />
          ) : (
            `${adminData ? "Edit" : "Add"} SubAdmin`
          )}
        </AddButton>
      </Modal.Body>
    </Modal>
  );
};

export default AddSubAdminPopup;
