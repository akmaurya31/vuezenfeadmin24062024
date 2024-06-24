import React, {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useContext,
} from "react";
import { Button, Modal } from "react-bootstrap";
import { AddCategorySchema } from "../../../common/Schemas/AddCategorySchema";
import { useQuery } from "react-query";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoryPopup from "../../Components/Popups/CategoryPopup";
import GenderPopup from "../../Components/Popups/GenderPopup";
import CategoryForm from "./CategoryForm";
import GenderForm from "./GenderForm";
import ShapeForm from "./ShapeForm";
import MaterialForm from "./MaterialForm";
import ColorForm from "./ColorForm";
import SizeForm from "./SizeForm";
import WeightGroupForm from "./WeightGroupForm";
import ShapePopup from "../../Components/Popups/ShapePopup";
import SizePopup from "../../Components/Popups/SizePopup";
import MaterialPopup from "../../Components/Popups/MaterialPopup";
import ColorPopup from "../../Components/Popups/ColorPopup";
import WeightGroup from "../../Components/Popups/WeightGroupPopup";
import PriceRangeForm from "./PriceRangeForm";
import PriceRangePopup from "../../Components/Popups/PriceRangePopup";
import styled from "styled-components";
import { userContext } from "../../../context/userContext";
import FrameTypePopup from "../../Components/Popups/FrameTypePopup";
import FrameTypeForm from "./FrameTypeForm";
import Swal from "sweetalert2";

// Create a styled component
const EditButton = styled.button`
  font-size: 16px;
  padding: 5px 0;
  border: 1px solid rgba(0, 0, 0, 0.1215686275);
  background-color: #fff;
  color: #000;
  cursor: pointer;
  width: 90px;
  border-radius: 5px;
  margin: 0;
  &:hover {
    background-color: lightgray;
  }
`;
const DeleteButton = styled.button`
  font-size: 16px;
  padding: 5px 0;
  border: 1px solid rgba(0, 0, 0, 0.1215686275);
  background-color: #dd4646;
  color: #fff;
  cursor: pointer;
  width: 90px;
  border-radius: 5px;
  margin: 0;
  margin-left: 10px;
  &:hover {
    background-color: lightgray;
  }
`;
const Heading = styled.div`
  font-size: 30px;
  color: #032140;
  font-weight: 700;
  margin-bottom: 20px;
`;
const TextEditDel = styled.div`
  display: flex;
  margin-bottom: 40px;
  align-items: center;
`;
const SubHeading = styled.div`
  width: 300px;
  font-size: 18px;
  padding-left: 10px;
`;
const CategorySingle = styled.div`
  margin-bottom: 50px;
  text-transform: capitalize;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
`;

