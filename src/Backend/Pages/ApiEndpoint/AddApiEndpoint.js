import React, { useLayoutEffect, useRef, useState, useEffect } from "react";

import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
// import { AddPermissionSchema } from "../../../common/Schemas/AddPermissionSchema";
import { useQuery } from "react-query";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiEndpoinForm from "./ApiEndpoinForm";
import styled from "styled-components";
import RoleForm from "./RoleForm";
import EditPermissionPopup from "./EditPermissionPopup";
import Swal from "sweetalert2";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";

// Create a styled component
const EditButton = styled.button`
font-size: 18px;
    padding: 5px 0;
    border: 1px solid #0000001f;
    background-color: #fff;
    color: #000;
    cursor: pointer;
    width: 100px;
    border-radius: 5px;
    margin: 0;
`;
const DelButton = styled.button`
font-size: 18px;
    padding: 5px 0;
    border: 1px solid rgba(0, 0, 0, 0.1215686275);
    background-color: #dd4646;
    color: #fff;
    cursor: pointer;
    width: 100px;
    border-radius: 5px;
    margin: 0;
`;
const Heading = styled.div`
  font-size: 30px;
  color: #032140;
  font-weight: 700;
  margin-bottom: 20px;
`;
const CategorySingle = styled.div`
  margin-bottom: 50px;
`;

const StyledButton = styled.button`
  font-size: 18px;
  padding: 15px 20px;
  border: 1px solid #0000001f;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  width: 200px;
  margin-bottom: 20px;
  border-radius: 5px;
  &:hover {
    background-color: lightgray;
  }
`;

const AddPermissionButton = styled.button`
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
const AddApiEndpoint = () => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [permissionData, setPermissionData] = useState([]);
  const [updatedState, setUpdatedState] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [showRoleUpdateModal, setShowRoleUpdateModal] = useState(false); //for role creation
  const [roleData, setRoleData] = useState([]); //for role array
  const [editRoleObj, setEditRoleObj] = useState({}); //for role edit

  const [editEndPointName, setEditEndPointName] = useState("");
  const [editRouteType, setEditRouteType] = useState("");
  const [editRouteId, setEditRouteId] = useState(null);

  const routeArray = [
    { id: 1, title: "backend" },
    { id: 2, title: "frontend" },
  ];

  const handleClose = () => {
    setShowUpdateModal(false);
  };

  const handleSubmit = () => {
    // console.log(editRouteId,"editRouteId",editEndPointName,editRouteType)
    setIsSubmit(true);
    let data = {
      name: editEndPointName,
      type: editRouteType,
      id: editRouteId,
    };

    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/api_endpoint/add`,
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        fetchData();
        toast.success(response?.data?.message);
        setEditRouteId(null);
        setShowUpdateModal(false);
        setIsSubmit(false);
      })
      .catch((error) => {
        // console.log(error);
        setEditRouteId(null);
        toast.error(error?.response?.data?.message || error?.message);
        setIsSubmit(false);
      });
  };
  const fetchData = async () => {
    axios
      .get(`${environmentVariables?.apiUrl}api/admin/api_endpoint/get`, {
        withCredentials: true,
      })
      .then((sol) => {
        setPermissionData(sol?.data?.data);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const fetchRoleData = async () => {
    axios
      .get(`${environmentVariables?.apiUrl}api/admin/role/get_all`, {
        withCredentials: true,
      })
      .then((sol) => {
        setRoleData(sol?.data?.data);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  useEffect(() => {
    fetchData();
    fetchRoleData();
    if (showRoleUpdateModal == false) {
      setEditRoleObj({});
    }
  }, [updatedState, showRoleUpdateModal]);

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    let url = `api/admin/permission/destroy_by_id?id=${itemToDelete?.id}`;
    if (itemToDelete && itemToDelete?.permissionData) {
      url = `api/admin/role/destroy?id=${itemToDelete?.id}`;
    }
    axios
      .delete(`${environmentVariables?.apiUrl}${url}`, {
        withCredentials: true,
      })
      .then((response) => {
        toast.success(`"${itemToDelete?.name}" Deleted Successfully`);
        setUpdatedState(!updatedState);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      })
      .finally(() => {
        setShowConfirmation(false);
      });
  };

  const handleSaveRole = () => {
    setShowRoleUpdateModal(true);
  };

  const handleRoleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmation(true);
  };
  const handleStatusChangeForRole = (status, id) => {
    let obj = {
      status: status == "active" ? "inactive" : "active",
      id: id,
    };
    axios
      .put(`${environmentVariables?.apiUrl}api/admin/role/update_status`, obj, {
        withCredentials: true,
      })
      .then((response) => {
        toast.success(response?.data?.message);
        fetchRoleData();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      });
  };

  const DeleteEndPoint = (item) => {
    Swal.fire({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        let config = {
          method: "delete",
          url: `${environmentVariables?.apiUrl}api/admin/api_endpoint/delete_endpoint_by_id?id=${item?.id}`,
          withCredentials: true,
        };
        Swal.showLoading();

        axios
          .request(config)
          .then((response) => {
            // console.log(JSON.stringify(response.data));
            fetchData();
            toast.success(response?.data?.message);
            Swal.close();
          })
          .catch((error) => {
            // console.log(error);
            toast.error(error?.response?.data?.message || error?.message);
            Swal.close();
          });
      }
    });
  };
  // console.log("setEditRouteType",editEndPointName,editRouteType)
  return (
    <>
      <CategorySingle>
        <Heading>Api Endpoint</Heading>
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ApiEndpoinForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
              setEditRouteId={setEditRouteId}
            />
          </div>
          {permissionData?.map((item, index) => {
            return (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:"1fr 1fr 1fr",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                key={index}
              >
                <div
                  style={{
                    margin: "10px",
                    backgroundColor: "lightgray",
                    padding: "10px",
                  }}
                >
                  {item?.name}
                </div>
                <div>{item?.type}</div>
                <div style={{display:"flex", gap:"20px"}}>
                  <EditButton
                    className="edit-button"
                    onClick={() => {
                      setShowUpdateModal(true);
                      setEditEndPointName(item?.name);
                      setEditRouteType(item?.type);
                      setEditRouteId(item?.id);
                    }}
                  >
                    Edit
                  </EditButton>
                  {/* <Button onClick={() => handleDelete(item)}>Delete</Button> */}
                
                  <DelButton
                    className="del-button"
                    onClick={() => {
                      DeleteEndPoint(item);
                    }}
                  >
                    Delete
                  </DelButton>
                </div>
              </div>
            );
          })}
        </div>
      </CategorySingle>

      <Modal show={showUpdateModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit End Points</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>EndPoint Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Endpoint"
                className="logform-input"
                value={editEndPointName}
                onChange={(e) => setEditEndPointName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={editRouteType}
                onChange={(e) => setEditRouteType(e.target.value)}
                name="type"
              >
                <option value="" disabled selected>
                  Select type
                </option>
                {routeArray.map((val) => (
                  <option value={val?.title} key={val?.id}>
                    {val?.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <AddPermissionButton
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmit}
          >
            {isSubmit ? <ButtonLoader size={30} /> : "Save Changes"}
          </AddPermissionButton>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default AddApiEndpoint;
