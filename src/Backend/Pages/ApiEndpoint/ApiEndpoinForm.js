import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useFormik } from "formik";
import { AddApiEndpointSchema } from "../../../common/ApiendpointSchema/ApiendpointSchema";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";

const PermissionInput = styled.input`
  padding: 12px 15px;
  width: 300px;
  font-size: 15px;
  border-radius: 5px;
  border: 1px solid #00000026;
  margin-right: 20px;
  margin-bottom: 20px;
`;

const PermissionAddFormMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const PermissionAddForm = styled.div`
  width: 100%;
  background-color: #fff;
  padding: 30px;
  border: 1px solid #00000026;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TopInputs = styled.div`
  display: flex;
`;

const AddPermissionButton = styled.button`
  font-size: 18px;
  padding: 15px 20px;
  border: 1px solid #0000001f;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  width: 200px;
  margin-bottom: 20px;
  type: submit;
  margin-top: 20px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  &:hover {
    background-color: lightgray;
  }
`;

const ApiEndpoinForm = ({ updatedState, setUpdatedState, setEditRouteId }) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [routesData, setRoutesData] = useState([]);
  const [rerenderKey, setRerenderKey] = useState(0);

  const initialValues = {
    type: "",
    name: "",
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddApiEndpointSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmit(true);
      let data = {
        name: values?.name,
        type: values?.type,
      };
      let config = {
        method: "post",
        url: `${environmentVariables?.apiUrl}api/admin/api_endpoint/add`,
        withCredentials: true,
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          toast.success("Api endpoint added successfully");
          resetForm(); // Reset the form
          setUpdatedState(!updatedState);
          setEditRouteId(null);
          // formik.setFieldValue("backendRoute", []);
          // formik.setFieldValue("frontendRoute", []);
          setIsSubmit(false);

          setRerenderKey((prevKey) => prevKey + 1);
        })
        .catch((error) => {
          setEditRouteId(null);

          toast.error(error?.response?.data?.message || error?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setIsSubmit(false);
        });
    },
  });

  const { values, errors, handleSubmit } = formik;
  // useEffect(() => {
  //   console.log(values, "valuesvaluesvalues ");
  // }, [values]);
  const getRoutesData = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/api_endpoint/get`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response?.data?.data, "response?.data?.data");

        setRoutesData(response?.data?.data);
      })
      .catch((error) => {
        setRoutesData([]);
      });
  };
  useEffect(() => {
    getRoutesData();
  }, []);

  const options = routesData
    ?.filter((item) => item.type == "backend")
    ?.map((routes) => ({
      label: routes.name?.split("/").slice(3).join("/"),
      value: routes.id,
    }));
  const optionsforFrontend = routesData
    ?.filter((item) => item.type == "frontend")
    ?.map((routes) => ({
      label: routes.name?.split("/")[1],
      value: routes.id,
    }));
  const handleOnchangeBackendRoutes = (selectedOptions) => {
    const selectedValues = selectedOptions.split(",");
    // formik.setFieldValue("backendRoute", selectedValues);
  };
  const handleOnchangeFrontendRoutes = (selectedOptions) => {
    const selectedValues = selectedOptions.split(",");
    // formik.setFieldValue("frontendRoute", selectedValues);
  };
  const data = [
    { id: 1, title: "backend" },
    { id: 2, title: "frontend" },
  ];
  return (
    <PermissionAddFormMain>
      <PermissionAddForm>
        <div className="flex">
          <TopInputs>
            <Form.Group controlId="formBasicEmail">
              <PermissionInput
                type="text"
                placeholder="Enter api endpoint "
                className="logform-input"
                name="name"
                value={values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.name && formik.errors.name ? (
                <div style={{ color: "red" }}>{formik.errors.name}</div>
              ) : null}
            </Form.Group>

            <Form.Group>
              <Form.Select
                value={values?.type}
                onChange={formik.handleChange}
                name="type"
                onBlur={formik.handleBlur}
                // disabled={IndividualSeoData ? true : false}
              >
                <option value="" disabled selected>
                  Select type
                </option>
                {data.map((val) => (
                  <option value={val?.title} key={val?.id}>
                    {val?.title}
                  </option>
                ))}
              </Form.Select>
              {/* <MultiSelect
                key={rerenderKey}
                className="multi-select"
                onChange={handleOnchangeBackendRoutes}
                options={options}
                value={formik.values.backendRoute}
                style={{ width: "400px" }}
              /> */}

              {/* {formik.touched.backendRoute && formik.errors.backendRoute ? (
                <div style={{ color: "red" }}>{formik.errors.backendRoute}</div>
              ) : null} */}
            </Form.Group>

            <Form.Group></Form.Group>
          </TopInputs>
        </div>
      </PermissionAddForm>
      <AddPermissionButton
        type="button"
        onClick={() => handleSubmit()}
        disabled={isSubmit}
      >
        {isSubmit ? <ButtonLoader size={30} /> : "Add Api Endpoint"}
      </AddPermissionButton>
    </PermissionAddFormMain>
  );
};

export default ApiEndpoinForm;
