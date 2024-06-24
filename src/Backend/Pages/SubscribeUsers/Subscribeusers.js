import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import SortIcon from "@material-ui/icons/ArrowDownward";
import "react-data-table-component-extensions/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import countryCodes from "../../../common/countryCodes.js";
import { Modal, Form, Button } from "react-bootstrap";
import { userContext } from "../../../context/userContext.js";
const Subscribeusers = () => {
  const [data, setData] = useState();
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState();
  const [zipcodeInput, setZipcodeInput] = useState("");
  const [countryCode, setCountryCode] = useState();
  const [zipcodeArray, setZipCodeArray] = useState([]);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const { userData } = useContext(userContext);

  const getAllSubcribeUsers = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/newsletter/get`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllSubcribeUsers();
  }, []);
  const tableExtensions = {
    export: false,
    print: false,
  };
  const columns = [
    {
      name: "Email",
      selector: (row) => row?.email,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      sortable: true,
    },
  ];
  const tableData = { columns, data: data };

  console.log("data", data);
  return (
    <div>
      {/* {userData?.role != "super_admin" ? (
        userData?.backendArr?.some(
          (item) => item?.name === "/api/admin/newsletter/add"
        ) && (
          <div className="mb-3">
            <button onClick={handleShow}>Add +</button>
          </div>
        )
      ) : (
        <div className="mb-3">
          <button onClick={handleShow}>Add +</button>
        </div>
      )} */}

      {/* {userData?.role != "super_admin" ? (
        userData?.backendArr?.some(
          (item) => item?.name === "/api/admin/newsletter/add"
        ) && (
          <div className="mb-3">
            <button onClick={handleShow}>Add +</button>
          </div>
        )
      ) : (
        <div className="mb-3">
          <button onClick={handleShow}>Add +</button>
        </div>
      )} */}

      <div>
        {/* {data &&
          data.map((val) => (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h5>Email : {val?.email}</h5>
                <p>Status : {val?.status}</p>
              </div>
            </>
          ))} */}
      </div>
      <div>
        <h4>Subscribed Users</h4>
        <DataTableExtensions
          {...tableExtensions}
          {...tableData}
          filterPlaceholder="Search data"
        >
          <DataTable
            columns={columns}
            data={data}
            noHeader
            defaultSortField="id"
            sortIcon={<SortIcon />}
            defaultSortAsc={true}
            pagination
            highlightOnHover
          />
        </DataTableExtensions>
      </div>
    </div>
  );
};

export default Subscribeusers;
