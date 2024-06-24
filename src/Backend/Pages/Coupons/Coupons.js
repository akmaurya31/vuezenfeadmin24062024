import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import SortIcon from "@material-ui/icons/ArrowDownward";
import "react-data-table-component-extensions/dist/index.css";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import countryCodes from "../../../common/countryCodes";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
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

const Coupons = () => {
  const { userData } = useContext(userContext);
  const [isSubmit, setIsSubmit] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEditCoupon = (val) => {
    console.log(val, "Vallllll ");
    setEditId(val?.id);
    setCountryCode(val?.country);
    const filterCountry = countryCodes.filter(
      (value) => value?.code == val?.country
    );
    setCountry(filterCountry[0]?.name);
    setCouponName(val?.name);
    setCouponType(val?.type);
    setCouponCode(val?.code);
    setCategoryId(val?.category_id);
    let fetchCat = categoriesData?.categories?.find(
      (el) => el?.id == val?.category_id
    );
    setCategoryName(fetchCat?.title);
    setCouponValue(val?.value);
    const formattedStartDate = formatDate(val?.start_date);
    const formatEndDate = formatDate(val?.expired_date);
    setStartDate(formattedStartDate);
    setExpiryDate(formatEndDate);
    setLimit(val?.limit);
    setMinPurchase(val?.min_purchase || val?.buy_product);
    setMaxPurchase(val?.max_purchase || val?.get_product);
    setMaxUsesPerUser(val?.max_uses_per_user);
    setIsForNewUsers(val?.new_user == "active" ? true : false);
    setCouponStatus(val?.status == "active" ? true : false);
    handleShow();
  };
  const resetData = () => {
    setCountry("");
    setEditId("");
    setCountryCode("");
    setCouponName("");
    setCouponType("");
    setCouponCode("");
    setCouponValue("");
    setStartDate("");
    setMaxUsesPerUser(1);
    setExpiryDate("");
    setMinPurchase("");
    setMaxPurchase("");
    setLimit("");
  };
  const handleSubmit = () => {
    setIsSubmit(true);
    let data = {
      name: couponName,
      code: couponCode,
      start_date: startDate,
      expired_date: expiryDate,
      limit: `${limit}`,
      country: countryCode,
      status: couponStatus == true ? "active" : "inactive",
      max_uses_per_user: maxUsesPerUser,
      type: couponType,
      new_user: isForNewUsers == true ? "active" : "inactive",
    };
    if (couponType == "buy_get") {
      data.buy_product = minPurchase;
      data.get_product = maxPurchase;
      data.min_purchase = null;
      data.max_purchase = null;
      data.value = null;
      data.category_id = categoryId;
    } else {
      data.min_purchase = minPurchase;
      data.max_purchase = maxPurchase;
      data.buy_product = null;
      data.get_product = null;
      data.value = couponValue;
    }
    // buy_product: buy,
    // get_product: get,
    console.log(couponValue, minPurchase);
    if (Number(couponValue) >= Number(minPurchase)) {
      toast.error("Discount can not be more than minimum purchase");
      setIsSubmit(false);
    } else {
      if (couponType === "percent" && couponValue > 100) {
        setErrorMessage("Coupon value must be less than or equal to 100%");
        setIsSubmit(false);
      } else {
        setErrorMessage("");
        let axiosMethod = "post";
        console.log("data val", data);
        let axiosUrl = `${environmentVariables?.apiUrl}api/admin/coupons/add_coupons`;
        if (editId != "") {
          data.id = editId;
          axiosMethod = "put";
          axiosUrl = `${environmentVariables?.apiUrl}api/admin/coupons/update_coupons`;
        }
        let config = {
          method: axiosMethod,
          maxBodyLength: Infinity,
          url: axiosUrl,
          withCredentials: true,
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            getAllCoupons();
            resetData();
            handleClose();
            setIsSubmit(false);
            toast.success("Coupon Added");
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || error?.message);
            setIsSubmit(false);
          });
      }
    }
  };
  const handleDeleteCoupon = (id) => {
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
          url: `${environmentVariables?.apiUrl}api/admin/coupons/delete_coupon_by_id?id=${id}`,
          withCredentials: true,
        };
        Swal.showLoading();

        axios
          .request(config)
          .then((response) => {
            getAllCoupons();
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
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
      width: "150px",
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      width: "80px",
    },
    {
      name: "Value",
      selector: (row) => row.value,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.start_date,
      sortable: true,
      cell: (d) => {
        const dateObj = new Date(d.start_date);
        const convertedDate = dateObj.toISOString().split("T")[0];
        return convertedDate;
      },
    },
    {
      name: "Expiry Date",
      selector: (row) => row.expired_date,
      sortable: true,
      cell: (d) => {
        const dateObj = new Date(d.expired_date);
        const convertedDate = dateObj.toISOString().split("T")[0];
        return convertedDate;
      },
    },
    {
      name: "Min Purchase",
      selector: (row) => row.min_purchase,
      sortable: true,
    },
    {
      name: "Max Purchase",
      selector: (row) => row.max_purchase,
      sortable: true,
    },
    {
      name: "Limit",
      selector: (row) => row.limit,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
    },
    {
      name:
        userData?.role != "super_admin"
          ? userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/coupons/add_coupons"
            ) && "Actions"
          : "Actions",
      sortable: false,
      cell: (d) =>
        userData?.role != "super_admin" ? (
          userData?.backendArr?.some(
            (item) => item?.name === "/api/admin/coupons/add_coupons"
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

  const tableExtensions = {
    export: false,
    print: false,
  };
  const [data, setData] = useState();
  const [categoriesData, setCategoriesData] = useState([]);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [country, setCountry] = useState("");
  const [couponName, setCouponName] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState("");
  const [couponStatus, setCouponStatus] = useState(true);
  const [isForNewUsers, setIsForNewUsers] = useState(true);
  const [couponValue, setCouponValue] = useState("");
  const [startDate, setStartDate] = useState();
  const [expiryDate, setExpiryDate] = useState();
  const [minPurchase, setMinPurchase] = useState();
  const [maxPurchase, setMaxPurchase] = useState();
  const [buy, setBuy] = useState();
  const [get, setGet] = useState();
  const [limit, setLimit] = useState();
  const [maxUsesPerUser, setMaxUsesPerUser] = useState(1);
  const [countryCode, setCountryCode] = useState("");
  const [editId, setEditId] = useState("");
  const handleClose = () => setShow(false);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("Select category");
  const [errorMessage, setErrorMessage] = useState("");

  const tableData = { columns, data: data };
  const handleChangeCountry = (e) => {
    setCountry(e.target.value);
    const countryCode = countryCodes.filter(
      (val) => val?.name == e.target.value
    );
    setCountryCode(countryCode[0]?.code);
  };
  useEffect(() => {
    if (show == false) {
      resetData();
    }
  }, [show]);
  const getAllCoupons = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/coupons/get_all_coupons`,
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
  const getCategoriesData = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/get_category_for_admin`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data.data, "response.data.data");
        setCategoriesData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleAddCoupon = () => {
    handleShow();
  };
  useEffect(() => {
    getAllCoupons();
    getCategoriesData();
  }, []);
  useEffect(() => {
    if (couponType == "buy_get") {
      setCouponValue();
    }
  }, [couponType]);
  const handleStatusChangeForRole = () => {
    setCouponStatus(!couponStatus);
  };

  const handleCouponNameChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setCouponName(alphanumericValue);
  };
  const handleCouponCodeChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setCouponCode(alphanumericValue);
  };
  const handleMinPriceChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    setMinPurchase(alphanumericValue);
  };
  const handleMaxPriceChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    setMaxPurchase(alphanumericValue);
  };
  const handleLimitChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    setLimit(alphanumericValue);
  };
  const handleMaxUsesPerUserChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    setMaxUsesPerUser(alphanumericValue);
  };
  const handleCouponValueChange = (event) => {
    const { value } = event.target;
    const numericValue = value.replace(/[^0-9]/g, "");

    if (couponType === "percent" && numericValue > 100) {
      setErrorMessage("Coupon value must be less than or equal to 100%");
    } else {
      setErrorMessage("");
    }

    setCouponValue(numericValue);
  };

  return (
    <div>
      {userData?.role != "super_admin" ? (
        userData?.backendArr?.some(
          (item) => item?.name === "/api/admin/coupons/add_coupons"
        ) && (
          <div className="mb-3" style={{ width: "50%" }}>
            <button className="add-button" onClick={handleAddCoupon}>
              Add Coupon +
            </button>
          </div>
        )
      ) : (
        <div className="mb-3" style={{ width: "50%" }}>
          <button className="add-button" onClick={handleAddCoupon}>
            Add Coupon +
          </button>
        </div>
      )}

      <div>
        <h4>Coupons</h4>
        <DataTableExtensions
          {...tableExtensions}
          {...tableData}
          filterPlaceholder="Search Coupons"
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add / Edit Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* <Form.Group className="mb-3" style={{width:"50%"}} controlId="exampleForm.ControlInput1">
              <Form.Label>Country</Form.Label>
              <Form.Control type="text" />
            </Form.Group> */}
            <div className="d-flex">
              <Form.Group
                className="mb-3"
                style={{ width: "50%" }}
                controlId="exampleForm.ControlInput1"
              >
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
              <Form.Group
                className="mb-3"
                style={{ width: "50%" }}
                controlId="exampleForm.ControlInput1"
              >
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
            </div>
            <div className="d-flex">
              <Form.Group
                className="mb-3"
                style={{ width: "50%" }}
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={couponName}
                  onChange={handleCouponNameChange}
                  type="text"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                style={{ width: "50%" }}
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Code</Form.Label>
                <Form.Control
                  value={couponCode}
                  onChange={handleCouponCodeChange}
                  type="text"
                />
              </Form.Group>
            </div>
            <div className="d-flex">
              <Form.Group
                className="mb-3"
                style={{ width: "50%" }}
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Type</Form.Label>
                <Form.Select
                  onChange={(e) => setCouponType(e.target.value)}
                  value={couponType}
                >
                  <option value="" disabled selected>
                    Select Type
                  </option>
                  <option value="fixed">Fixed</option>
                  <option value="percent">Percentage</option>
                  <option value="buy_get">Buy/Get</option>
                </Form.Select>
              </Form.Group>
              {couponType != "buy_get" ? (
                <Form.Group
                  className="mb-3"
                  style={{ width: "50%" }}
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>
                    Discount{couponType == "percent" ? "(%)" : " (Amount) "}
                  </Form.Label>
                  <Form.Control
                    value={couponValue}
                    onChange={handleCouponValueChange}
                    type="text"
                  />
                  {errorMessage && (
                    <div style={{ color: "red" }}>{errorMessage}</div>
                  )}
                </Form.Group>
              ) : (
                <>
                  <Form.Select
                    // value={values.material}
                    onChange={(e) => {
                      console.log(e.target.value, "value data");
                      setCategoryId(e.target.value);
                      setCategoryName(e.target.name);
                    }}
                    // onBlur={formik.handleBlur}
                    name="category"
                  >
                    <option value={categoryName}>{categoryName} </option>
                    {categoriesData.categories?.map((item, index) => {
                      return (
                        <option value={item?.id} key={index} name={item?.title}>
                          {item?.title}
                        </option>
                      );
                    })}
                  </Form.Select>
                </>
              )}
            </div>
            <div className="d-flex">
              <Form.Group
                className="mb-3"
                style={{ width: "50%" }}
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                style={{ width: "50%" }}
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  type="date"
                />
              </Form.Group>
            </div>

            <div className="d-flex">
              <Form.Group
                className="mb-3"
                style={{ width: "50%" }}
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>
                  {couponType == "buy_get" ? "Buy" : "Minimum Purchase"}
                </Form.Label>
                <Form.Control
                  value={minPurchase}
                  onChange={handleMinPriceChange}
                  type="text"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                style={{ width: "50%" }}
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>
                  {couponType == "buy_get" ? "Get" : "Maximum Purchase"}
                </Form.Label>
                <Form.Control
                  value={maxPurchase}
                  onChange={handleMaxPriceChange}
                  type="text"
                />
              </Form.Group>
            </div>

            <div className="d-flex">
              <Form.Group
                className="mb-3"
                style={{ width: "50%" }}
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Limit</Form.Label>
                <Form.Control
                  value={limit}
                  onChange={handleLimitChange}
                  type="text"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                style={{ width: "50%" }}
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Max Uses Per User</Form.Label>
                <Form.Control
                  value={maxUsesPerUser}
                  onChange={handleMaxUsesPerUserChange}
                  type="text"
                />
              </Form.Group>
            </div>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="For New Users Only"
              checked={isForNewUsers}
              onChange={() => setIsForNewUsers(!isForNewUsers)}
            />
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Enable/Disable"
              checked={couponStatus}
              onChange={() => handleStatusChangeForRole()}
            />
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

export default Coupons;
