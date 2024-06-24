import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import SortIcon from "@material-ui/icons/ArrowDownward";
import "react-data-table-component-extensions/dist/index.css";
import { environmentVariables } from "../../../config/env.config.js";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import countryCodes from "../../../common/countryCodes.js";
import { Modal, Form, Button } from "react-bootstrap";
import { userContext } from "../../../context/userContext.js";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader.js";
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

const StudentDeliveryData = () => {
  const [data, setData] = useState();
  const [isSubmit, setIsSubmit] = useState(false);

  const [show, setShow] = useState(false);
  const [country, setCountry] = useState("");
  const [discount, setDiscount] = useState("");
  const [outForDeliveryDay, setOutForDeliveryDay] = useState("");
  const [deliveryCharges, setDeliveryCharges] = useState("");
  const [countryCode, setCountryCode] = useState();
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const { userData } = useContext(userContext);

  const tableExtensions = {
    export: false,
    print: false,
  };
  const handleEdit = (val) => {
    setCountryCode(val?.country_code);
    setCountry(val?.country);
    setDiscount(val?.discount);
    setDeliveryCharges(val?.delivery_charges);
    handleShow();
  };
  useEffect(() => {
    if (show == false) {
      setCountryCode("");
      setCountry("");
      setDiscount("");
      setOutForDeliveryDay("");
      setDeliveryCharges("");
    }
  }, [show]);

  const columns = [
    {
      name: "Country Name",
      selector: (row) => row?.country,
      sortable: true,
    },
    {
      name: "Country Code",
      selector: (row) => row?.country_code,
      sortable: true,
    },
    {
      name: "discount (in %)",
      selector: (row) => row?.discount,
      sortable: true,
    },
    {
      name: "Delivery charges",
      selector: (row) => row?.delivery_charges,
      sortable: true,
    },
    {
      name:
        userData?.role != "super_admin"
          ? userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/delivery/add"
            ) && "Actions"
          : "Actions",
      sortable: false,
      cell: (d) =>
        userData?.role != "super_admin" ? (
          userData?.backendArr?.some(
            (item) => item?.name === "/api/admin/delivery/add"
          ) && (
            <>
              {" "}
              <i
                style={{ width: "50px", cursor: "pointer" }}
                onClick={() => handleEdit(d)}
                className="fas fa-pen"
              ></i>
              <i
                style={{ width: "50px", cursor: "pointer" }}
                onClick={() => handleDelete(d.id)}
                className="fas fa-trash"
              ></i>
            </>
          )
        ) : (
          <>
            {" "}
            <i
              style={{ width: "50px", cursor: "pointer" }}
              onClick={() => handleEdit(d)}
              className="fas fa-pen"
            ></i>
            <i
              style={{ width: "50px", cursor: "pointer" }}
              onClick={() => handleDelete(d.id)}
              className="fas fa-trash"
            ></i>
          </>
        ),
    },
  ];
  const tableData = { columns, data: data };

  const getAll = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/delivery/getData`,
      withCredentials: true,
    };
    axios
      .request(config)
      .then((response) => {
        // console.log(response?.data?.data, "response?.data?.data");
        setData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure, you want to delete it?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: `${environmentVariables?.apiUrl}api/admin/delivery/delete?id=${id}`,
          withCredentials: true,
        };
        Swal.showLoading();
        axios
          .request(config)
          .then((response) => {
            getAll();
            toast.success("Deleted successfully");
            Swal.close();
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message);
            Swal.close();
          });
      }
    });
  };

  const handleChangeCountry = (e) => {
    setCountry(e.target.value);
    const countryCode = countryCodes.filter(
      (val) => val?.name == e.target.value
    );
    setCountryCode(countryCode[0]?.code);
  };
  const handleSubmit = (event) => {
    if (country == "") {
      toast.error("Country is mandatory");
      return;
    } else if (deliveryCharges == "") {
      toast.error("Delivery charges is mandatory");
      return;
    } else if (deliveryCharges < 0) {
      toast.error("Delivery charges cannot be negative");
      return;
    } else if (discount == "") {
      toast.error("Discount is mandatory");
      return;
    } else if (discount < 0) {
      toast.error("Discount cannot be negative");
      return;
    } else if (discount > 100) {
      toast.error("Discount cannot more than 100");
      return;
    }
    setIsSubmit(true);
    let data = {
      country,
      country_code: countryCode,
      discount,
      delivery_charges: deliveryCharges,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/delivery/add`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getAll();
        handleClose();
        toast.success(response?.data?.message || "Student Data added");
        setIsSubmit(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
        setIsSubmit(false);
      });
  };

  useEffect(() => {
    getAll();
  }, []);
  const handleDiscountChange = (event) => {
    const { value } = event.target;
    const numericValue = value.replace(/[^0-9]/g, "");

    setDiscount(numericValue);
  };
  const handleDeliveryChargesChange = (event) => {
    const { value } = event.target;
    const numericValue = value.replace(/[^0-9]/g, "");

    setDeliveryCharges(numericValue);
  };
  return (
    <div>
      {userData?.role == "super_admin" && (
        <div className="mb-3">
          <button className="add-button" onClick={handleShow}>
            Add Delivery Charges
          </button>
        </div>
      )}

      <div>
        <div>
          <h4>Student delivery data</h4>
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add / Update student delivery Charges</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Country</Form.Label>
              <Form.Select value={country} onChange={handleChangeCountry}>
                <option value="" disabled selected>
                  Select Country
                </option>
                {countryCodes.map((val) => (
                  <option value={val?.name}>{val?.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              {countryCodes.map((val) => {
                if (val?.name === country) {
                  return (
                    <>
                      <Form.Label>Country Code</Form.Label>{" "}
                      <Form.Control disabled value={val?.code} type="text" />
                    </>
                  );
                }
              })}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Discount (in %)</Form.Label>{" "}
              <Form.Control
                value={discount}
                onChange={handleDiscountChange}
                type="text"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Delivery charges</Form.Label>{" "}
              <Form.Control
                value={deliveryCharges}
                onChange={handleDeliveryChargesChange}
                type="text"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
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
    </div>
  );
};

export default StudentDeliveryData;