const AddCategory = () => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showGenderPopup, setShowGenderPopup] = useState(false);
  const [showShapePopup, setShowShapePopup] = useState(false);
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [showMaterialPopup, setShowMaterialPopup] = useState(false);
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [showWeightGroupPopup, setShowWeightGroupPopup] = useState(false);
  const [showFrameTypePopup, setShowFrameTypePopup] = useState(false);
  const [showPriceRangePopup, setShowPriceRangePopup] = useState(false);

  // const [genderInCategory, setGenderInCategory] = useState([]);

  const [updatedState, setUpdatedState] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState();
  const [genderInfo, setGenderInfo] = useState();
  const [shapeInfo, setShapeInfo] = useState();
  const [sizeInfo, setSizeInfo] = useState();
  const [materialInfo, setMaterialInfo] = useState();
  const [colorInfo, setColorInfo] = useState();
  const [WeightGroupInfo, setWeightGroupInfo] = useState();
  const [frameTypeInfo, setFrameTypeInfo] = useState();
  const [PriceRangeInfo, setPriceRangeInfo] = useState();
  const { userData } = useContext(userContext);

  // const handleButtonClick = () => {
  //   formik.setValues({
  //     ...formik.values,
  //     isButtonDisabled: !formik.values.isButtonDisabled,
  //   });
  // };

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
    "category",
    fetchCategoriesData
  );

  useEffect(() => {
    refetch();
  }, [updatedState]);

  const handleDeleteCategory = (item, title) => {
    Swal?.fire({
      title: "Are you sure, you want to delete it?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        let config = {
          method: "delete",
          url: `${environmentVariables?.apiUrl}api/admin/add_fiter_data/delete_category_by_id?id=${item?.id}&title=${title}`,
          withCredentials: true,
        };
        Swal.showLoading();
        axios
          .request(config)
          .then((response) => {
            toast.success(
              `${
                title == "categories"
                  ? "Category"
                  : title == "price_range"
                  ? "Price Range"
                  : title == "weight_group"
                  ? "Weight Group"
                  : title == "size"
                  ? "Size"
                  : title == "material"
                  ? "Material"
                  : title == "color"
                  ? "Color"
                  : title == "shape"
                  ? "Shape"
                  : title == "gender"
                  ? "Gender"
                  : title == "frame_type" && "Frame Type"
              } Deleted Successfully`
            );
            setUpdatedState(!updatedState);
            Swal.close();
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || error?.message);
            Swal.close();
          });
      }
    });
  };
  return (
    <>
      <CategorySingle>
        {" "}
        <Heading>Categories</Heading>
        <div>
          {data?.categories?.map((item, index) => {
            return (
              <TextEditDel key={index}>
                <SubHeading>{item?.value}</SubHeading>
                {userData?.role != "super_admin" ? (
                  userData?.backendArr?.some(
                    (item) =>
                      item?.name === "/api/admin/add_fiter_data/add_category"
                  ) && (
                    <div>
                      <EditButton
                        onClick={() => {
                          setShowCategoryPopup(true);
                          setCategoryInfo(item);
                        }}
                      >
                        Edit
                      </EditButton>
                      <DeleteButton
                        onClick={() => handleDeleteCategory(item, "categories")}
                      >
                        Delete
                      </DeleteButton>
                    </div>
                  )
                ) : (
                  <div>
                    <EditButton
                      onClick={() => {
                        setShowCategoryPopup(true);
                        setCategoryInfo(item);
                      }}
                    >
                      Edit
                    </EditButton>
                    <DeleteButton
                      onClick={() => handleDeleteCategory(item, "categories")}
                    >
                      Delete
                    </DeleteButton>
                  </div>
                )}
              </TextEditDel>
            );
          })}

          <div style={{ display: "flex", flexDirection: "column" }}>
            {userData?.role != "super_admin" ? (
              userData?.backendArr?.some(
                (item) =>
                  item?.name === "/api/admin/add_fiter_data/add_category"
              ) && (
                <CategoryForm
                  data={data}
                  updatedState={updatedState}
                  setUpdatedState={setUpdatedState}
                />
              )
            ) : (
              <CategoryForm
                data={data}
                updatedState={updatedState}
                setUpdatedState={setUpdatedState}
              />
            )}
          </div>
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading>Gender</Heading>
        <div>
          <div>
            {data?.gender?.map((item, index) => {
              return (
                <TextEditDel key={index}>
                  {" "}
                  <SubHeading>{item?.value}</SubHeading>
                  {userData?.role != "super_admin" ? (
                    userData?.backendArr?.some(
                      (item) =>
                        item?.name === "/api/admin/add_fiter_data/add_category"
                    ) && (
                      <div>
                        <EditButton
                          onClick={() => {
                            setShowGenderPopup(true);
                            setGenderInfo(item);
                          }}
                        >
                          Edit
                        </EditButton>
                        <DeleteButton
                          onClick={() => handleDeleteCategory(item, "gender")}
                        >
                          Delete
                        </DeleteButton>
                      </div>
                    )
                  ) : (
                    <div>
                      <EditButton
                        className="edit-button"
                        onClick={() => {
                          setShowGenderPopup(true);
                          setGenderInfo(item);
                        }}
                      >
                        Edit
                      </EditButton>
                      <DeleteButton
                        className="del-button"
                        onClick={() => handleDeleteCategory(item, "gender")}
                      >
                        Delete
                      </DeleteButton>
                    </div>
                  )}
                </TextEditDel>
              );
            })}
          </div>
          {userData?.role != "super_admin" ? (
            userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/add_fiter_data/add_category"
            ) && (
              <div>
                <GenderForm
                  updatedState={updatedState}
                  setUpdatedState={setUpdatedState}
                />
              </div>
            )
          ) : (
            <div>
              <GenderForm
                updatedState={updatedState}
                setUpdatedState={setUpdatedState}
              />
            </div>
          )}
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading>Shape</Heading>
        <div>
          <div>
            {data?.shape?.map((item, index) => {
              return (
                <TextEditDel key={index}>
                  <SubHeading>{item?.value}</SubHeading>
                  {userData?.role != "super_admin" ? (
                    userData?.backendArr?.some(
                      (item) =>
                        item?.name === "/api/admin/add_fiter_data/add_category"
                    ) && (
                      <div>
                        <EditButton
                          onClick={() => {
                            setShowShapePopup(true);
                            setShapeInfo(item);
                          }}
                        >
                          Edit
                        </EditButton>
                        <DeleteButton
                          onClick={() => handleDeleteCategory(item, "shape")}
                        >
                          Delete
                        </DeleteButton>
                      </div>
                    )
                  ) : (
                    <div>
                      <EditButton
                        onClick={() => {
                          setShowShapePopup(true);
                          setShapeInfo(item);
                        }}
                      >
                        Edit
                      </EditButton>
                      <DeleteButton
                        onClick={() => handleDeleteCategory(item, "shape")}
                      >
                        Delete
                      </DeleteButton>
                    </div>
                  )}
                </TextEditDel>
              );
            })}
          </div>
          {userData?.role != "super_admin" ? (
            userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/add_fiter_data/add_category"
            ) && (
              <ShapeForm
                updatedState={updatedState}
                setUpdatedState={setUpdatedState}
              />
            )
          ) : (
            <ShapeForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
          )}
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading>Material</Heading>
        <div>
          <div>
            {data?.material?.map((item, index) => {
              return (
                <TextEditDel key={index}>
                  <SubHeading>{item?.value}</SubHeading>
                  {userData?.role != "super_admin" ? (
                    userData?.backendArr?.some(
                      (item) =>
                        item?.name === "/api/admin/add_fiter_data/add_category"
                    ) && (
                      <div>
                        <EditButton
                          onClick={() => {
                            setShowMaterialPopup(true);
                            setMaterialInfo(item);
                          }}
                        >
                          Edit
                        </EditButton>
                        <DeleteButton
                          onClick={() => handleDeleteCategory(item, "material")}
                        >
                          Delete
                        </DeleteButton>
                      </div>
                    )
                  ) : (
                    <div>
                      <EditButton
                        onClick={() => {
                          setShowMaterialPopup(true);
                          setMaterialInfo(item);
                        }}
                      >
                        Edit
                      </EditButton>
                      <DeleteButton
                        onClick={() => handleDeleteCategory(item, "material")}
                      >
                        Delete
                      </DeleteButton>
                    </div>
                  )}
                </TextEditDel>
              );
            })}
          </div>
          {userData?.role != "super_admin" ? (
            userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/add_fiter_data/add_category"
            ) && (
              <MaterialForm
                updatedState={updatedState}
                setUpdatedState={setUpdatedState}
              />
            )
          ) : (
            <MaterialForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
          )}
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading>Color</Heading>
        <div>
          <div>
            {data?.color?.map((item, index) => {
              return (
                <TextEditDel key={index}>
                  <SubHeading>{item?.value}</SubHeading>
                  {userData?.role != "super_admin" ? (
                    userData?.backendArr?.some(
                      (item) =>
                        item?.name === "/api/admin/add_fiter_data/add_category"
                    ) && (
                      <div>
                        <EditButton
                          onClick={() => {
                            setShowColorPopup(true);
                            setColorInfo(item);
                          }}
                        >
                          Edit
                        </EditButton>
                        <DeleteButton
                          onClick={() => handleDeleteCategory(item, "color")}
                        >
                          Delete
                        </DeleteButton>
                      </div>
                    )
                  ) : (
                    <div>
                      <EditButton
                        onClick={() => {
                          setShowColorPopup(true);
                          setColorInfo(item);
                        }}
                      >
                        Edit
                      </EditButton>
                      <DeleteButton
                        onClick={() => handleDeleteCategory(item, "color")}
                      >
                        Delete
                      </DeleteButton>
                    </div>
                  )}
                </TextEditDel>
              );
            })}
          </div>
          {userData?.role != "super_admin" ? (
            userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/add_fiter_data/add_category"
            ) && (
              <ColorForm
                updatedState={updatedState}
                setUpdatedState={setUpdatedState}
              />
            )
          ) : (
            <ColorForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
          )}
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading>Size</Heading>
        <div>
          <div>
            {data?.size?.map((item, index) => {
              return (
                <TextEditDel key={index}>
                  <SubHeading>{item?.value}</SubHeading>

                  {userData?.role != "super_admin" ? (
                    userData?.backendArr?.some(
                      (item) =>
                        item?.name === "/api/admin/add_fiter_data/add_category"
                    ) && (
                      <div>
                        <EditButton
                          onClick={() => {
                            setShowSizePopup(true);
                            setSizeInfo(item);
                          }}
                        >
                          Edit
                        </EditButton>
                        <DeleteButton
                          onClick={() => handleDeleteCategory(item, "size")}
                        >
                          Delete
                        </DeleteButton>
                      </div>
                    )
                  ) : (
                    <div>
                      <EditButton
                        onClick={() => {
                          setShowSizePopup(true);
                          setSizeInfo(item);
                        }}
                      >
                        Edit
                      </EditButton>
                      <DeleteButton
                        onClick={() => handleDeleteCategory(item, "size")}
                      >
                        Delete
                      </DeleteButton>
                    </div>
                  )}
                </TextEditDel>
              );
            })}
          </div>
          {userData?.role != "super_admin" ? (
            userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/add_fiter_data/add_category"
            ) && (
              <SizeForm
                updatedState={updatedState}
                setUpdatedState={setUpdatedState}
              />
            )
          ) : (
            <SizeForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
          )}
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading style={{ textTransform: "none" }}>
          Weight Groups <span style={{ fontSize: "16px" }}>(in gm)</span>
        </Heading>
        <div>
          <div>
            {data?.weight_group?.map((item, index) => {
              return (
                <TextEditDel key={index}>
                  <SubHeading>{item?.value}</SubHeading>
                  {userData?.role != "super_admin" ? (
                    userData?.backendArr?.some(
                      (item) =>
                        item?.name === "/api/admin/add_fiter_data/add_category"
                    ) && (
                      <div>
                        <EditButton
                          onClick={() => {
                            setShowWeightGroupPopup(true);
                            setWeightGroupInfo(item);
                          }}
                        >
                          Edit
                        </EditButton>
                        <DeleteButton
                          onClick={() =>
                            handleDeleteCategory(item, "weight_group")
                          }
                        >
                          Delete
                        </DeleteButton>
                      </div>
                    )
                  ) : (
                    <div>
                      <EditButton
                        onClick={() => {
                          setShowWeightGroupPopup(true);
                          setWeightGroupInfo(item);
                        }}
                      >
                        Edit
                      </EditButton>
                      <DeleteButton
                        onClick={() =>
                          handleDeleteCategory(item, "weight_group")
                        }
                      >
                        Delete
                      </DeleteButton>
                    </div>
                  )}
                </TextEditDel>
              );
            })}
          </div>
          {userData?.role != "super_admin" ? (
            userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/add_fiter_data/add_category"
            ) && (
              <WeightGroupForm
                updatedState={updatedState}
                setUpdatedState={setUpdatedState}
              />
            )
          ) : (
            <WeightGroupForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
          )}
        </div>
      </CategorySingle>

      <CategorySingle>
        {" "}
        <Heading>Frame Type</Heading>
        <div>
          <div>
            {data?.frame_type?.map((item, index) => {
              return (
                <TextEditDel key={index}>
                  <SubHeading>{item?.value}</SubHeading>
                  {userData?.role != "super_admin" ? (
                    userData?.backendArr?.some(
                      (item) =>
                        item?.name === "/api/admin/add_fiter_data/add_category"
                    ) && (
                      <div>
                        <EditButton
                          onClick={() => {
                            setShowFrameTypePopup(true);
                            setFrameTypeInfo(item);
                          }}
                        >
                          Edit
                        </EditButton>
                        <DeleteButton
                          onClick={() =>
                            handleDeleteCategory(item, "frame_type")
                          }
                        >
                          Delete
                        </DeleteButton>
                      </div>
                    )
                  ) : (
                    <div>
                      <EditButton
                        onClick={() => {
                          setShowFrameTypePopup(true);
                          setFrameTypeInfo(item);
                        }}
                      >
                        Edit
                      </EditButton>
                      <DeleteButton
                        onClick={() => handleDeleteCategory(item, "frame_type")}
                      >
                        Delete
                      </DeleteButton>
                    </div>
                  )}
                </TextEditDel>
              );
            })}
          </div>
          {userData?.role != "super_admin" ? (
            userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/add_fiter_data/add_category"
            ) && (
              <FrameTypeForm
                updatedState={updatedState}
                setUpdatedState={setUpdatedState}
              />
            )
          ) : (
            <FrameTypeForm
              updatedState={updatedState}
              setUpdatedState={setUpdatedState}
            />
          )}
        </div>
      </CategorySingle>

      {/* <CategorySingle>
        {" "}
        <Heading>Price Range</Heading>
        <div>
          <div>
            {data?.price_range?.map((item, index) => {
              return (
                <TextEditDel
                  key={index}
                >
                  {" "}
                  <SubHeading
                    key={index}
                  >
                    {item?.min} - {item?.max}
                  </SubHeading>
                  {userData?.role != "super_admin" ? (
                    userData?.backendArr?.some(
                      (item) => item?.name === "/api/admin/add_fiter_data/add_category"
                    ) && (
                      <div>
                        <EditButton
                          onClick={() => {
                            setShowPriceRangePopup(true);
                            setPriceRangeInfo(item);
                          }}
                        >
                          Edit
                        </EditButton>
                        <DeleteButton
                          onClick={() =>
                            handleDeleteCategory(item, "price_range")
                          }
                        >
                          Delete
                        </DeleteButton>
                      </div>
                    )
                  ) : (
                    <div>
                      <EditButton
                        onClick={() => {
                          setShowPriceRangePopup(true);
                          setPriceRangeInfo(item);
                        }}
                      >
                        Edit
                      </EditButton>
                      <DeleteButton
                        onClick={() =>
                          handleDeleteCategory(item, "price_range")
                        }
                      >
                        Delete
                      </DeleteButton>
                    </div>
                  )}
                </TextEditDel>
              );
            })}
          </div>
          {userData?.role != "super_admin" ? (
            userData?.backendArr?.some(
              (item) => item?.name === "/api/admin/add_fiter_data/add_category"
            ) && (
                <PriceRangeForm
                  updatedState={updatedState}
                  setUpdatedState={setUpdatedState}
                />
            )
          ) : (
              <PriceRangeForm
                updatedState={updatedState}
                setUpdatedState={setUpdatedState}
              />
          )}
        </div>
      </CategorySingle> */}

      {showCategoryPopup && (
        <CategoryPopup
          data={data}
          open={showCategoryPopup}
          setOpen={setShowCategoryPopup}
          categoryInfo={categoryInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></CategoryPopup>
      )}
      {showGenderPopup && (
        <GenderPopup
          open={showGenderPopup}
          setOpen={setShowGenderPopup}
          genderInfo={genderInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></GenderPopup>
      )}
      {showShapePopup && (
        <ShapePopup
          open={showShapePopup}
          setOpen={setShowShapePopup}
          shapeInfo={shapeInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></ShapePopup>
      )}
      {showSizePopup && (
        <SizePopup
          open={showSizePopup}
          setOpen={setShowSizePopup}
          sizeInfo={sizeInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></SizePopup>
      )}
      {showMaterialPopup && (
        <MaterialPopup
          open={showMaterialPopup}
          setOpen={setShowMaterialPopup}
          materialInfo={materialInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></MaterialPopup>
      )}
      {showColorPopup && (
        <ColorPopup
          open={showColorPopup}
          setOpen={setShowColorPopup}
          colorInfo={colorInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></ColorPopup>
      )}
      {showWeightGroupPopup && (
        <WeightGroup
          open={showWeightGroupPopup}
          setOpen={setShowWeightGroupPopup}
          WeightGroupInfo={WeightGroupInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></WeightGroup>
      )}
      {showFrameTypePopup && (
        <FrameTypePopup
          open={showFrameTypePopup}
          setOpen={setShowFrameTypePopup}
          frameTypeInfo={frameTypeInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></FrameTypePopup>
      )}
      {showPriceRangePopup && (
        <PriceRangePopup
          open={showPriceRangePopup}
          setOpen={setShowPriceRangePopup}
          PriceRangeInfo={PriceRangeInfo}
          setUpdatedState={setUpdatedState}
          updatedState={updatedState}
        ></PriceRangePopup>
      )}
      {/* {showPopup ? (
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className="logform-lable custom-placeholder-color">
              Slug
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Slug"
              className="logform-input"
              name="slug"
              value={formik.slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.slug && formik.errors.slug ? (
              <div style={{ color: "red" }}>{formik.errors.slug}</div>
            ) : null}
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="eyeeye-main">
            <Form.Label className="logform-lable">Title</Form.Label>
            <Form.Control
              // type={showPassword ? "text" : "password"}
              placeholder="Title"
              className="logform-input"
              name="title"
              value={formik.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Group>
          {formik.touched.title && formik.errors.title ? (
            <div style={{ color: "red" }}>{formik.errors.title}</div>
          ) : null}

          <Form.Group controlId="formBasicPassword" className="eyeeye-main">
            <Form.Label className="logform-lable">Value</Form.Label>
            <Form.Control
              // type={showPassword ? "text" : "password"}
              placeholder="Category"
              className="logform-input"
              name="category"
              value={formik.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Group>
          {formik.touched.category && formik.errors.category ? (
            <div style={{ color: "red" }}>{formik.errors.category}</div>
          ) : null}

          <Form.Group as={Row} className="mb-3">
            <Col xs={6}>
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Enable/Disable"
                checked={formik.isButtonDisabled}
                onClick={handleButtonClick}
              />
            </Col>
          </Form.Group>

          <Button
            onClick={handleSubmit}
            disabled={isSubmit}
            variant="primary"
            className="login-button"
          >
            {isSubmit ? "Loader" : "Submit"}
          </Button>
        </Form>
      ) : (
        <></>
      )} */}
      <ToastContainer />
    </>
  );
};

export default AddCategory;
