import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
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

const OrderDetails = () => {
  const [isSubmit, setIsSubmit] = useState(false);

  const { orderid } = useParams();
  const [ordersData, setOrdersData] = useState(null);
  const [show, setShow] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { userData } = useContext(userContext);
  const handleSubmit = () => {
    setIsSubmit(true);

    let data = {
      order_id: orderid,
      status: orderStatus,
    };

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/order/update_order_status`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getOrderDetail();
        handleClose();
        toast.success("Order Status Changed");
        setIsSubmit(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
        setIsSubmit(false);
      });
  };
  const handleSubmitPayment = () => {
    setIsSubmit(true);
    let data = {
      order_id: orderid,
      status: paymenStatus,
    };

    let config = {
      method: "put",
      url: `${environmentVariables?.apiUrl}api/admin/order/update_order_payment_status`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getOrderDetail();
        handleClosePayment();
        toast.success("Payment Status Changed");
        setIsSubmit(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
        setIsSubmit(false);
      });
  };
  const handleClose = () => setShow(false);
  const handleClosePayment = () => setShowPayment(false);
  const handleShow = () => setShow(true);
  const handleShowPayment = () => setShowPayment(true);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymenStatus, setPaymentStatus] = useState("");
  const handleChangeOrderStatus = () => {
    handleShow();
  };
  const handleChangePaymentStatus = () => {
    handleShowPayment();
  };
  const getOrderDetail = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/order/get_all`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        if (response?.data?.data) {
          const filterorderdata = response.data.data.filter(
            (val) => val.order_id == orderid
          );
          setOrdersData(filterorderdata[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getOrderDetail();
  }, []);

  console.log(
    "ordersData",
    ordersData?.status == "delivered",
    ordersData?.status
  );
  return (
    <div>
      {ordersData && (
        <div>
          <div>
            <strong>Order Id:</strong>
            {ordersData.order_id}
          </div>
          <div>
            <strong>Products: </strong>
            <>
              {ordersData.variant_quantity.map((val) => (
                <>
                  <div>
                    <strong>Name: </strong>
                    {val?.variant_name}
                  </div>
                  <div>
                    <img
                      src={`${environmentVariables?.cdnUrl}uploads/${val?.thumbnail_url}`}
                    />
                  </div>
                </>
              ))}
            </>
          </div>
          <div>
            <strong>Sub Total: </strong>
            {ordersData?.sub_total}
          </div>
          <div>
            <strong>Payment Method: </strong>
            {ordersData?.payment_method}
          </div>
          <div>
            <strong>Payment Status: </strong>
            {ordersData?.payment_status}
          </div>
          <div>
            <strong>Order Status: </strong>
            {ordersData?.status}
          </div>
          <div>
            <strong>Transaction Id: </strong>
            {ordersData?.txn_id}
          </div>
          <div>
            <strong>Order Date: </strong>
            {ordersData?.order_date.split("T")[0]}
          </div>
          <div>
            <strong>Delivery Date: </strong>
            {ordersData?.delivery_date.split("T")[0]}
          </div>
          <div>
            <strong>Shipping Date: </strong>
            {ordersData?.shipping_date.split("T")[0]}
          </div>
          <div>
            <strong>Out for Delivery Date: </strong>
            {ordersData?.out_for_delivery_date.split("T")[0]}
          </div>
          <div>
            <strong>Buyer Name: </strong>
            {ordersData?.userObj?.name}
          </div>
          <div>
            <strong>Buyer Address: </strong>
            {ordersData?.userAddressObj?.city}
          </div>
          {userData?.role != "super_admin" ? (
            userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/order/update_order_status"
            ) && (
              <button
                disabled={ordersData?.status == "delivered"}
                onClick={handleChangeOrderStatus}
              >
                Change Order Status
              </button>
            )
          ) : (
            <button
              disabled={ordersData?.status == "delivered"}
              onClick={handleChangeOrderStatus}
            >
              Change Order Status
            </button>
          )}
          {userData?.role != "super_admin" ? (
            userData?.backendArr?.some(
              (item) =>
                item?.name === "/api/admin/order/update_order_payment_status"
            ) && (
              <button
                disabled={ordersData?.payment_status !== "pending"}
                onClick={handleChangePaymentStatus}
              >
                Change Payment Status
              </button>
            )
          ) : (
            <button
              disabled={ordersData?.payment_status !== "pending"}
              onClick={handleChangePaymentStatus}
            >
              Change Payment Status
            </button>
          )}
        </div>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add/Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Country</Form.Label>
              <Form.Select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                <option value="" disabled selected>
                  Select Order Status
                </option>
                <option
                  value="processing"
                  disabled={ordersData?.status == "processing"}
                >
                  Shipped
                </option>
                <option
                  value="outfordelivery"
                  disabled={ordersData?.status == "outfordelivery"}
                >
                  Out for Delivery
                </option>
                <option
                  value="delivered"
                  disabled={ordersData?.status == "delivered"}
                >
                  Delivered
                </option>
              </Form.Select>
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
      <Modal show={showPayment} onHide={handleClosePayment}>
        <Modal.Header closeButton>
          <Modal.Title>Update Payment Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Payment Status</Form.Label>
              <Form.Select
                value={paymenStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option value="" disabled selected>
                  Select Payment Status
                </option>
                <option value="pending">Pending</option>
                <option value="complete">Complete</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePayment}>
            Close
          </Button>
          <AddCategoryButton
            variant="primary"
            onClick={handleSubmitPayment}
            disabled={isSubmit}
          >
            {isSubmit ? <ButtonLoader size={30} /> : "Save Changes"}
          </AddCategoryButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderDetails;
