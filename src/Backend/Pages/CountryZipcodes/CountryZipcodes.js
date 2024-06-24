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

const EditButton = styled.button`
    font-size: 18px;
    padding: 15px 20px;
    border: 1px solid #0000001f;
    background-color: #fff;
    color: #000;
    cursor: pointer;
    width: 200px;
    margin-bottom: 40px;
    margin-top: 20px;
    border-radius: 5px;
    &:hover{
      background-color: lightgray;
    }
`;

const CountryZipcodes = () => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Remove
    </Tooltip>
  );
  const [isSubmit, setIsSubmit] = useState(false);

  const [data, setData] = useState();
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState();
  const [zipcodeInput, setZipcodeInput] = useState("");
  const [taxName, setTaxName] = useState("");
  const [taxValue, setTaxValue] = useState("");
  const [countryCode, setCountryCode] = useState();
  const [currencySymbol, setCurrencySymbol] = useState();
  const [zipcodeArray, setZipCodeArray] = useState([]);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const { userData } = useContext(userContext);
  const getAllCountries = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/zip_code/get`,
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
          url: `${environmentVariables?.apiUrl}api/admin/coupons/delete_coupon_by_id?id=${id}`,
          withCredentials: true,
        };

        axios
          .request(config)
          .then((response) => {
            getAllCoupons();
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
    if (countryCode[0]?.code == "IN") {
      setCurrencySymbol("₹");
    } else if (countryCode[0]?.code == "US") {
      setCurrencySymbol("$");
    } else if (countryCode[0]?.code == "AE") {
      setCurrencySymbol("د.إ");
    } else {
      setCurrencySymbol("₹");
    }
  };
  const handleEditCountry = (val) => {
    setCountryCode(val?.country_code);
    setCountry(val?.country);
    setZipCodeArray(val?.zipcodes);
    setCurrencySymbol(val?.currency_symbol);
    setTaxName(val?.tax_name);
    setTaxValue(val?.tax_value);
    handleShow();
  };
  const handleSubmit = (event) => {
    setIsSubmit(true);
    let data = {
      country_code: countryCode,
      country: country,
      zipcodes: zipcodeArray,
      status: "active",
      currency_symbol: currencySymbol,
      tax_value: taxValue,
      tax_name: taxName,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/zip_code/add_zipcodes`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getAllCountries();
        toast.success("Values Added");
        handleClose();
        setIsSubmit(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
        setIsSubmit(false);
      });
  };
  const handleChangeStatus = (val) => {
    let data = {
      id: `${val?.id}`,
      status: val?.status == "active" ? "inactive" : "active",
    };

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/zip_code/edit_status_zipcodes`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getAllCountries();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  useEffect(() => {
    getAllCountries();
  }, []);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setZipCodeArray((prev) => [...prev, zipcodeInput]);
      setZipcodeInput("");
      event.preventDefault();
    }
  };
  const handleRemoveZipCode = (val) => {
    const zipcodefilter = zipcodeArray.filter((value) => value != val);
    setZipCodeArray(zipcodefilter);
  };

  const handleTaxNameChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setTaxName(alphanumericValue);
  };
  const handleTaxValueChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    setTaxValue(alphanumericValue);
  };
  const handleZipCodeChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    setZipcodeInput(alphanumericValue);
  };
  return (
    <div>
      {userData?.role != "super_admin" ? (
        userData?.backendArr?.some(
          (item) => item?.name === "/api/admin/zip_code/add_zipcodes"
        ) && (
          <div className="mb-3">
            <button
              className="add-button"
              onClick={() => {
                handleShow();
                setCountryCode();
                setCountry();
                setZipCodeArray([]);
                setCurrencySymbol();
                setTaxName("");
                setTaxValue("");
              }}
            >
              Add Zipcode
            </button>
          </div>
        )
      ) : (
        <div className="mb-3">
          <button
            className="add-button"
            onClick={() => {
              handleShow();
              setCountryCode();
              setCountry();
              setZipCodeArray([]);
              setCurrencySymbol();
              setTaxName("");
              setTaxValue("");
            }}
          >
            Add Zipcode
          </button>
        </div>
      )}

      <div>
        {data &&
          data.map((val) => (
            <>
              <div>
                <h5 style={{fontSize:"22px", fontWeight:"400"}}>{val?.country}</h5>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {val?.zipcodes &&
                    val?.zipcodes.map((val1) => (
                      <div className="zipcodes-style">{val1}</div>
                    ))}
                </div>
              </div>
              {userData?.role != "super_admin" ? (
                userData?.backendArr?.some(
                  (item) => item?.name === "/api/admin/zip_code/add_zipcodes"
                ) && (
                  <div className="button-switch">
                    <EditButton
                      className="ui-edit-button"
                      onClick={() => handleEditCountry(val)}
                    >
                      Edit
                    </EditButton>
                    <Form.Check
                      type="switch"
                      checked={val?.status == "active"}
                      onClick={() => handleChangeStatus(val)}
                    />
                  </div>
                )
              ) : (
                <div className="button-switch">
                  <EditButton
                    // className="ui-edit-button"
                    onClick={() => handleEditCountry(val)}
                  >
                    Edit
                  </EditButton>
                  <Form.Check
                    type="switch"
                    checked={val?.status == "active"}
                    onClick={() => handleChangeStatus(val)}
                  />
                </div>
              )}
            </>
          ))}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Update Country Zipcode</Modal.Title>
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
              <Form.Label>Tax Name</Form.Label>{" "}
              <Form.Control
                value={taxName}
                onChange={handleTaxNameChange}
                onKeyDown={handleKeyDown}
                type="text"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tax Value</Form.Label>{" "}
              <Form.Control
                value={taxValue}
                onChange={handleTaxValueChange}
                onKeyDown={handleKeyDown}
                type="text"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Zip Code</Form.Label>{" "}
              <Form.Control
                value={zipcodeInput}
                onChange={handleZipCodeChange}
                onKeyDown={handleKeyDown}
                type="text"
              />
            </Form.Group>
          </Form>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {zipcodeArray &&
              zipcodeArray.map((val) => (
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <div
                    onClick={() => handleRemoveZipCode(val)}
                    style={{
                      cursor: "pointer",
                      padding: "0 5px",
                      border: "1px solid black",
                    }}
                  >
                    {val}
                  </div>
                </OverlayTrigger>
              ))}
          </div>
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

export default CountryZipcodes;

// import React from "react";

// const CountryZipcodes = () => {
//   return <div></div>;
// };

// export default CountryZipcodes;
