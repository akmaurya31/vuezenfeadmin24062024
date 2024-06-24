import React, { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { AddProductSchema } from "../../../common/ProductSchemas/ProductSchema";
import axios from "axios";
import { useQuery } from "react-query";
import { environmentVariables } from "../../../config/env.config";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { toast } from "react-toastify";
import CircularLoader from "../../Components/CircularLoader/CircularLoader";
import { useNavigate } from "react-router-dom";
import Editor from "../../../common/Editor/Editor";
// import { FaTrash } from "react-icons/fa";

const Circle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;
`;
const Product = () => {
  let fileInputRef = useRef(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loader, setLoader] = useState(false);
  const [size, setSize] = useState("");
  const [frame_type, setFrameType] = useState("");
  const [color, setColor] = useState("");
  const [countryData, setCountryData] = useState([]);

  const navigate = useNavigate();
  const initialValues = {
    title: "",
    description: "",
    summary: "",
    selectedImage: null,
    genderInCategory: [],
    sku: 0,
    modelNumber: 0,
    category: "",
    material: "",
    shape: "",
    weight: "",
    size: "",
    frame_type: "",

    frame_width: 0,
    lens_width: 0,
    lens_height: 0,
    bridge_width: 0,
    temple_length: 0,
  };

  const handleInputChange = (e, index, columnName) => {
    const value = e.target.value;
    if (columnName === "countryName") {
      const selectedCountry = countryData.find(
        (country) => country.country === value
      );
      const currencySymbol = selectedCountry
        ? selectedCountry.currency_symbol
        : "";
      const countryCode = selectedCountry ? selectedCountry.country_code : "";

      const updatedItems = [...selectedItems];
      updatedItems[index] = {
        ...updatedItems[index],
        countryName: value,
        currencySymbol: currencySymbol,
        countryCode: countryCode,
      };

      setSelectedItems(updatedItems);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems[index] = {
        ...updatedItems[index],
        [columnName]: value,
      };

      setSelectedItems(updatedItems);
    }
  };
  const columns = [
    {
      name: "Name",
      selector: "name",
      cell: (d, index) => {
        return (
          <input
            type="text"
            value={d.name}
            placeholder="Name"
            onChange={(e) => handleInputChange(e, index, "name")}
          />
        );
      },
    },
    {
      name: "SKU",
      selector: "sku",
      cell: (d, index) => {
        return (
          <input
            type="number"
            value={d.sku}
            placeholder="Sku"
            onChange={(e) => handleInputChange(e, index, "sku")}
          />
        );
      },
    },
    {
      name: "Weight",
      selector: "weight",
      cell: (d, index) => {
        return (
          <select
            value={d.weight}
            onChange={(e) => handleInputChange(e, index, "weight")}
          >
            <option value="" disabled>
              Select Weight
            </option>
            {data?.weight_group?.map((option, index) => (
              <option key={index} value={option?.id}>
                {option?.value}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      name: "Size",
      selector: "size",
      cell: (d, index) => {
        return (
          <select
            value={d.size}
            onChange={(e) => handleInputChange(e, index, "size")}
          >
            <option value="" disabled>
              Select Size
            </option>
            {data?.size?.map((option, index) => (
              <option key={index} value={option?.id}>
                <div>{option?.value}</div>
              </option>
            ))}
          </select>
        );
      },
    },
    {
      name: "Color",
      selector: "color",
      cell: (d, index) => {
        return (
          <select
            value={d.color}
            onChange={(e) => handleInputChange(e, index, "color")}
          >
            <option value="" disabled>
              Select Color
            </option>
            {data?.color?.map((option, index) => (
              <option
                value={option?.id}
                key={index}
                style={{ backgroundColor: option?.value }}
              >
                {option?.value}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      name: "Country Name",
      selector: "countryName",
      cell: (d, index) => {
        return (
          <select
            value={d.countryName}
            onChange={(e) => handleInputChange(e, index, "countryName")}
          >
            <option value="" disabled>
              Select Country
            </option>
            {countryData?.map((option, index) => (
              <option value={option?.country} key={index}>
                {option?.country}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      name: "Currency Symbol",
      selector: "currencySymbol",
      cell: (d, index) => {
        return (
          <input
            type="text"
            placeholder="Currency Symbol"
            value={d.currencySymbol}
            readOnly
            onChange={(e) => handleInputChange(e, index, "currencySymbol")}
          />
        );
      },
    },
    {
      name: "Country Code",
      selector: "countryCode",
      cell: (d, index) => {
        return (
          <input
            type="text"
            placeholder="Country Code"
            value={d.countryCode}
            readOnly
            onChange={(e) => handleInputChange(e, index, "countryCode")}
          />
        );
      },
    },
    {
      name: "Tax Name",
      selector: "taxName",
      cell: (d, index) => {
        return (
          <input
            type="text"
            placeholder="Tax Name"
            value={d.taxName}
            onChange={(e) => handleInputChange(e, index, "taxName")}
          />
        );
      },
    },
    {
      name: "Tax",
      selector: "tax",
      cell: (d, index) => {
        return (
          <input
            type="text"
            value={d.tax}
            placeholder="Tax Value"
            onChange={(e) => handleInputChange(e, index, "tax")}
          />
        );
      },
    },
    {
      name: "Discount(%)",
      selector: "discount",
      cell: (d, index) => {
        return (
          <input
            type="number"
            placeholder="Discount"
            value={d.discount}
            onChange={(e) => handleInputChange(e, index, "discount")}
          />
        );
      },
    },
    {
      name: "Price",
      selector: "price",
      cell: (d, index) => {
        return (
          <input
            type="text"
            value={d.price}
            placeholder="Price"
            onChange={(e) => handleInputChange(e, index, "price")}
          />
        );
      },
    },
    {
      name: "Stock",
      selector: "stock",
      cell: (d, index) => {
        return (
          <input
            type="number"
            value={d.stock}
            placeholder="Stock"
            onChange={(e) => handleInputChange(e, index, "stock")}
          />
        );
      },
    },
    {
      name: "Frame Width",
      selector: "frame_width",
      cell: (d, index) => {
        return (
          <input
            type="number"
            value={d.frame_width}
            placeholder="Frame Width"
            onChange={(e) => handleInputChange(e, index, "frame_width")}
          />
        );
      },
    },
    {
      name: "Lens Width",
      selector: "lens_width",
      cell: (d, index) => {
        return (
          <input
            type="number"
            value={d.lens_width}
            placeholder="Lens Width"
            onChange={(e) => handleInputChange(e, index, "lens_width")}
          />
        );
      },
    },
    {
      name: "Lens Height",
      selector: "lens_height",
      cell: (d, index) => {
        return (
          <input
            type="number"
            value={d.lens_height}
            placeholder="Lens Height"
            onChange={(e) => handleInputChange(e, index, "lens_height")}
          />
        );
      },
    },
    {
      name: "Bridge Width",
      selector: "bridge_width",
      cell: (d, index) => {
        return (
          <input
            type="number"
            value={d.bridge_width}
            placeholder="Bridge Width"
            onChange={(e) => handleInputChange(e, index, "bridge_width")}
          />
        );
      },
    },
    {
      name: "Temple Length",
      selector: "temple_length",
      cell: (d, index) => {
        return (
          <input
            type="number"
            value={d.temple_length}
            placeholder="Temple Length"
            onChange={(e) => handleInputChange(e, index, "temple_length")}
          />
        );
      },
    },
    {
      name: "Actions",
      selector: "actions",
      cell: (d, index) => (
        <button onClick={(e) => handleDeleteRow(e, index)}>Delete</button>
      ),
    },
  ];

  const handleDeleteRow = (e, index) => {
    e.preventDefault();
    setSelectedItems((prevData) => prevData.filter((item, i) => i !== index));
  };
  const tableExtensions = {
    export: false,
    print: false,
    filter: false,
  };

  const tableData = {
    columns: columns,
    data: selectedItems,
  };

  const handleSave = () => {
    if (size && color) {
      const newItem = {
        name: "",
        sku: "",
        weight: "",
        size: size,
        color: color,
        countryName: "",
        countryCode: "",
        currencySymbol: "",
        taxName: "",
        tax: "",
        discount: 0,
        price: "",
        stock: 0,
        frame_width: 0,
        lens_width: "",
        lens_height: "",
        bridge_width: "",
        temple_length: "",
      };
      setSelectedItems([...selectedItems, newItem]);
      setSize("");
      setColor("");
    }
  };
  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: AddProductSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoader(true);

      const formdata = new FormData();
      formdata.append("title", values.title);
      formdata.append("sku", values.sku);
      formdata.append("model_number", values.modelNumber);
      formdata.append("summary", values.summary);
      formdata.append("cat_id", values.category);
      formdata.append("shape_id", values.shape);
      formdata.append("material_id", values.material);
      formdata.append("description", values.description);
      formdata.append("thumbnail_img", values.selectedImage);
      formdata.append("size_id", values.size);
      formdata.append("frame_type_id", values.frame_type);
      formdata.append("weight_group_id", values.weight);
      formdata.append("condition", "new");
      formdata.append("frame_width", values.frame_width);
      formdata.append("lens_width", values.lens_width);
      formdata.append("lens_height", values.lens_height);
      formdata.append("bridge_width", values.bridge_width);
      formdata.append("temple_length", values.temple_length);
      for (let i = 0; i < values.genderInCategory.length; i++) {
        formdata.append(`gender[${i}]`, values.genderInCategory[i]);
      }
      let config = {
        method: "post",
        url: `${environmentVariables?.apiUrl}api/admin/product/add_product`,
        withCredentials: true,
        data: formdata,
      };

      console.log("values.description", values.description, errors);
      axios
        .request(config)
        .then((response) => {
          toast.success("Product Added Successfully");
          setLoader(false);
          resetForm({});
          setSelectedItems([]);
          navigate("/allproducts");
        })
        .catch((error) => {
          setLoader(false);
          toast.error(error?.response?.data?.message || error?.message);
        });
    },
  });

  const { values, errors, handleSubmit } = formik;

  const fetchCategoriesData = async () => {
    const response = await axios.get(
      `${environmentVariables?.apiUrl}api/admin/add_fiter_data/get_category_for_admin`,
      {
        withCredentials: true,
      }
    );

    return response?.data?.data;
  };

  const { data, isLoading, error, refetch } = useQuery(
    "categoryinproduct",
    fetchCategoriesData
  );

  const options = data?.gender.map((gender) => ({
    label: gender.value,
    value: gender.id,
  }));
  const handleOnchangeGender = (selectedOptions) => {
    const selectedValues = selectedOptions.split(",");
    formik.setFieldValue("genderInCategory", selectedValues);
  };

  const getCountryDetails = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/zip_code/get_active`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setCountryData(response.data.data);
      })
      .catch((error) => {
        setCountryData([]);
      });
  };
  useEffect(() => {
    getCountryDetails();
  }, []);

  const handleSkuChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "");
    formik.setFieldValue("sku", alphanumericValue);
  };
  const handleModelNumberChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "");
    formik.setFieldValue("modelNumber", alphanumericValue);
  };
  const handleFrameWidthChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    formik.setFieldValue("frame_width", alphanumericValue);
  };
  const handleLensWidthChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    formik.setFieldValue("lens_width", alphanumericValue);
  };
  const handleLensHeightChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    formik.setFieldValue("lens_height", alphanumericValue);
  };
  const handleBridgeWidthChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    formik.setFieldValue("bridge_width", alphanumericValue);
  };
  const handleTempleLengthChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^0-9]/g, "");
    formik.setFieldValue("temple_length", alphanumericValue);
  };

  const handleChangeDescription = (newValue) => {
    formik.setFieldValue("description", newValue);
  };
  // const handleModelNumberChange = (event) => {
  //   const { value } = event.target;

  //   // Filter out non-alphanumeric characters
  //   const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, '');

  //   // Update formik field value
  //   formik.setFieldValue('modelNumber', alphanumericValue);
  // };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          marginBottom: "20px",
          textAlign: "center",
          fontSize: "16px",
          fontWeight: "500",
        }}
      >
        Add New Product{" "}
        <span style={{ fontSize: "14px", fontWeight: "400" }}>
          (Please fill all the product details)
        </span>
      </div>
      <div>
        <Form>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title"
              name="title"
              value={values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title ? (
              <div style={{ color: "red" }}>{formik.errors.title}</div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            {/* <Form.Control
              as="textarea"
              rows={3}
              placeholder="Description"
              name="description"
              value={values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            /> */}
            <Editor
              // name="description"
              // value={values.description}
              // onChange={formik.handleChange}
              // editorLoaded={true}
              name="description"
              value={values.description}
              onChange={handleChangeDescription} // Directly bind to Formik's handleChange
              editorLoaded={true}
            />
            {formik.touched.description && formik.errors.description ? (
              <div style={{ color: "red" }}>{formik.errors.description}</div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>Summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Summary"
              name="summary"
              value={values.summary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.summary && formik.errors.summary ? (
              <div style={{ color: "red" }}>{formik.errors.summary}</div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Sku</Form.Label>
            <Form.Control
              type="text"
              placeholder="sku"
              name="sku"
              value={values.sku}
              onChange={handleSkuChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.sku && formik.errors.sku ? (
              <div style={{ color: "red" }}>{formik.errors.sku}</div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Model Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="modelNumber"
              name="modelNumber"
              value={values.modelNumber}
              onChange={handleModelNumberChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.modelNumber && formik.errors.modelNumber ? (
              <div style={{ color: "red" }}>{formik.errors.modelNumber}</div>
            ) : null}
          </Form.Group>

          <Form.Group controlId="formBasicImage">
            <Form.Label>Choose Image</Form.Label>
            <input
              type="file"
              accept="image/*"
              name="selectedImage"
              onChange={(event) => {
                formik.setFieldValue(
                  "selectedImage",
                  event.currentTarget.files[0]
                );
              }}
              onBlur={formik.handleBlur}
              ref={fileInputRef}
            />

            {formik.touched.selectedImage && formik.errors.selectedImage && (
              <div style={{ color: "red" }}>{formik.errors.selectedImage}</div>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Select Gender</Form.Label>
            <MultiSelect
              className="multi-select"
              onChange={handleOnchangeGender}
              options={options}
              value={formik.values.genderInCategory}
              style={{ width: "100%" }}
            />
            {formik.touched.genderInCategory &&
              formik.errors.genderInCategory && (
                <div style={{ color: "red" }}>
                  {formik.errors.genderInCategory}
                </div>
              )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="category"
            >
              <option value="" disabled>
                Select Category
              </option>

              {data?.categories?.map((item, index) => {
                return (
                  <option value={item?.id} key={index}>
                    {item?.title}
                  </option>
                );
              })}
            </Form.Select>
            {formik.touched.category && formik.errors.category ? (
              <div style={{ color: "red" }}>{formik.errors.category}</div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Material</Form.Label>
            <Form.Select
              value={values.material}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="material"
            >
              <option value="" disabled>
                Select Material
              </option>

              {data?.material?.map((item, index) => {
                return (
                  <option value={item?.id} key={index}>
                    {item?.value}
                  </option>
                );
              })}
            </Form.Select>
            {formik.touched.material && formik.errors.material ? (
              <div style={{ color: "red" }}>{formik.errors.material}</div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Shape</Form.Label>
            <Form.Select
              value={values.shape}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="shape"
            >
              <option value="" disabled>
                Select Shape
              </option>

              {data?.shape?.map((item, index) => {
                return (
                  <option value={item?.id} key={index}>
                    {item?.value}
                  </option>
                );
              })}
            </Form.Select>
            {formik.touched.shape && formik.errors.shape ? (
              <div style={{ color: "red" }}>{formik.errors.shape}</div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Weight Group</Form.Label>
            <Form.Select
              value={values.weight}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="weight"
            >
              <option value="" disabled>
                Select Weight
              </option>
              {data?.weight_group?.map((option, index) => (
                <option key={index} value={option?.id}>
                  {option?.value}
                </option>
              ))}
            </Form.Select>
            {formik.touched.weight && formik.errors.weight ? (
              <div style={{ color: "red" }}>{formik.errors.weight}</div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Size</Form.Label>
            <Form.Select
              value={values.size}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="size"
            >
              <option value="" disabled>
                Select Size
              </option>
              {data?.size?.map((option, index) => (
                <option key={index} value={option?.id}>
                  <div>{option?.value}</div>
                </option>
              ))}
            </Form.Select>
            {formik.touched.size && formik.errors.size ? (
              <div style={{ color: "red" }}>{formik.errors.size}</div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Frame Type</Form.Label>
            <Form.Select
              value={values.frame_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="frame_type"
            >
              <option value="" disabled>
                Select Frame Type
              </option>
              {data?.frame_type?.map((option, index) => (
                <option key={index} value={option?.id}>
                  <div>{option?.value}</div>
                </option>
              ))}
            </Form.Select>
            {formik.touched.frame_type && formik.errors.frame_type ? (
              <div style={{ color: "red" }}>{formik.errors.frame_type}</div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Frame Width</Form.Label>
            <Form.Control
              type="text"
              placeholder="Frame Width"
              name="frame_width"
              value={values.frame_width}
              onChange={handleFrameWidthChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.frame_width && formik.errors.frame_width ? (
              <div style={{ color: "red" }}>{formik.errors.frame_width}</div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Lens Width</Form.Label>
            <Form.Control
              type="text"
              placeholder="Lens Width"
              name="lens_width"
              value={values.lens_width}
              onChange={handleLensWidthChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.lens_width && formik.errors.lens_width ? (
              <div style={{ color: "red" }}>{formik.errors.lens_width}</div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Lens Height</Form.Label>
            <Form.Control
              type="text"
              placeholder="Lens Height"
              name="lens_height"
              value={values.lens_height}
              onChange={handleLensHeightChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.lens_height && formik.errors.lens_height ? (
              <div style={{ color: "red" }}>{formik.errors.lens_height}</div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Bridge Width</Form.Label>
            <Form.Control
              type="text"
              placeholder="Bridge Width"
              name="bridge_width"
              value={values.bridge_width}
              onChange={handleBridgeWidthChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.bridge_width && formik.errors.bridge_width ? (
              <div style={{ color: "red" }}>{formik.errors.bridge_width}</div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Temple Length</Form.Label>
            <Form.Control
              type="text"
              placeholder="Temple Length"
              name="temple_length"
              value={values.temple_length}
              onChange={handleTempleLengthChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.temple_length && formik.errors.temple_length ? (
              <div style={{ color: "red" }}>{formik.errors.temple_length}</div>
            ) : null}
          </Form.Group>

          {/* <h2>Product Variant</h2>

          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Form.Group>
                <Form.Label>Size</Form.Label>
                <Form.Select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <option value="" disabled>
                    Select Size
                  </option>

                  {data?.size?.map((item, index) => {
                    return (
                      <option value={item?.id} key={index}>
                        {item?.value}
                      </option>
                    );
                  })}
                </Form.Select>
                {formik.touched.shape && formik.errors.shape ? (
                  <div style={{ color: "red" }}>{formik.errors.shape}</div>
                ) : null}
              </Form.Group>
              <Form.Group>
                <Form.Label>Color</Form.Label>
                <Form.Select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  <option value="" disabled>
                    Select Color
                  </option>

                  {data?.color?.map((item, index) => {
                    return (
                      <option
                        value={item?.id}
                        key={index}
                        style={{ backgroundColor: item?.value }}
                      >
                        {item?.value}
                      </option>
                    );
                  })}
                </Form.Select>
                {formik.touched.shape && formik.errors.shape ? (
                  <div style={{ color: "red" }}>{formik.errors.shape}</div>
                ) : null}
              </Form.Group>
              <Form.Group>
                <Button
                  style={{ width: "200px", alignSelf: "end" }}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Form.Group>
            </div>

            {selectedItems && selectedItems?.length > 0 && (
              <DataTableExtensions
                columns={columns}
                data={selectedItems}
                {...tableExtensions}
              >
                <DataTable
                  noHeader
                  defaultSortField="id"
                  defaultSortAsc={false}
                  highlightOnHover
                />
              </DataTableExtensions>
            )}
          </div> */}
          <Button
            className="add-button"
            style={{ marginTop: "20px" }}
            onClick={() => handleSubmit()}
          >
            {loader ? <CircularLoader /> : "Add Product"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Product;
