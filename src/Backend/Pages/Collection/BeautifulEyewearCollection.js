import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { environmentVariables } from "../../../config/env.config";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Modal, Form, Button } from "react-bootstrap";
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

const BeautifulEyewearCollection = () => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [collectionData, setCollectionData] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [collectionId, setCollectionId] = useState("");
  const { userData } = useContext(userContext);
  const handleSubmit = () => {
    if (image) {
      setIsSubmit(true);
      let data = new FormData();
      data.append("name", name);
      data.append("slug", slug);
      data.append("collection_img", image);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${environmentVariables?.apiUrl}api/admin/collection/add_beautiful_eyewear?id=${collectionId}`,
        withCredentials: true,
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          getCollectionData();
          setCollectionId("");
          handleClose();
          toast.success("Data Added ");
          setIsSubmit(false);
        })
        .catch((error) => {
          setCollectionId("");
          toast.error(error?.response?.data?.message || error?.message);
          setIsSubmit(false);
        });
    } else {
      toast.error("Image is not allowed to be empty");
    }
  };
  const handleAddCollection = () => {
    setName("");
    setSlug("");
    setImage("");
    setCollectionId("");
    handleShow();
  };
  const handleEditCollection = (val) => {
    setName(val?.name);
    setCollectionId(val?.id);
    setSlug(val?.slug);
    setImage("");
    handleShow();
  };
  const handleDeleteCollection = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete?",
      confirmButtonText: "Delete it",
      showCancelButton: true,
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: `${environmentVariables?.apiUrl}api/admin/collection/delete_beautiful_eyewear/${id}`,
          withCredentials: true,
        };
        Swal.showLoading();

        axios
          .request(config)
          .then((response) => {
            getCollectionData();
            toast.success("deleted successfully");
            Swal.close();
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message);
            Swal.close();
          });
      }
    });
  };
  const getCollectionData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/collection/get_beautiful_eyewear`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setCollectionData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getCollectionData();
  }, []);

  const handleNameChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setName(alphanumericValue);
  };
  const handleSlugChange = (event) => {
    const { value } = event.target;
    const sanitizedValue = value
      .replace(/\+/g, "") // Remove '+'
      .replace(/[^a-zA-Z0-9/_\-\.]/g, ""); // Including underscore (_), hyphen (-), plus (+), and dot (.)
    setSlug(sanitizedValue);
  };
  return (
    <div>
      {userData?.role != "super_admin" ? (
        userData?.backendArr?.some(
          (item) => item?.name === "/api/admin/collection/add_beautiful_eyewear"
        ) && (
          <div>
            <button onClick={handleAddCollection}>Add +</button>
          </div>
        )
      ) : (
        <div>
          <button className="add-button" onClick={handleAddCollection}>
            + Add Collection
          </button>
        </div>
      )}

      <div className="beautiful-boxes-main">
        {collectionData &&
          collectionData.map((val) => (
            <div className="beautiful-box">
              <div>
                <strong>Name: </strong>
                {val?.name}
              </div>
              <div>
                <strong>Slug: </strong>
                {val?.slug}
              </div>
              <div>
                <img
                  src={`${environmentVariables?.cdnUrl}uploads/ui/${val?.image}`}
                />
              </div>
              {userData?.role != "super_admin" ? (
                userData?.backendArr?.some(
                  (item) =>
                    item?.name === "/api/admin/collection/add_beautiful_eyewear"
                ) && (
                  <div className="beautiful-buttons">
                    <button
                      className="del-button"
                      onClick={() => handleDeleteCollection(val?.id)}
                    >
                      delete
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => handleEditCollection(val)}
                    >
                      Edit
                    </button>
                  </div>
                )
              ) : (
                <div className="beautiful-buttons">
                  <button
                    className="del-button"
                    onClick={() => handleDeleteCollection(val?.id)}
                  >
                    delete
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => handleEditCollection(val)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Collection</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={name}
                  type="text"
                  placeholder="Enter Name"
                  autoFocus
                  onChange={handleNameChange}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Slug</Form.Label>
                <Form.Control
                  value={slug}
                  type="text"
                  placeholder="Enter Slug"
                  onChange={handleSlugChange}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
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
    </div>
  );
};

export default BeautifulEyewearCollection;
