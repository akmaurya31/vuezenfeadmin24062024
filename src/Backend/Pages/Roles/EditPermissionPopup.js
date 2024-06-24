import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { environmentVariables } from "../../../config/env.config";
import { toast } from "react-toastify";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";
import styled from "styled-components";

const EditPermissionButton = styled.button`
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

const EditPermissionPopup = ({
  open,
  setOpen,
  permissionInfo,
  setUpdatedState,
  updatedState,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [name, setName] = useState(permissionInfo?.name);
  const [status, setStatus] = useState(permissionInfo?.status);
  const [routesData, setRoutesData] = useState([]);
  // const [frontendRoutes, setFrontendRoutes] = useState(
  //   permissionInfo?.frontend_routes?.map((item) => item.id.toString())
  // );
  const [frontendRoutes, setFrontendRoutes] = useState([]);
  //   data.map((item) => item.id.toString());
  // const [backendRoutes, setBackendRoutes] = useState(
  //   permissionInfo?.backend_routes?.map((item) => item.id.toString())
  // );
  const [backendRoutes, setBackendRoutes] = useState([]);
  const options =
    routesData
      ?.filter((item) => item.type === "backend")
      ?.map((routes) => ({
        label: routes?.name?.split("/").slice(3).join("/"),
        value: routes.id.toString(),
        // Ensure value is a string
      })) || [];

  const optionsforFrontend = routesData
    ?.filter((item) => item.type == "frontend")
    ?.map((routes) => ({
      label: routes.name?.split("/")[1],
      value: routes.id.toString(),
    }));

  useEffect(() => {
    console.log("Tanuj");
    const initialBackendRoutes =
      permissionInfo?.backend_routes?.map((item) => item.id.toString()) || [];
    setBackendRoutes(initialBackendRoutes);
    const initialFrontRoutes =
      permissionInfo?.frontend_routes?.map((item) => item.id.toString()) || [];
    setFrontendRoutes(initialFrontRoutes);
  }, [permissionInfo, routesData]);

  const handleChangeStatus = () => {
    if (status == "active") {
      setStatus("inactive");
    } else {
      setStatus("active");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (name == "") {
      setError("Name is mandatory");
      return;
    } else if (name?.trim()?.length < 3) {
      setError("Name should be atleast 3 character");
      return;
    }
    setIsSubmit(true);
    let obj = {
      id: permissionInfo?.id,
      name: name,
      status: status,
      backend_routes: backendRoutes?.map((id) => parseInt(id)),
      frontend_routes: frontendRoutes.map((id) => parseInt(id)),
    };
    await axios
      .put(`${environmentVariables?.apiUrl}api/admin/permission/edit`, obj, {
        withCredentials: true,
      })
      .then((sol) => {
        toast.success("Permission Update Successfully");
        setUpdatedState(!updatedState);
        setOpen(false);
        setIsSubmit(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsSubmit(false);
      });
  };
  const getRoutesData = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/api_endpoint/get`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setRoutesData(response?.data?.data);
      })
      .catch((error) => {
        setRoutesData([]);
      });
  };
  useEffect(() => {
    getRoutesData();
  }, []);

  // const options = permissionInfo?.backend_routes?.map((routes) => ({
  //   label: routes.name,
  //   value: routes?.id?.toString(),
  // }));
  // const optionsforFrontend = permissionInfo?.frontend_routes?.map((routes) => ({
  //   label: routes.name,
  //   value: routes?.id?.toString(),
  // }));
  const handleOnchangeBackendRoutes = (selectedOptions) => {
    const selectedValues = selectedOptions.split(",");
    setBackendRoutes(selectedValues);
    // formik.setFieldValue("backendRoute", selectedValues);
  };
  const handleOnchangeFrontendRoutes = (selectedOptions) => {
    const selectedValues = selectedOptions.split(",");
    setFrontendRoutes(selectedValues);
    // formik.setFieldValue("frontendRoute", selectedValues);
  };

  const handlePermissionName = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setName(alphanumericValue);
  };

  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Permission</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="Name"
              className="logform-input"
              value={name}
              onChange={handlePermissionName}
            />
          </Form.Group>

          <MultiSelect
            className="multi-select"
            onChange={handleOnchangeBackendRoutes}
            options={options}
            defaultValue={backendRoutes}
            style={{ width: "400px" }}
          />
          <MultiSelect
            className="multi-select"
            onChange={handleOnchangeFrontendRoutes}
            options={optionsforFrontend}
            defaultValue={frontendRoutes}
            style={{ width: "400px" }}
          />

          <Form.Check
            type="switch"
            id="custom-switch"
            label="Enable/Disable"
            checked={status == "active"}
            onChange={(e) => handleChangeStatus(e)}
          />
        </Form>
        <EditPermissionButton
          onClick={(e) => handleUpdateSubmit(e)}
          style={{ width: "200px", alignSelf: "end" }}
          disabled={isSubmit}
        >
          {isSubmit ? <ButtonLoader size={30} /> : "Edit Permission"}
        </EditPermissionButton>
      </Modal.Body>
    </Modal>
  );
};

export default EditPermissionPopup;
