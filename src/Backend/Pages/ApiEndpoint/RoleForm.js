import axios from "axios";
import React, { useEffect, useState } from "react";
import { environmentVariables } from "../../../config/env.config";

import { ToastContainer, toast } from "react-toastify";

const RoleForm = ({ setShowRoleUpdateModal, editRoleObj }) => {
  const [roleName, setRoleName] = useState("");
  const [permissionData, setPermissionData] = useState([]);
  const [permissionEditData, setPermissionEditData] = useState([]);
  const [roleArr, setRoleArr] = useState([]);
  const [roleEditData, setRoleEditData] = useState({});
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
    let obj = {
      name: roleName,
      permissions: roleArr,
    };
    let url = `api/admin/role/add`;
    if (roleEditData && roleEditData.id) {
      obj.id=roleEditData.id
    }
    axios
      .post(`${environmentVariables?.apiUrl}${url}`, obj, {
        withCredentials: true,
      })
      .then((sol) => {
        toast.success(sol?.data?.message);
        setShowRoleUpdateModal(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
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
        onChange={(e) => setRoleName(e.target.value)}
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
      <button onClick={(e) => handleSubmit(e)}>Save</button>
    </div>
  );
};

export default RoleForm;
