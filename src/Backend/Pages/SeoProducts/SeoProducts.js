import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../../context/userContext";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { AddSeoSchema } from "../../../common/SeoSchema/SeoSchema";
import styled from "styled-components";

const AddButton = styled.button`
  padding: 15px 20px;
  border: 0;
  background-color: #032140;
  color: #fff;
  cursor: pointer;
  width: 250px;
  margin-bottom: 50px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 500;
  &:hover {
    background-color: #032160;
  }
`;
const AddMetaButton = styled.button`
    padding: 12px 50px;
    margin: 10px 0;
    border-radius: 5px;
    border: 0;
    color: #fff;
    background-color: #17ab65;
`;
const CrossButton = styled.button`
    background-color: red;
    color: #fff;
    border: 0;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-weight: 500;
    margin-left: 10px;
`;

const SeoProducts = () => {
  const { userData } = useContext(userContext);
  const [data, setData] = useState([]);
  const [seoData, setSeoData] = useState([]);
  const [IndividualSeoData, setIndividualSeoData] = useState();
  // const [product, setProduct] = useState("");
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [metaTag, setMetaTag] = useState("");

  const getAllProducts = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/product/fetch_all_product_admin`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setData(response?.data?.data);
      })
      .catch((error) => {
        setData([]);
      });
  };
  const getSeoProducts = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/product/get_seo_data`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setSeoData(response?.data?.data);
      })
      .catch((error) => {
        setSeoData([]);
      });
  };
  useEffect(() => {
    getAllProducts();
    getSeoProducts();
  }, []);
  const handleChangeStatus = (val) => {
    let data = {
      id: `${val?.id}`,
      status: val?.status == "active" ? "inactive" : "active",
    };

    let config = {
      method: "put",
      url: `${environmentVariables?.apiUrl}api/admin/product/change_status_seo_data`,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getSeoProducts();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.message);
      });

    // let config = {
    //   method: "put",
    //   maxBodyLength: Infinity,
    //   url: `${environmentVariables?.apiUrl}api/admin/zip_code/edit_status_zipcodes`,
    //   withCredentials: true,
    //   data: data,
    // };

    // axios
    //   .request(config)
    //   .then((response) => {
    //     getAllCountries();
    //   })
    //   .catch((error) => {
    //     toast.error(error?.response?.data?.message || error?.message);
    //   });
  };

  console.log("IndividualSeoData", IndividualSeoData);
  let initialValues = {
    product: "",
    meta_title: "",
    meta_desc: "",
    metatags: [],
  };
  useEffect(() => {
    initialValues = {
      product: IndividualSeoData?.product_id || "",
      meta_title: IndividualSeoData?.meta_title || "",
      meta_desc: IndividualSeoData?.meta_description || "",
      metatags: IndividualSeoData?.tags || [],
    };

    formik.setValues(initialValues);
  }, [IndividualSeoData]);

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddSeoSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoader(true);
      console.log("qqq", values);

      let data = {
        id: IndividualSeoData?.id,
        meta_title: values.meta_title,
        product_id: values.product,
        meta_description: values.meta_desc,
        tags: values.metatags,
      };

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${environmentVariables?.apiUrl}api/admin/product/add_seo_data`,
        withCredentials: true,
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          toast.success("Product Seo Updated Successfully");
          getSeoProducts();
          setLoader(false);
          setShow(false);
          resetForm({});
        })
        .catch((error) => {
          setLoader(false);
          toast.error(error?.response?.data?.message || error?.message);
        });
      // let config = {
      //   method: "post",
      //   url: `${environmentVariables?.apiUrl}api/admin/product/add_product`,
      //   withCredentials: true,
      //   data: formdata,
      // };

      // axios
      //   .request(config)
      //   .then((response) => {
      //     toast.success("Product Added Successfully");
      //     setLoader(false);
      //     resetForm({});
      //     setSelectedItems([]);
      //   })
      //   .catch((error) => {
      //     setLoader(false);
      //     toast.error(error?.response?.data?.message || error?.message);
      //   });
    },
  });
  const handleChange = (e) => {
    setMetaTag(e.target.value);
  };
  const handleClick = () => {
    if (metaTag.trim() !== "") {
      formik.setValues({
        ...formik.values,
        metatags: [...formik.values.metatags, metaTag],
      });
      setMetaTag(""); // Clear the meta tag input after adding the value
    }
  };
  const handleDelete = (index) => {
    const updatedMetatags = [...formik.values.metatags];
    updatedMetatags.splice(index, 1); // Remove the element at the specified index
    formik.setValues({ ...formik.values, metatags: updatedMetatags });
  };
  const { values, errors, handleSubmit } = formik;
  // console.log("data", data, seoData);
  return (
    <div>
      {userData?.role != "super_admin" ? (
        userData?.backendArr?.some(
          (item) => item?.name === "/api/admin/product/add_seo_data"
        ) && (
          <div className="mb-3">
            <AddButton
              onClick={() => {
                handleShow();
                setIndividualSeoData();
              }}
            >
              Add Seo Data
            </AddButton>
          </div>
        )
      ) : (
        <div className="mb-3">
          <AddButton
            onClick={() => {
              handleShow();
              setIndividualSeoData();
            }}
          >
            Add Seo Data
          </AddButton>
        </div>
      )}

      <div>
        {seoData &&
          seoData?.length > 0 &&
          seoData.map((val) => (
            <>
              <div>
                <h5>Product name: {val?.product_title}</h5>
                <p>Meta Description: {val?.meta_description}</p>
                <p>Meta Title: {val?.meta_title}</p>
                <p>Tags: {val?.tags?.join(",")}</p>
              </div>
              {userData?.role != "super_admin" ? (
                userData?.backendArr?.some(
                  (item) => item?.name === "/api/admin/product/add_seo_data"
                ) && (
                  <div>
                    <button
                      onClick={() => {
                        handleShow(), setIndividualSeoData(val);
                      }}
                    >
                      Edit
                    </button>
                    <Form.Check
                      type="switch"
                      checked={val?.status == "active"}
                      onClick={() => handleChangeStatus(val)}
                    />
                  </div>
                )
              ) : (
                <div>
                  <button
                    onClick={() => {
                      handleShow(), setIndividualSeoData(val);
                    }}
                  >
                    Edit
                  </button>
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
          <Modal.Title>Add Update Seo Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Product</Form.Label>
              <Form.Select
                value={values?.product}
                onChange={formik.handleChange}
                name="product"
                onBlur={formik.handleBlur}
                disabled={IndividualSeoData ? true : false}
              >
                <option value="" disabled selected>
                  Select Product
                </option>
                {data.map((val) => (
                  <option value={val?.id} key={val?.id}>
                    {val?.title}
                  </option>
                ))}
              </Form.Select>
              {formik.touched.product && formik.errors.product ? (
                <div style={{ color: "red" }}>{formik.errors.product}</div>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>Meta Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Meta Title"
                name="meta_title"
                value={values.meta_title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.meta_title && formik.errors.meta_title ? (
                <div style={{ color: "red" }}>{formik.errors.meta_title}</div>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>Meta Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Meta Description"
                name="meta_desc"
                value={values.meta_desc}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.meta_desc && formik.errors.meta_desc ? (
                <div style={{ color: "red" }}>{formik.errors.meta_desc}</div>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>Meta Tags</Form.Label>
              <Form.Control
                type="text"
                placeholder="Meta Tag"
                name="metatags"
                value={metaTag}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.metatags && formik.errors.metatags ? (
                <div style={{ color: "red" }}>{formik.errors.metatags}</div>
              ) : null}

              <AddMetaButton type="button" onClick={handleClick}>
                Add
              </AddMetaButton>

              {/* Display added meta tags */}
              {formik.values.metatags.map((tag, index) => (
                <div key={index}>
                  {tag}
                  <CrossButton type="button" onClick={() => handleDelete(index)}>
                    X
                  </CrossButton>
                </div>
              ))}
            </Form.Group>
          </Form>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {/* {zipcodeArray &&
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
              ))} */}
          </div>
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

export default SeoProducts;
