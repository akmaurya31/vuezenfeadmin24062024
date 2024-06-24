import React, { useContext, useEffect, useState } from "react";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import SortIcon from "@material-ui/icons/ArrowDownward";
import DatePicker from "react-datepicker";
import "react-data-table-component-extensions/dist/index.css";
import "react-datepicker/dist/react-datepicker.css";

import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { userContext } from "../../../context/userContext";
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

const Orders = () => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [ordersData, setOrdersData] = useState([]);
  const [downloadOptionsPopUp, setDownloadOptionsPopUp] = useState(false);
  const [show, setShow] = useState(false);
  const [countries, setCountries] = useState("");
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState();
  const [shippingDate, setShippingDate] = useState();
  const [filterOption, setFilterOption] = useState();
  const [outForDeliveryDate, setOutForDeliveryDate] = useState();
  const [orderId, setOrderId] = useState();
  const [country, setCountry] = useState("");
  const { userData } = useContext(userContext);
  const navigate = useNavigate(null);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const downloadInvoice = (orderId) => {
    axios
      .get(
        `${environmentVariables?.apiUrl}api/shipping/download/invoice/${orderId}`
      )
      .then(async (response) => {
        const a = document.createElement("a");
        a.href = response?.data?.data?.file_name;
        a.target = "_blank";
        a.download = `invoice-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const downloadManifest = (orderId) => {
    axios
      .get(
        `${environmentVariables?.apiUrl}api/shipping/download/manifest/${orderId}`
      )
      .then(async (response) => {
        const a = document.createElement("a");
        a.href = response?.data?.data?.file_name;
        a.target = "_blank";
        a.download = `manifest-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const downloadLabel = (orderId) => {
    axios
      .get(
        `${environmentVariables?.apiUrl}api/shipping/download/label/${orderId}`
      )
      .then(async (response) => {
        const a = document.createElement("a");
        a.href = response?.data?.data?.file_name;
        a.target = "_blank";
        a.download = `label-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const resetFilterData = () => {
    setStartDateFilter(null);
    setEndDateFilter(null);
    setCountry("");
    setFilterOption("");
  };
  const handleSubmit = () => {
    setIsSubmit(true);
    let data = {
      order_id: orderId,
      delivery_date: deliveryDate,
      shipping_date: shippingDate,
      out_for_delivery_date: outForDeliveryDate,
    };

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/order/update_delivery_date`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        handleClose();
        setOrderId("");
        setDeliveryDate("");
        setOutForDeliveryDate("");
        setShippingDate("");
        getAllOrders();
        toast.success("Dates updated");
        setIsSubmit(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
        setIsSubmit(false);
      });
  };
  const handleEditOrder = (value) => {
    console.log(
      "value",
      value.delivery_date,
      value.delivery_date.split("T")[0]
    );
    setDeliveryDate(value.delivery_date.split("T")[0]);
    setOrderId(value.order_id);
    setOutForDeliveryDate(value.out_for_delivery_date.split("T")[0]);
    setShippingDate(value.shipping_date.split("T")[0]);
    handleShow();
  };
  const columns = [
    {
      name: "Order id",
      selector: (row) => row.order_id,
    },
    {
      name: "Buyer Name",
      selector: (row) => row.user.name,

      width: "150px",
    },
    {
      name: "Subtotal",
      selector: (row) => {
        // console.log("Row object in Subtotal field:", row);
        if (row?.is_student_info_id && row?.card_data == null) {
          if (Number(row?.sub_total) > Number(row?.delivery_charges)) {
            return Number(row?.sub_total) - Number(row?.delivery_charges);
          } else {
            return Number(row?.delivery_charges) - Number(row?.sub_total);
          }
        } else if (row?.is_student_info_id && row?.card_data != null) {
          if (Number(row?.sub_total) > Number(row?.delivery_charges)) {
            return Number(row?.sub_total) - Number(row?.delivery_charges);
          } else {
            return Number(row?.delivery_charges) - Number(row?.sub_total);
          }
        } else {
          return row.sub_total;
        }
      },

      width: "80px",
    },
    {
      name: "Payment Method",
      selector: (row) => row.payment_method,
    },
    {
      name: "Payment Status",
      selector: (row) => row.payment_status,
    },
    {
      name: "Txn Id",
      selector: (row) => row.txn_id,
    },
    {
      name: "Order Status",
      selector: (row) => row.status,
    },
    {
      name: "Order Date",
      selector: (row) => row.order_date,
      cell: (d) => {
        const dateObj = new Date(d.order_date);
        const convertedDate = dateObj.toISOString().split("T")[0];
        return convertedDate;
      },
    },
    {
      name: "Delivery Date",
      selector: (row) => row.delivery_date,
      cell: (d) => {
        const dateObj = new Date(d.delivery_date);
        const convertedDate = dateObj.toISOString().split("T")[0];
        return convertedDate;
      },
    },
    {
      name: "Shipping Date",
      selector: (row) => row.shipping_date,
      cell: (d) => {
        const dateObj = new Date(d.shipping_date);
        const convertedDate = dateObj.toISOString().split("T")[0];
        return convertedDate;
      },
    },
    {
      name: "Out for delivery Date",
      selector: (row) => row.out_for_delivery_date,
      cell: (d) => {
        const dateObj = new Date(d.out_for_delivery_date);
        const convertedDate = dateObj.toISOString().split("T")[0];
        return convertedDate;
      },
    },
    {
      name: "Delivery Instructions",
      selector: (row) => row.delivery_instructions,
    },
    {
      name: "Zipcode",
      selector: (row) => row.user_address.zipcode,
    },
    {
      name: "Actions",
      sortable: false,
      cell: (d) => (
        <>
          {userData?.role != "super_admin" ? (
            userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/order/update_delivery_date"
            ) && (
              <div style={{ width: "50px", margin: "0 10px" }}>
                {" "}
                <i
                  onClick={() => handleEditOrder(d)}
                  style={{ cursor: "pointer" }}
                  className="fas fa-pen"
                ></i>
              </div>
            )
          ) : (
            <div style={{ width: "50px", margin: "0 10px" }}>
              <i
                onClick={() => handleEditOrder(d)}
                style={{ cursor: "pointer" }}
                className="fas fa-pen"
              ></i>
            </div>
          )}

          <div style={{ width: "50px", margin: "0 10px" }}>
            {" "}
            <i
              onClick={() => navigate(`/orders/${d.order_id}`)}
              style={{ cursor: "pointer" }}
              className="fas fa-eye"
            ></i>
          </div>
          <div
            style={{ width: "50px", margin: "0 10px", position: "relative" }}
          >
            <i
              onClick={(e) => {
                e.stopPropagation();
                downloadOptionsPopUp == false
                  ? setDownloadOptionsPopUp(d.id)
                  : setDownloadOptionsPopUp(false);
              }}
              style={{ cursor: "pointer" }}
              className="fas fa-ellipsis-vertical"
            ></i>
            {downloadOptionsPopUp == d.id && (
              <div
                style={{
                  position: "absolute",
                  width: "140px",
                  right: "0",
                  backgroundColor: "#03213f",
                  color: "white",
                  zIndex: "1",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <div
                  onClick={() => downloadInvoice(d.order_id)}
                  style={{ margin: "10px 0", cursor: "pointer" }}
                >
                  Download Invoice
                </div>
                <div
                  onClick={() => downloadManifest(d.order_id)}
                  style={{ margin: "10px 0", cursor: "pointer" }}
                >
                  Download Manifest
                </div>
                <div
                  onClick={() => downloadLabel(d.order_id)}
                  style={{ margin: "10px 0", cursor: "pointer" }}
                >
                  Download Label
                </div>
              </div>
            )}
          </div>
        </>
      ),
    },
  ];

  const tableData = { columns, data: ordersData };

  const tableExtensions = {
    export: false,
    print: false,
  };
  const getCountries = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/zip_code/get_active`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setCountries(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllOrders = () => {
    let filters = "?";
    if (filterOption == "today") {
      filters = "?today=true&";
    } else if (filterOption == "week") {
      filters = "?this_week=true&";
    } else if (filterOption == "month") {
      filters = "?this_month=true&";
    } else if (filterOption == "year") {
      filters = "?this_year=true&";
    }
    if (country !== "") {
      filters += `country_code=${country}&`;
    }
    if (startDateFilter !== null && endDateFilter !== null) {
      filters += `start_date=${startDateFilter}&end_date=${endDateFilter}`;
    }
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/order/get_filtered_orders${filters}`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setOrdersData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getCountries();
  }, []);
  useEffect(() => {
    getAllOrders();
  }, [filterOption, country, startDateFilter, endDateFilter]);
  return (
    <div onClick={() => setDownloadOptionsPopUp(false)}>
      <div className="d-flex align-items-center gap-3">
        <h4>Filters</h4>

        <ButtonGroup>
          <ToggleButton
            onClick={() => setFilterOption("today")}
            style={
              filterOption === "today"
                ? { backgroundColor: "white", color: "black" }
                : {}
            }
          >
            Today
          </ToggleButton>
          <ToggleButton
            onClick={() => setFilterOption("week")}
            style={
              filterOption === "week"
                ? { backgroundColor: "white", color: "black" }
                : {}
            }
          >
            This Week
          </ToggleButton>
          <ToggleButton
            onClick={() => setFilterOption("month")}
            style={
              filterOption === "month"
                ? { backgroundColor: "white", color: "black" }
                : {}
            }
          >
            This Month
          </ToggleButton>
          <ToggleButton
            onClick={() => setFilterOption("year")}
            style={
              filterOption === "year"
                ? { backgroundColor: "white", color: "black" }
                : {}
            }
          >
            This Year
          </ToggleButton>
        </ButtonGroup>
      </div>
      <div className="d-flex gap-3 mt-3">
        <div>
          <Form.Select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option disabled selected value="">
              Select Country
            </option>
            {countries &&
              countries.map((val) => (
                <option
                  style={{ textTransform: "capitalize" }}
                  value={val?.country_code}
                >
                  {val?.country}
                </option>
              ))}
          </Form.Select>
        </div>
        <div className="d-flex align-items-center">
          <DatePicker
            selected={startDateFilter}
            onChange={(date) => setStartDateFilter(date)}
            className="form-control"
            placeholderText="start date"
          />
          <DatePicker
            selected={endDateFilter}
            onChange={(date) => setEndDateFilter(date)}
            className="form-control"
            placeholderText="end date"
          />
        </div>
        <div>
          <Button onClick={resetFilterData}>Reset</Button>
        </div>
      </div>

      <div>
        <h4>Orders</h4>
        <DataTableExtensions
          {...tableExtensions}
          {...tableData}
          filterPlaceholder="Search Orders"
        >
          <DataTable
            columns={columns}
            data={ordersData}
            noHeader
            defaultSortField="id"
            sortIcon={<SortIcon />}
            defaultSortAsc={true}
            pagination
            highlightOnHover
          />
        </DataTableExtensions>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Dates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Shipping Date</Form.Label>
              <Form.Control
                value={shippingDate}
                onChange={(e) => setShippingDate(e.target.value)}
                type="Date"
                min={shippingDate}
                max={outForDeliveryDate}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Out For Delivery Date</Form.Label>
              <Form.Control
                value={outForDeliveryDate}
                onChange={(e) => setOutForDeliveryDate(e.target.value)}
                type="Date"
                min={shippingDate}
                max={deliveryDate}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Delivery Date</Form.Label>
              <Form.Control
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                type="Date"
                min={outForDeliveryDate}
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

export default Orders;
