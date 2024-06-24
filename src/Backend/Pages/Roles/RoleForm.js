import axios from "axios";
import React, { useEffect, useState } from "react";
import { environmentVariables } from "../../../config/env.config";

import { ToastContainer, toast } from "react-toastify";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";
import styled from "styled-components";

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

const RoleForm = ({ setShowRoleUpdateModal, editRoleObj }) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [permissionData, setPermissionData] = useState([]);
  const [permissionEditData, setPermissionEditData] = useState([]);
  const [roleArr, setRoleArr] = useState([]);
  const [roleEditData, setRoleEditData] = useState({});

  const handleRoleName = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setRoleName(alphanumericValue);
  };

  const handleFetch = async () => {
    axios
      .get(
        `${environmentVariables?.apiUrl}api/admin/permission/get_active_data`,
        {
          withCredentials: true,
        }
      )
      .then((sol) => {
        setPermissionData(sol?.data?.data);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    let obj = {
      name: roleName,
      permissions: roleArr,
    };
    let url = `api/admin/role/add`;
    if (roleEditData && roleEditData.id) {
      obj.id = roleEditData.id;
    }
    axios
      .post(`${environmentVariables?.apiUrl}${url}`, obj, {
        withCredentials: true,
      })
      .then((sol) => {
        toast.success(sol?.data?.message);
        setShowRoleUpdateModal(false);
        setIsSubmit(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsSubmit(false);
      });
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleCheckboxChange = (checked, data) => {
    let tempArr = [];
    if (roleArr && roleArr?.length) {
      tempArr = [...roleArr];
    }
    // return;
    if (checked == true) {
      tempArr.push(data?.id);
    } else {
      tempArr = tempArr.filter((el) => el != data?.id);
    }
    setRoleArr(tempArr);
  };

  useEffect(() => {
    if (editRoleObj && editRoleObj?.id) {
      setRoleName(editRoleObj?.name);
      setRoleArr(editRoleObj?.permissions);
      setRoleEditData(editRoleObj);
    }
  }, [editRoleObj]);
  return (
    <div>
      <input
        type="text"
        value={roleName}
        onChange={handleRoleName}
        placeholder="Role Name"
      />
      <div>
        {permissionData.map((nestedArray, index) => (
          <div key={index}>
            {nestedArray.map((item, subIndex) => (
              <div key={subIndex}>
                <span>
                  <input
                    type="checkbox"
                    checked={roleArr.includes(item?.id)}
                    onChange={(e) =>
                      handleCheckboxChange(e.target.checked, item)
                    }
                  />
                  {item?.name}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <AddCategoryButton
        variant="primary"
        onClick={(e) => handleSubmit(e)}
        disabled={isSubmit}
      >
        {isSubmit ? <ButtonLoader size={30} /> : "Save Changes"}
      </AddCategoryButton>
    </div>
  );
};

export default RoleForm;
