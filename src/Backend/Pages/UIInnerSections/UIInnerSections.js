import React, { useContext, useEffect, useRef, useState } from "react";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import styled from "styled-components";
import { userContext } from "../../../context/userContext";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";

// Create a styled component
const EditButton = styled.button`
  font-size: 18px;
  padding: 15px 20px;
  border: 1px solid #0000001f;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  width: 200px;
  margin-bottom: 20px;
  border-radius: 5px;
  &:hover {
    background-color: lightgray;
  }
`;
const Heading = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #4d4d4d;
`;
const Description = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #4d4d4d;
`;
const BackColor = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
  display: flex;
  color: #202020;
  background-color: #fff;
  padding: 10px 5px;
  border-radius: 10px;
  width: 180px;
  align-items: center;
  justify-content: center;
`;
const ColorBox = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50px;
  margin-left: 5px;
  border: 2px solid #fff;
`;
const MainImage = styled.div`
  width: 300px;
  max-height: 210px;
  overflow: hidden;
  img {
    width: 100%;
  }
`;
const MainBannerBox = styled.div`
  margin: 20px 0px 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
const BannerBox = styled.div`
  width: 100%;
  margin: 20px 0px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 11px 6px #00000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const LeftContent = styled.div`
  padding: 30px;
`;

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

const UIInnerSections = () => {
  const [isSubmit, setIsSubmit] = useState(false);

  const fileInputRef = useRef(null);
  const [uiSections, setUiSections] = useState(null);
  const [filteredUISection, setFilteredUiSection] = useState({});
  const [categoriesData, setCategoriesData] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("Select category");
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("Select Sub category");

  const [show, setShow] = useState(false);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [remarks, setRemarks] = useState("");
  const [color, setColor] = useState("");
  const [slug, setSlug] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { userData } = useContext(userContext);
  const handleSubmit = () => {
    setIsSubmit(true);
    let data = new FormData();
    data.append("ui_image", image);
    data.append("slug", slug);
    data.append("heading", heading);
    data.append("category_id", categoryId);
    data.append("sub_category_id", subCategoryId);
    data.append("description", description);
    data.append("color", color);
    data.append("status", "active");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/ui_inner_section/add_ui_inner_sections`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getUISections();
        handleClose();
        toast.success("Data updated");
        setIsSubmit(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
        setIsSubmit(false);
      });
  };
  const handleEditUISection = (values) => {
    setCategoryId(values?.category_id);
    setSubCategoryId(values?.sub_category_id);
    setFilteredUiSection(values);
    setHeading(values.heading);
    setDescription(values.description);
    setSlug(values.slug);
    setColor(values.color);
    setRemarks(values.remarks);
    handleShow();
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleAddCoupon = () => {
    handleShow();
  };

  const getUISections = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/ui_inner_section/get_data`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setUiSections(response.data.data);
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
  useEffect(() => {
    getUISections();
    getCategoriesData();
  }, []);

  return (
    <div>
      {userData?.role != "super_admin" ? (
        userData?.backendArr?.some(
          (item) =>
            item?.name === "/api/admin/ui_inner_section/add_ui_inner_sections"
        ) && (
          <div className="mb-3" style={{ width: "50%" }}>
            <button className="add-button" onClick={handleAddCoupon}>
              Add New Section
            </button>
          </div>
        )
      ) : (
        <div className="mb-3" style={{ width: "50%" }}>
          <button className="add-button" onClick={handleAddCoupon}>
            Add New Section
          </button>
        </div>
      )}
      {uiSections &&
        uiSections.map((val) => (
          <MainBannerBox key={val.position}>
            <BannerBox
              style={{
                backgroundColor: val?.color || "#fff",
              }}
            >
              <LeftContent>
                <Heading>
                  Heading:
                  {val?.heading}
                </Heading>
                <Description>
                  Description:
                  {val?.description}
                </Description>
                {/* <div>
                  Slug:
                  {val?.slug}
                </div> */}
                <BackColor>
                  Background Color:
                  <ColorBox
                    style={{
                      backgroundColor: val?.color || "#fff",
                    }}
                  ></ColorBox>
                </BackColor>
              </LeftContent>

              {val?.image && (
                <MainImage
                  style={{ cursor: "pointer" }}
                  onClick={handleImageClick}
                >
                  <img
                    src={`${environmentVariables?.cdnUrl}uploads/ui/${val?.image}`}
                    alt={val?.module_heading}
                  />
                </MainImage>
              )}
            </BannerBox>
            {userData?.role != "super_admin" ? (
              userData?.backendArr?.some(
                (item) =>
                  item?.name ===
                  "/api/admin/ui_inner_section/add_ui_inner_sections"
              ) && (
                <EditButton onClick={() => handleEditUISection(val)}>
                  Edit Banner
                </EditButton>
              )
            ) : (
              <EditButton onClick={() => handleEditUISection(val)}>
                Edit Banner
              </EditButton>
            )}

            <input type="file" style={{ display: "none" }} ref={fileInputRef} />
          </MainBannerBox>
        ))}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add / Edit Inner Sections</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Heading{" "}
                <span style={{ fontSize: "12px" }}> ( Max 20-24 letters )</span>
              </Form.Label>
              <Form.Control
                value={heading}
                type="text"
                placeholder=""
                autoFocus
                onChange={(e) => setHeading(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>
                Description{" "}
                <span style={{ fontSize: "12px" }}> ( Max 30-40 letters )</span>
              </Form.Label>
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                as="textarea"
                rows={3}
              />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                value={slug}
                placeholder="/sunglasses-men"
                autoFocus
                onChange={(e) => setSlug(e.target.value)}
              />
            </Form.Group> */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Category</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setCategoryName(e.target.name);
                }}
                // onBlur={formik.handleBlur}
                value={categoryId}
                name="category"
              >
                <option value={categoryName}>{categoryName} </option>
                {categoriesData.categories
                  ?.filter((item) => item?.status == "active")
                  ?.map((item, index) => {
                    return (
                      <option value={item?.id} key={index} name={item?.title}>
                        {item?.title}
                      </option>
                    );
                  })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Sub Category</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setSubCategoryId(e.target.value);
                  setSubCategoryName(e.target.name);
                }}
                // onBlur={formik.handleBlur}
                value={subCategoryId}
                name="category"
              >
                <option value={subCategoryName}>{subCategoryName} </option>
                {categoriesData.gender
                  ?.filter((item) => item?.status == "active")
                  ?.map((item, index) => {
                    return (
                      <option value={item?.id} key={index} name={item?.value}>
                        {item?.value}
                      </option>
                    );
                  })}
              </Form.Select>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>
                Inner Banner Image{" "}
                <span style={{ fontSize: "12px" }}>
                  {" "}
                  ( Size: 394px X 350px )
                </span>
              </Form.Label>
              <Form.Control
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
              style={{ display: "flex", gap: "20px", alignItems: "center" }}
            >
              <Form.Label>Background Color:</Form.Label>
              <Form.Control
                onChange={(e) => setColor(e.target.value)}
                type="color"
                value={color}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Remarks (optional)</Form.Label>
              <Form.Control
                onChange={(e) => setRemarks(e.target.value)}
                value={remarks}
                as="textarea"
                rows={1}
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

export default UIInnerSections;
