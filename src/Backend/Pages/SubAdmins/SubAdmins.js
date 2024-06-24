import React, { useEffect, useState } from "react";
import AddSubAdminPopup from "../../Components/Popups/AddSubAdminPopup";
import axios from "axios";
import { environmentVariables } from "../../../config/env.config";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import styled from "styled-components";
import Swal from "sweetalert2";

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

const SubAdmins = () => {
  const [showPopupForAddSubAdmin, setShowPopupForAddSubAdmin] = useState(false);
  const [updatedState, setUpdatedState] = useState(false);
  const [resData, setResData] = useState([]);
  const [adminData, setAdminData] = useState();

  const getAllAdmins = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/get_all_admin`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setResData(response?.data?.data);
      })
      .catch((error) => {
        setResData([]);
      });
  };

  const handleStatusChangeForRole = (e, id) => {
    // let obj = {
    //   status: status == "active" ? "inactive" : "active",
    //   id: id,
    // };
    // axios
    //   .put(`${environmentVariables?.apiUrl}api/admin/role/update_status`, obj, {
    //     withCredentials: true,
    //   })
    //   .then((response) => {
    //     toast.success(response?.data?.message);
    //     fetchRoleData();
    //   })
    //   .catch((error) => {
    //     toast.error(error?.response?.data?.message || error?.message);
    //   });
    let data = {
      id: id,
      status: e.target.checked ? "active" : "inactive",
    };
    let config = {
      method: "put",
      url: `${environmentVariables?.apiUrl}api/admin/admin_status_change_data`,
      withCredentials: true,
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        toast.success(response?.data?.message);
        setUpdatedState(!updatedState);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  useEffect(() => {
    getAllAdmins();
  }, [updatedState]);

  const handleClickEdit = (item) => {
    setShowPopupForAddSubAdmin(true);
    setAdminData(item);
  };

  const handleRoleDelete = (item) => {
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
          url: `${environmentVariables?.apiUrl}api/admin/delete_admin?id=${item?.id}`,
          withCredentials: true,
        };
        Swal.showLoading();

        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            toast.success("Property deleted Successfully");
            getAllAdmins();
            Swal.close();
          })
          .catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            Swal.close();
          });
      }
    });
  };
  return (
    <div>
      <div>
        <button
          className="add-button"
          onClick={() => {
            setAdminData();
            setShowPopupForAddSubAdmin(true);
          }}
        >
          Add New SubAdmin
        </button>
        <div>
          <div>
            <h2 style={{ marginBottom: "30px" }}>Sub Admin list</h2>
          </div>
          {resData?.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "grid",
                  alignItems:"center",
                  marginBottom: "30px",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                }}
              >
                <div className="admin-name">{item?.name}</div>
                <div style={{ display: "flex", marginBottom: "30px" , alignItems:"center"}}>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    checked={item?.status == "active"}
                    onChange={(e) => handleStatusChangeForRole(e, item?.id)}
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <EditButton
                      onClick={() => {
                        handleClickEdit(item);
                      }}
                    >
                      Edit
                    </EditButton>
                    <DelButton onClick={() => handleRoleDelete(item)}>
                      Delete
                    </DelButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showPopupForAddSubAdmin && (
          <AddSubAdminPopup
            open={showPopupForAddSubAdmin}
            setOpen={setShowPopupForAddSubAdmin}
            updatedState={updatedState}
            setUpdatedState={setUpdatedState}
            adminData={adminData}
          />
        )}
        {/* {showPopupForAddSubAdmin && (
          <AddSubAdminPopup
            open={showPopupForAddSubAdmin}
            setOpen={setShowPopupForAddSubAdmin}
            updatedState={updatedState}
            setUpdatedState={setUpdatedState}
          />
        )} */}
      </div>
    </div>
  );
};

export default SubAdmins;
