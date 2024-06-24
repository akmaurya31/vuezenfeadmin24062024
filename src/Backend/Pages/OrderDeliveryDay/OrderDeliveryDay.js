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

const OrderDeliveryDay = () => {
  // const renderTooltip = (props) => (
  //   <Tooltip id="button-tooltip" {...props}>
  //     Remove
  //   </Tooltip>
  // );
  const [data, setData] = useState();
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState("");
  const [shippingDayInput, setShippingDayInput] = useState("");
  const [deliveryDay, setDeliveryDay] = useState("");
  const [outForDeliveryDay, setOutForDeliveryDay] = useState("");
  const [normalDeliveryCharges, setNormalDeliveryCharges] = useState("");
  const [countryCode, setCountryCode] = useState();
  // const [zipcodeArray, setZipCodeArray] = useState([]);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const { userData } = useContext(userContext);

  const tableExtensions = {
    export: false,
    print: false,
  };
  const handleEditCoupon = (val) => {
    setCountryCode(val?.country_code);
    setCountry(val?.country);
    setShippingDayInput(val?.shipping_day);
    setDeliveryDay(val?.delivery_day);
    setOutForDeliveryDay(val?.out_for_delivery_day);
    setNormalDeliveryCharges(val?.normal_delivery_charges);
    handleShow();
  };
  useEffect(() => {
    if (show == false) {
      setCountryCode("");
      setCountry("");
      setShippingDayInput("");
      setDeliveryDay("");
      setOutForDeliveryDay("");
      setNormalDeliveryCharges("");
    }
  }, [show]);
  const columns = [
    {
      name: "Country Name",
      selector: (row) => row?.country,
      sortable: true,
    },
    {
      name: "Delivery Day",
      selector: (row) => row?.delivery_day,
      sortable: true,
    },
    {
      name: "Shipping Day",
      selector: (row) => row?.shipping_day,
      sortable: true,
    },
    {
      name: "Country Code",
      selector: (row) => row?.country_code,
      sortable: true,
    },
    {
      name: "Out for delivery day",
      selector: (row) => row?.out_for_delivery_day,
      sortable: true,
    },
    {
      name: "Normal delivery charges",
      selector: (row) => row?.normal_delivery_charges,
      sortable: true,
    },
    {
      name:
        userData?.role != "super_admin"
          ? userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/order/change_delivery_days"
            ) && "Actions"
          : "Actions",
      sortable: false,
      cell: (d) =>
        userData?.role != "super_admin" ? (
          userData?.backendArr?.some(
            (item) => item?.name === "/api/admin/order/change_delivery_days"
          ) && (
            <>
              {" "}
              <i
                style={{ width: "50px", cursor: "pointer" }}
                onClick={() => handleEditCoupon(d)}
                className="fas fa-pen"
              ></i>
              <i
                style={{ width: "50px", cursor: "pointer" }}
                onClick={() => handleDeleteCoupon(d.id)}
                className="fas fa-trash"
              ></i>
            </>
          )
        ) : (
          <>
            {" "}
            <i
              style={{ width: "50px", cursor: "pointer" }}
              onClick={() => handleEditCoupon(d)}
              className="fas fa-pen"
            ></i>
            <i
              style={{ width: "50px", cursor: "pointer" }}
              onClick={() => handleDeleteCoupon(d.id)}
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
      url: `${environmentVariables?.apiUrl}api/admin/order/get_delivery_day_data`,
      withCredentials: true,
    };
    axios
      .request(config)
      .then((response) => {
        setData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteCoupon = (id) => {
    Swal.fire({
      title: "Are you sure, you want to delete it?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: `${environmentVariables?.apiUrl}api/admin/order/delete_delivery_day_data?id=${id}`,
          withCredentials: true,
        };

        axios
          .request(config)
          .then((response) => {
            getAll();
            toast.success("Deleted successfully");
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message);
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
  // const handleEditCountry = (val) => {
  //   setCountryCode(val?.country_code);
  //   setCountry(val?.country);
  //   setZipCodeArray(val?.zipcodes);
  //   handleShow();
  // };
  const handleSubmit = (event) => {
    if (country == "") {
      toast.error("Country is mandatory");
      return;
    } else if (shippingDayInput == "") {
      toast.error("Shipping day is mandatory");
      return;
    } else if (shippingDayInput < 0) {
      toast.error("Shipping day cannot be negative");
      return;
    } else if (deliveryDay == "") {
      toast.error("Delivery day is mandatory");
      return;
    } else if (deliveryDay < 0) {
      toast.error("Delivery day cannot be negative");
      return;
    } else if (outForDeliveryDay == "") {
      toast.error("Out for delivery day is mandatory");
      return;
    } else if (outForDeliveryDay < 0) {
      toast.error("Out for delivery day cannot be negative");
      return;
    } else if (normalDeliveryCharges == "") {
      toast.error("Normal delivery charges is mandatory");
      return;
    } else if (normalDeliveryCharges < 0) {
      toast.error("Normal delivery charges cannot be negative");
      return;
    }
    let data = {
      country,
      country_code: countryCode,
      delivery_day: deliveryDay,
      shipping_day: shippingDayInput,
      out_for_delivery_day: outForDeliveryDay,
      normal_delivery_charges: normalDeliveryCharges,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/order/change_delivery_days`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getAll();
        handleClose();
        toast.success(response?.data?.message || "Value added");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  // const handleChangeStatus = (val) => {
  //   let data = {
  //     id: `${val?.id}`,
  //     status: val?.status == "active" ? "inactive" : "active",
  //   };

  //   let config = {
  //     method: "put",
  //     maxBodyLength: Infinity,
  //     url: `${environmentVariables?.apiUrl}api/admin/zip_code/edit_status_zipcodes`,
  //     withCredentials: true,
  //     data: data,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       getAll();
  //     })
  //     .catch((error) => {
  //       toast.error(error?.response?.data?.message || error?.message);
  //     });
  // };
  useEffect(() => {
    getAll();
  }, []);
  // const handleKeyDown = (event) => {
  //   if (event.key === "Enter") {
  //     setZipCodeArray((prev) => [...prev, zipcodeInput]);
  //     setZipcodeInput("");
  //     event.preventDefault();
  //   }
  // // };
  // const handleRemoveZipCode = (val) => {
  //   const zipcodefilter = zipcodeArray.filter((value) => value != val);
  //   setZipCodeArray(zipcodefilter);
  // };
  return (
    <div>
      {userData?.role == "super_admin" && (
        <div className="mb-3">
          <button className="add-button" onClick={handleShow}>Add order date</button>
        </div>
      )}

      <div>
        <div>
          <h4>Order Delivery Data</h4>
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
        {/* {data &&
          data.map((val, index) => (
            <>
              <div key={index}>
                <h5>{val?.country_code}</h5>
                delivery_day
                <div>{val?.delivery_day}</div>
              </div>
              {userData?.role != "super_admin" ? (
                userData?.backendArr?.some(
                  (item) => item?.name === "/api/admin/zip_code/add_zipcodes"
                ) && (
                  <div>
                    <button onClick={() => handleEditCountry(val)}>Edit</button>
                    <Form.Check
                      type="switch"
                      checked={val?.status == "active"}
                      onClick={() => handleChangeStatus(val)}
                    />
                  </div>
                )
              ) : (
                <div>
                  <button onClick={() => handleEditCountry(val)}>Edit</button>
                  <Form.Check
                    type="switch"
                    checked={val?.status == "active"}
                    onClick={() => handleChangeStatus(val)}
                  />
                </div>
              )}
            </>
          ))} */}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add / Update order delivery date</Modal.Title>
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
              <Form.Label>Shipping day</Form.Label>{" "}
              <Form.Control
                value={shippingDayInput}
                onChange={(e) => setShippingDayInput(e.target.value)}
                type="number"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>delivery day</Form.Label>{" "}
              <Form.Control
                value={deliveryDay}
                onChange={(e) => setDeliveryDay(e.target.value)}
                type="number"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Out for delivery day</Form.Label>{" "}
              <Form.Control
                value={outForDeliveryDay}
                onChange={(e) => setOutForDeliveryDay(e.target.value)}
                type="number"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Normal delivery charges</Form.Label>{" "}
              <Form.Control
                value={normalDeliveryCharges}
                onChange={(e) => setNormalDeliveryCharges(e.target.value)}
                type="number"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderDeliveryDay;

// import React from "react";

// const CountryZipcodes = () => {
//   return <div></div>;
// };

// export default CountryZipcodes;
