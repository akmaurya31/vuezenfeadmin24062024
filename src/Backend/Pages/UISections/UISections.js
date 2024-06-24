import React, { useContext, useEffect, useRef, useState } from "react";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
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

const UISections = () => {
  const [isSubmit, setIsSubmit] = useState(false);

  const fileInputRef = useRef(null);
  const [uiSections, setUiSections] = useState(null);
  const [filteredUISection, setFilteredUiSection] = useState({});
  const [show, setShow] = useState(false);
  const [offerData, setOfferData] = useState();
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [remarks, setRemarks] = useState("");
  const [titleEdit, setTitleEdit] = useState("");
  const [descriptionEdit, setDescriptionEdit] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const handleshowEdit = () => setShowEdit(true);
  const handleCloseEdit = () => setShowEdit(false);
  const { userData } = useContext(userContext);

  const [slug, setSlug] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = () => {
    setIsSubmit(true);
    let data = new FormData();
    data.append("ui_image", image);
    data.append("slug", slug);
    data.append("module_heading", heading);
    data.append("position", filteredUISection.position);
    data.append("module_description", description);
    data.append("title ", heading);
    data.append("remarks", remarks);
    data.append("status", "active");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/ui/add_ui_sections`,
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
  const handleEditUISection = (position) => {
    const filteredUiSection = uiSections.find(
      (val) => val.position === position
    );
    setFilteredUiSection(filteredUiSection);
    setHeading(filteredUiSection.module_heading);
    setDescription(filteredUiSection.module_description);
    setSlug(filteredUiSection.slug);
    setRemarks(filteredUiSection.remarks);
    handleShow();
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const getUISections = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/ui/get_ui_sections`,
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
  const handleEditOfferData = () => {
    handleshowEdit();
  };

  const handleSlugChange = (event) => {
    const { value } = event.target;
    const sanitizedValue = value
      .replace(/\+/g, "")
      .replace(/[^a-zA-Z0-9/_\-\.]/g, "");
    setSlug(sanitizedValue);
  };
  const editOfferData = (id) => {
    setIsSubmit(true);
    let data = new FormData();
    data.append("title", titleEdit);
    data.append("description", descriptionEdit);
    data.append("status", "active");
    data.append("id", id);
    data.append("position", 1);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/offer/add`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getOfferDataTop();
        handleCloseEdit();
        toast.success("Data updated");
        setIsSubmit(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
        setIsSubmit(false);
      });
  };
  const getOfferDataTop = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/offer/get`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        if (response?.data?.data.length > 0) {
          setOfferData(response?.data?.data[0]);
          setTitleEdit(response?.data?.data[0]?.title);
          setDescriptionEdit(response?.data?.data[0]?.description);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getUISections();
    getOfferDataTop();
  }, []);

  return (
    <div>
      <div style={{ margin: "20px 0px" }}>
        <div className="ui-heading">
          <strong>Title: </strong>
          {offerData?.title}
        </div>
        <div className="ui-para">
          <strong>Description: </strong>
          {offerData?.description}
        </div>

        {userData?.role != "super_admin" ? (
          userData?.backendArr?.some(
            (item) => item?.name === "/api/admin/offer/add"
          ) && (
            <button
              className="ui-edit-button"
              onClick={(e) => handleEditOfferData(offerData?.id)}
            >
              Edit
            </button>
          )
        ) : (
          <button
            className="ui-edit-button"
            onClick={(e) => handleEditOfferData(offerData?.id)}
          >
            Edit
          </button>
        )}
      </div>

      {uiSections &&
        uiSections.map((val) => (
          <div style={{ margin: "20px 0px" }} key={val.position}>
            <div className="ui-heading">
              <strong>Heading: </strong>
              {val?.module_heading}
            </div>
            <div className="ui-para">
              <strong>Description: </strong>
              {val?.module_description}
            </div>
            <div className="ui-slug">
              <strong>Slug: </strong>
              {val?.slug}
            </div>
            {val?.image && (
              <div style={{ cursor: "pointer" }} onClick={handleImageClick}>
                <img
                  style={{ width: "200px" }}
                  src={`${environmentVariables?.cdnUrl}uploads/ui/${val?.image}`}
                  alt={val?.module_heading}
                />
              </div>
            )}
            {userData?.role != "super_admin" ? (
              userData?.backendArr?.some(
                (item) => item?.name === "/api/admin/offer/add"
              ) && (
                <button
                  className="ui-edit-button"
                  onClick={() => handleEditUISection(val?.position)}
                >
                  Edit
                </button>
              )
            ) : (
              <button
                className="ui-edit-button"
                onClick={() => handleEditUISection(val?.position)}
              >
                Edit
              </button>
            )}

            <input type="file" style={{ display: "none" }} ref={fileInputRef} />
          </div>
        ))}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit UI Sections</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Heading</Form.Label>
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
              <Form.Label>Description</Form.Label>
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                as="textarea"
                rows={3}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                value={slug}
                placeholder="/sunglasses-men"
                autoFocus
                onChange={handleSlugChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Image</Form.Label>
              <Form.Control
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
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
                rows={3}
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
            {isSubmit ? <ButtonLoader size={30} /> : " Save Changes"}
          </AddCategoryButton>
        </Modal.Footer>
      </Modal>
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit UI Offer Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={titleEdit}
                type="text"
                placeholder=""
                autoFocus
                onChange={(e) => setTitleEdit(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                onChange={(e) => setDescriptionEdit(e.target.value)}
                value={descriptionEdit}
                as="textarea"
                rows={3}
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
            onClick={() => editOfferData(offerData?.id)}
            disabled={isSubmit}
          >
            {isSubmit ? <ButtonLoader size={30} /> : "Save Changes"}
          </AddCategoryButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UISections;
