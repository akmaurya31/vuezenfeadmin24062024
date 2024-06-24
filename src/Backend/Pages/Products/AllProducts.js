import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { useQuery } from "react-query";
import { environmentVariables } from "../../../config/env.config";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faFacebookF,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import "../common.scss";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditVariantPopup from "./EditVariantPopup";
import { CheckBox, UpdateSharp } from "@material-ui/icons";
import CountryPopup from "./COuntryPopup";
import { userContext } from "../../../context/userContext";
import { faClose, faCross } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";
const Addbutton = styled.button`
  padding: 12px 20px;
  border: 0;
  background-color: #1b5eaf;
  color: #fff;
  cursor: pointer;
  margin: 10px 0;
  border-radius: 5px;
  font-size: 15px;
  font-weight: 500;
  &:hover {
    background-color: #032160;
  }
`;
const Heading = styled.div`
  font-size: 30px;
  color: #032140;
  font-weight: 700;
  margin-bottom: 20px;
`;
const ProductBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  // gap: 50px;
`;
const SingleProductBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProduvtImage = styled.div`
  width: 280px;
  img {
    width: 100%;
  }
`;
const Title = styled.div``;
const Status = styled.div``;
const OnlyProductDetails = styled.div``;
const VariantDetails = styled.div``;
const VariantHeading = styled.div`
  font-size: 20px;
`;
const VariantThumbNailUrl = styled.img`
  height: 30px;
  width: 30px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 60px;
  color: #202020;
  outline: none;
  background-color: #ffffff;
  padding: 15px 20px;
  border: 1px solid #c1c1c1;
  margin-bottom: 20px;
  border-radius: 5px;
  font-size: 15px;
`;
const DataNotFound = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  padding: 10px 10px;
  font-size: 20px;
`;

const AllProducts = () => {
  const [searchData, setSearchData] = useState("");
  const [updatedState, setUpdatedState] = useState(false);
  const { userData, setUserData, routesData } = useContext(userContext);
  const [editVariantpopup, setEditVariantPopup] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [variantData, setVariantData] = useState();
  const [variantPricing, setVariantPricing] = useState();
  const [checkedRows, setCheckedRows] = useState([]);
  const [showCountryPopup, setShowCountryPopup] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const navigate = useNavigate();
  const abortController = new AbortController();
  const handleRemoveCountryData = (subrow, subsubrow) => {
    Swal.fire({
      title: "Delete Country Data",
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        let config = {
          url: `${environmentVariables?.apiUrl}api/admin/product/destro_product_variant_country_by_id?variant_id=${subrow?.variant_id}&country_code=${subsubrow?.country_code}&product_id=${subrow?.product_id}`,
          method: "delete",
        };
        axios
          .request(config)
          .then((response) => {
            if (response?.data?.success == true) {
              toast.success("Country Data Removed");
              // fetchCategoriesData();
              setUpdatedState(!updatedState);
            } else {
              toast.error(response?.data?.message);
            }
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || error?.message);
          });
      }
    });
  };
  const fetchAllProducts = async () => {
    if (searchData?.length >= 2) {
      const response = await axios.get(
        `${environmentVariables?.apiUrl}api/admin/product/fetch_all_product_admin?name=${searchData}`,
        {
          withCredentials: true,
        },
        { signal: abortController.signal }
      );

      return response?.data?.data;
    } else {
      const response = await axios.get(
        `${environmentVariables?.apiUrl}api/admin/product/fetch_all_product_admin`,
        {
          withCredentials: true,
        },
        { signal: abortController.signal }
      );

      return response?.data?.data;
    }
  };

  const { data, isLoading, error, refetch } = useQuery(
    "allproducts",
    fetchAllProducts
  );

  useEffect(() => {
    refetch();
    return () => {
      abortController.abort();
    };
  }, [updatedState, searchData]);

  const fetchCategoriesData = async () => {
    const response = await axios.get(
      `${environmentVariables?.apiUrl}api/admin/add_fiter_data/get_category_for_admin`,
      {
        withCredentials: true,
      }
    );

    return response?.data?.data;
  };

  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery("categoryinallproduct", fetchCategoriesData);

  const handleViewRow = (item) => {
    navigate(`/view/${item?.id}`);
  };

  const handleEditVariantPricing = (item, data) => {
    // console.log(item);
    setEditVariantPopup(true);
    setVariantPricing(item);
    setVariantData(data);
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
        console.log(error);
        setCountryData([]);
      });
  };
  useEffect(() => {
    getCountryDetails();
  }, []);

  const handleCheckboxChange = (subrow) => {
    if (
      subrow?.variant_price_details &&
      Array.isArray(subrow?.variant_price_details) &&
      subrow?.variant_price_details.length > 0
    ) {
      const countryCodes = subrow?.variant_price_details.map(
        (val) => val?.country_code
      );
      setSelectedCountries(countryCodes);
    }
    if (checkedRows.includes(subrow.variant_id)) {
      setCheckedRows(
        checkedRows.filter((rowId) => rowId !== subrow.variant_id)
      );
    } else {
      setCheckedRows([...checkedRows, subrow.variant_id]);
    }
  };

  const handleChangeKey = (event) => {
    const data = event.target.value;
    console.log("rrrrrrrrr", data.length);
    setSearchData(data);
    if (data.length >= 3) {
    } else {
    }
  };
  // console.log("userData", userData);
  if (isLoading) return <ButtonLoader />;

  return (
    <div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Heading>Product List</Heading>

          {userData?.role != "super_admin" ? (
            userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/product/add_product"
            ) && (
              <Addbutton
                onClick={() => {
                  navigate("/addproducts");
                }}
              >
                + Add New Product
              </Addbutton>
            )
          ) : (
            <Addbutton
              onClick={() => {
                navigate("/addproducts");
              }}
            >
              + Add New Product
            </Addbutton>
          )}
        </div>

        <SearchInput
          type="search"
          placeholder={"Search by product name"}
          value={searchData}
          onChange={handleChangeKey}
          // autoComplete={false}
        />

        <ProductBox>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: "#e3e3e3" }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Product Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data && data.length == 0 ? (
                  <DataNotFound>Data Not Available</DataNotFound>
                ) : (
                  data?.map((row, index) => (
                    <TableRow key={index} style={{ verticalAlign: "top" }}>
                      <TableCell style={{ paddingTop: "40px", border: "0" }}>
                        {row.id}
                      </TableCell>
                      <TableCell className="admin-main-product">
                        <Accordion className="admin-main-product-accordion">
                          <AccordionSummary
                            className="admin-main-product"
                            expandIcon={<ExpandMoreIcon />}
                          >
                            <Typography>{row.title}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <TableHead>
                                <TableRow
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                      "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                                    backgroundColor: "#efefef",
                                  }}
                                >
                                  <TableCell>Variant ID</TableCell>
                                  <TableCell>Variant Color</TableCell>
                                  <TableCell>Country</TableCell>
                                  <TableCell>Purchase Price</TableCell>
                                  <TableCell>Sale Price</TableCell>
                                  <TableCell>Stock</TableCell>
                                  <TableCell>Discount(%)</TableCell>
                                  <TableCell>Action</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row?.variants?.map((subrow, subindex) => {
                                  // console.log(subrow);

                                  return (
                                    <>
                                      {subrow?.variant_price_details.length >
                                      0 ? (
                                        <>
                                          {" "}
                                          <TableRow
                                            key={subindex}
                                            style={{
                                              display: "grid",
                                              gridTemplateColumns:
                                                "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                                              backgroundColor: "#f9f9f9",
                                              alignItems: "center",
                                            }}
                                          >
                                            {/* <TableCell

                                            after create
                                           style={{
                                             maxWidth: "100px",
                                             maxHeight: "60px",
                                             borderRadius: "3px",
                                           }}
                                         >
                                           <img
                                             style={{ width: "100%" }}
                                             src={`${environmentVariables?.cdnUrl}uploads/${subrow?.thumbnail_url}`}
                                             alt="img"
                                           />
                                         </TableCell> */}
                                            <TableCell>
                                              {subrow?.variant_id}
                                            </TableCell>

                                            <TableCell>
                                              <div
                                                style={{
                                                  backgroundColor: `${subrow?.colorName}`,
                                                  height: "10px",
                                                  width: "10px",
                                                }}
                                              ></div>
                                            </TableCell>

                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>

                                            <TableCell
                                              style={{ padding: "0 10px" }}
                                            >
                                              {/* <input
                                              type="checkbox"
                                              checked={false}
                                              onChange={() =>
                                                handleCheckboxChange(subrow)
                                              }
                                              onClick={() => {
                                                setVariantData(subrow);
                                                setShowCountryPopup(true);
                                              }}
                                            /> */}
                                              <Addbutton
                                                onClick={() => {
                                                  handleCheckboxChange(subrow);
                                                  setVariantData(subrow);
                                                  setShowCountryPopup(true);
                                                }}
                                              >
                                                Add Country
                                              </Addbutton>
                                            </TableCell>
                                          </TableRow>
                                          {/* <Addbutton
                                            onClick={() => {
                                              handleCheckboxChange(subrow);
                                              setVariantData(subrow);
                                              setShowCountryPopup(true);
                                            }}
                                          >
                                            Add Country
                                          </Addbutton> */}
                                          <div style={{ marginBottom: "30px" }}>
                                            {subrow?.variant_price_details?.map(
                                              (subsubrow, subsubindex) => {
                                                return (
                                                  <TableRow
                                                    key={subsubindex}
                                                    style={{
                                                      // display: "flex",
                                                      justifyContent:
                                                        "space-between",
                                                      textTransform:
                                                        "capitalize",
                                                      // backgroundColor:"gray",
                                                    }}
                                                  >
                                                    <Typography>
                                                      {/* <TableRow style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"}}>
                                                      <TableCell>
                                                      </TableCell>
                                                      <TableCell>
                                                      </TableCell>
                                                      <TableCell>
                                                        Country
                                                      </TableCell>
                                                      <TableCell>
                                                        Purchase Price
                                                      </TableCell>
                                                      <TableCell>
                                                        Sale Price
                                                      </TableCell>
                                                      <TableCell>
                                                        Stock
                                                      </TableCell>
                                                      <TableCell>
                                                        Discount (%)
                                                      </TableCell>
                                                      <TableCell>
                                                      </TableCell>
                                                    </TableRow> */}

                                                      <TableRow
                                                        style={{
                                                          display: "grid",
                                                          gridTemplateColumns:
                                                            "1fr 1fr 1fr 1fr 1fr 1fr 1fr  1fr",
                                                          alignItems: "center",
                                                        }}
                                                      >
                                                        <TableCell>
                                                          {/* {subsubrow?.country} */}
                                                        </TableCell>
                                                        <TableCell>
                                                          {/* {subsubrow?.country} */}
                                                        </TableCell>
                                                        <TableCell>
                                                          {subsubrow?.country}
                                                        </TableCell>
                                                        <TableCell
                                                          onClick={() => {
                                                            if (
                                                              userData?.role ===
                                                              "super_admin"
                                                            ) {
                                                              handleEditVariantPricing(
                                                                subsubrow,
                                                                subrow
                                                              );
                                                            } else {
                                                              if (
                                                                userData?.backendArr?.some(
                                                                  (item) =>
                                                                    item?.name ===
                                                                    "/api/admin/product/add_product"
                                                                )
                                                              ) {
                                                                handleEditVariantPricing(
                                                                  subsubrow,
                                                                  subrow
                                                                );
                                                              }
                                                            }
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              border:
                                                                "1px solid #000",
                                                              borderRadius:
                                                                "5px",
                                                              padding:
                                                                "15px 50px",
                                                              cursor: "pointer",
                                                            }}
                                                          >
                                                            {" "}
                                                            {
                                                              subsubrow?.purchase_price
                                                            }{" "}
                                                          </span>
                                                        </TableCell>

                                                        <TableCell
                                                          onClick={() => {
                                                            if (
                                                              userData?.role ===
                                                              "super_admin"
                                                            ) {
                                                              handleEditVariantPricing(
                                                                subsubrow,
                                                                subrow
                                                              );
                                                            } else {
                                                              if (
                                                                userData?.backendArr?.some(
                                                                  (item) =>
                                                                    item?.name ===
                                                                    "/api/admin/product/add_product"
                                                                )
                                                              ) {
                                                                handleEditVariantPricing(
                                                                  subsubrow,
                                                                  subrow
                                                                );
                                                              }
                                                            }
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              border:
                                                                "1px solid #000",
                                                              borderRadius:
                                                                "5px",
                                                              padding:
                                                                "15px 50px",
                                                              cursor: "pointer",
                                                            }}
                                                          >
                                                            {" "}
                                                            {
                                                              subsubrow?.price
                                                            }{" "}
                                                          </span>
                                                        </TableCell>
                                                        <TableCell
                                                          onClick={() => {
                                                            if (
                                                              userData?.role ===
                                                              "super_admin"
                                                            ) {
                                                              handleEditVariantPricing(
                                                                subsubrow,
                                                                subrow
                                                              );
                                                            } else {
                                                              if (
                                                                userData?.backendArr?.some(
                                                                  (item) =>
                                                                    item?.name ===
                                                                    "/api/admin/product/add_product"
                                                                )
                                                              ) {
                                                                handleEditVariantPricing(
                                                                  subsubrow,
                                                                  subrow
                                                                );
                                                              }
                                                            }
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              border:
                                                                "1px solid #000",
                                                              borderRadius:
                                                                "5px",
                                                              padding:
                                                                "15px 50px",
                                                              cursor: "pointer",
                                                            }}
                                                          >
                                                            {subsubrow?.stock}
                                                          </span>
                                                        </TableCell>
                                                        <TableCell
                                                          onClick={() => {
                                                            if (
                                                              userData?.role ===
                                                              "super_admin"
                                                            ) {
                                                              handleEditVariantPricing(
                                                                subsubrow,
                                                                subrow
                                                              );
                                                            } else {
                                                              if (
                                                                userData?.backendArr?.some(
                                                                  (item) =>
                                                                    item?.name ===
                                                                    "/api/admin/product/add_product"
                                                                )
                                                              ) {
                                                                handleEditVariantPricing(
                                                                  subsubrow,
                                                                  subrow
                                                                );
                                                              }
                                                            }
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              border:
                                                                "1px solid #000",
                                                              borderRadius:
                                                                "5px",
                                                              padding:
                                                                "15px 50px",
                                                              cursor: "pointer",
                                                            }}
                                                          >
                                                            {
                                                              subsubrow?.discount
                                                            }
                                                          </span>
                                                        </TableCell>

                                                        <TableCell>
                                                          <div
                                                            onClick={() => {
                                                              handleRemoveCountryData(
                                                                subrow,
                                                                subsubrow
                                                              );
                                                            }}
                                                          >
                                                            <FontAwesomeIcon
                                                              icon={faClose}
                                                              size="2x"
                                                              className="font-icon"
                                                              style={{
                                                                color: "red",
                                                                cursor:
                                                                  "pointer",
                                                              }}
                                                            />
                                                          </div>
                                                        </TableCell>
                                                      </TableRow>
                                                    </Typography>
                                                  </TableRow>
                                                );
                                              }
                                            )}
                                          </div>
                                        </>
                                      ) : (
                                        <TableRow
                                          style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                              "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                                            alignItems: "center",
                                            backgroundColor: "#f9f9f9",
                                          }}
                                        >
                                          {" "}
                                          <TableCell
                                            style={{
                                              padding: "0 10px",
                                              border: "0",
                                            }}
                                          >
                                            {subrow?.variant_id}
                                          </TableCell>
                                          <TableCell
                                            style={{
                                              padding: "0 10px",
                                              border: "0",
                                            }}
                                          >
                                            <div
                                              style={{
                                                backgroundColor: `${subrow?.colorName}`,
                                                height: "10px",
                                                width: "10px",
                                              }}
                                            ></div>
                                          </TableCell>
                                          <TableCell></TableCell>
                                          <TableCell></TableCell>
                                          <TableCell></TableCell>
                                          <TableCell></TableCell>
                                          <TableCell></TableCell>
                                          <TableCell
                                            style={{ padding: "0 10px" }}
                                          >
                                            {/* <input
                                              type="checkbox"
                                              checked={false}
                                              onChange={() =>
                                                handleCheckboxChange(subrow)
                                              }
                                              onClick={() => {
                                                setVariantData(subrow);
                                                setShowCountryPopup(true);
                                              }}
                                            /> */}
                                            <Addbutton
                                              onClick={() => {
                                                handleCheckboxChange(subrow);
                                                setVariantData(subrow);
                                                setShowCountryPopup(true);
                                              }}
                                            >
                                              Add Country
                                            </Addbutton>
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </>
                                  );
                                })}
                              </TableBody>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>

                        {/* {userData?.role != "super_admin" ? (
                          userData?.backendArr?.some(
                            (item) =>
                              item?.name === "/api/admin/product/add_product"
                          ) && (
                            <Typography
                              className="admin-view-edit"
                              onClick={() => handleViewRow(row)}
                            >
                              View / Edit
                            </Typography>
                          )
                        ) : (
                          <Typography
                            className="admin-view-edit"
                            onClick={() => handleViewRow(row)}
                          >
                            View / Edit
                          </Typography>
                        )} */}
                        <Typography
                          className="admin-view-edit"
                          onClick={() => handleViewRow(row)}
                        >
                          View / Edit
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <DataTableExtensions
            columns={columns}
            data={selectedItems}
            {...tableExtensions}
          >
            <DataTable
              noHeader
              defaultSortField="id"
              defaultSortAsc={false}
              highlightOnHover
              pagination
            />
          </DataTableExtensions> */}

          {/* {data?.map((item, index) => {
            return (
              <SingleProductBox key={index}>
                <div onClick={() => HandleEditProduct(item)}>Edit</div>
                <OnlyProductDetails>
                  <ProduvtImage>
                    <img
                      src={`${
                        environmentVariables?.cdnUrl
                      }uploads/${item?.thumbnail_img?.replace(/"/g, "")}`}
                    />
                  </ProduvtImage>
                  <Title>Title: {item?.title}</Title>
                  <Title>Slug: {item?.slug}</Title>

                  <Status>
                    Status: {item?.status === "active" ? "Active" : "Inactive"}
                  </Status>
                  {categoryData?.categories
                    .filter((innerItem) => innerItem?.id === item?.cat_id)
                    .map((innerItem, innerIndex) => (
                      <Status key={innerIndex}>
                        Category: {innerItem?.title}
                      </Status>
                    ))}

                  {categoryData?.material
                    .filter((innerItem) => innerItem?.id === item?.material_id)
                    .map((innerItem, innerIndex) => (
                      <Status key={innerIndex}>
                        Material: {innerItem?.value}
                      </Status>
                    ))}

                  {categoryData?.shape
                    .filter((innerItem) => innerItem?.id === item?.shape_id)
                    .map((innerItem, innerIndex) => (
                      <Status key={innerIndex}>
                        Shape: {innerItem?.value}
                      </Status>
                    ))}

                  <Status>
                    {" "}
                    Gender:
                    {categoryData?.gender
                      .filter((innerItem) =>
                        item?.gender?.includes(innerItem.id.toString())
                      )
                      .map((innerItem, innerIndex, array) => (
                        <span key={innerIndex}>
                          {innerItem?.value}{" "}
                          {innerIndex !== array.length - 1 ? ", " : ""}
                        </span>
                      ))}
                  </Status>
                </OnlyProductDetails>
                <VariantDetails>
                  <VariantHeading>Variant Details</VariantHeading>
                  {item?.variants?.map?.((innerItem, innerIndex) => {
                    return (
                      <div
                        key={innerIndex}
                        style={{
                          backgroundColor: "lightgrey",
                          marginTop: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: "10px",
                          }}
                        >
                          <div>name: {innerItem?.variant_name}</div>
                          <div>Sku: {innerItem?.sku}</div>
                          <VariantThumbNailUrl
                            src={`${
                              environmentVariables?.cdnUrl
                            }uploads/${innerItem?.thumbnail_url?.replace(
                              /"/g,
                              ""
                            )}`}
                          />
                          <div>
                            {categoryData?.color
                              .filter(
                                (categoryInnerItem) =>
                                  categoryInnerItem?.id === innerItem?.color_id
                              )
                              .map((categoryInnerItem, innerIndex) => (
                                <Status key={innerIndex}>
                                  Color : {categoryInnerItem?.value}
                                </Status>
                              ))}
                          </div>
                          <div>
                            {categoryData?.weight_group
                              .filter(
                                (categoryInnerItem) =>
                                  categoryInnerItem?.id ===
                                  innerItem?.weight_group_id
                              )
                              .map((categoryInnerItem, innerIndex) => (
                                <Status key={innerIndex}>
                                  Weight : {categoryInnerItem?.value}
                                </Status>
                              ))}
                          </div>
                          <div>
                            {categoryData?.size
                              .filter(
                                (categoryInnerItem) =>
                                  categoryInnerItem?.id === innerItem?.size_id
                              )
                              .map((categoryInnerItem, innerIndex) => (
                                <Status key={innerIndex}>
                                  Size : {categoryInnerItem?.value}
                                </Status>
                              ))}
                          </div>
                          <div>Frame width: {innerItem?.frame_width}</div>
                          <div>Lens width: {innerItem?.lens_width}</div>
                          <div>Lens height: {innerItem?.lens_height}</div>
                          <div>Bridge weight: {innerItem?.bridge_width}</div>
                          <div>Temple length: {innerItem?.temple_length}</div>
                          <div>Status {innerItem?.status}</div>
                          <div>
                            <div>Price Details</div>
                            <div>
                              {innerItem?.variant_price_details?.map(
                                (variantItem, variantIndex) => {
                                  return (
                                    <div key={variantIndex}>
                                      <div>
                                        Country name :{variantItem?.country}
                                      </div>
                                      <div>Tax :{variantItem?.tax}</div>
                                      <div>
                                        Tax name:{variantItem?.tax_name}
                                      </div>
                                      <div>
                                        Discount :{variantItem?.discount}
                                      </div>
                                      <div>
                                        Country Code :
                                        {variantItem?.country_code}
                                      </div>
                                      <div>
                                        Symbol :{variantItem?.currency_symbol}
                                      </div>
                                      <div>Stock :{variantItem?.stock}</div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </VariantDetails>
              </SingleProductBox>
            );
          })} */}
          {editVariantpopup && (
            <EditVariantPopup
              open={editVariantpopup}
              setOpen={setEditVariantPopup}
              categoryData={categoryData}
              countryData={countryData}
              varaintId={variantData}
              variantData={variantPricing}
              setUpdatedState={setUpdatedState}
              updatedState={updatedState}
            />
          )}
          {showCountryPopup && (
            <CountryPopup
              open={showCountryPopup}
              setOpen={setShowCountryPopup}
              countryData={countryData}
              variantData={variantData}
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
              setUpdatedState={setUpdatedState}
              updatedState={updatedState}
            />
          )}
        </ProductBox>
      </div>
    </div>
  );
};

export default AllProducts;
