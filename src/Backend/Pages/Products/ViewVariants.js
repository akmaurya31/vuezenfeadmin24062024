import React, { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Form } from "react-bootstrap";
import axios from "axios";
import { environmentVariables } from "../../../config/env.config";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { userContext } from "../../../context/userContext";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";
const FormFileInput = styled.input`
  width: 100%;
  border-radius: 5px;
`;
const ImageSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const ImageWrapper = styled.div`
  position: relative;
`;
const Image1 = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
`;
const CirleCross = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  background-color: green; /* Adjust the background color as needed */
  border-radius: 50%;
  z-index: -1;
`;
const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  // background: transparent;
  border: none;
  color: red;
  cursor: pointer;
`;
const ViewVariants = () => {
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [isSubmit, setIsSubmit] = useState(false);

  // const fetchProductVariantById = async () => {
  //   const response = await axios.get(
  //     `${environmentVariables?.apiUrl}api/admin/product/fetch_product_variant_by_id?id=${id}`,
  //     {
  //       withCredentials: true,
  //     }
  //   );

  //   return response?.data?.data;
  // };

  // const { data, isLoading, error, refetch } = useQuery(
  //   "variantbyid",
  //   fetchProductVariantById
  // );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const { userData } = useContext(userContext);

  const [thumbnail, setThumbNail] = useState();
  const [status, setStatus] = useState();

  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState();
  const updateProductVariant = () => {
    if (!thumbnail) {
      setImageError("Image is Required");
    } else {
      setIsSubmit(true);

      let data = new FormData();
      data.append("variant_id", id);
      data.append("variant_image", thumbnail);
      data.append("status", status);

      let config = {
        method: "post",
        url: `${environmentVariables?.apiUrl}api/admin/product/edit_product_variant`,
        withCredentials: true,
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          getProductVariantById();
          toast.success("Variant Updated Successfully");
          setIsSubmit(false);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || error?.message);
          setIsSubmit(false);
        });
    }
  };

  const getProductVariantById = () => {
    setLoading(true);
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/product/fetch_product_variant_by_id?id=${id}`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setData();
      });
  };

  useEffect(() => {
    getProductVariantById();
  }, [id]);
  useEffect(() => {
    if (data) {
      setThumbNail(data?.thumbnail_url);
      setStatus(data?.status);
      // setVariantName(data?.variant_name);
      // setPrice(data?.variant_price_details?.[0]?.price);
      // setStock(data?.variant_price_details?.[0]?.stock);
      // setDiscount(data?.variant_price_details?.[0]?.discount);
      setImages(data?.variantImageObj?.images);
    }
  }, [data]);
  const MultipleFileChange = (e) => {
    const formdata = new FormData();
    // for (let i = 0; i < e.target.files.length; i++) {
    //   formdata.append("variant_image_Arr", e.target.files[i]);
    // }
    for (const file of e.target.files) {
      formdata.append("variant_image_Arr", file);
    }
    formdata.append("variant_id", id);
    formdata.append("product_id", data?.product_id);

    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/product/add_product_variant_Images`,
      withCredentials: true,
      data: formdata,
    };

    axios
      .request(config)
      .then((response) => {
        getProductVariantById();
        toast.success("Variant Updated Successfully");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      });
  };

  const removeImage = async (imageName) => {
    let data = {
      variant_id: id,
      variantImageName: imageName,
    };

    let config = {
      method: "put",
      url: `${environmentVariables?.apiUrl}api/admin/product/edit_product_variant_Images`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        getProductVariantById();
        toast.success("Variant Updated Successfully");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      });
  };
  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setStatus(newStatus);
  };

  if (loading) return <h1>Loading</h1>;
  return (
    <div>
      <div style={{fontSize:"18px", fontWeight:"500", marginBottom:"20px"}}>Add Variant Image <span style={{fontSize:"14px"}}> (Shown on product listing page)</span></div>
      <div>
        {data && (
          <div>
            <img src={`${environmentVariables?.cdnUrl}uploads/${thumbnail}`} />
            <input
              className="choose-file"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbNail(e.target.files[0])}
              ref={fileInputRef}
              onClick={() => setImageError()}
            />
            {imageError && <div style={{ color: "red" }}>{imageError}</div>}
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Enable/Disable"
              checked={status === "active"}
              onChange={handleSwitchChange}
              onClick={() => setImageError()}
            />

            {userData?.role != "super_admin" ? (
              userData?.backendArr?.some(
                (item) => item?.name === "/api/admin/product/add_product"
              ) && (
                <button
                  className="add-button"
                  onClick={() => updateProductVariant()}
                  disabled={isSubmit}
                >
                  {isSubmit ? <ButtonLoader size={30} /> : "Update Variant"}
                </button>
              )
            ) : (
              <button
                className="add-button"
                onClick={() => updateProductVariant()}
                disabled={isSubmit}
              >
                {isSubmit ? <ButtonLoader size={30} /> : "Update Variant"}
              </button>
            )}
          </div>
        )}

          {userData?.role != "super_admin" ? (
              userData?.backendArr?.some(
                (item) =>
                  item?.name === "/api/admin/product/add_product"
              ) && (
                <div>
                {" "}
                <label style={{fontSize:"18px", fontWeight:"500", marginBottom:"20px"}}>Add Variant Images <span style={{fontSize:"14px"}}> (Shown on Product detail page, File size : 500kb max, Image Dimensions: 590X295 )</span></label>
                <FormFileInput
                  className="choose-file"
                  type="file"
                  multiple
                  name="myFiles"
                  onChange={(e) => MultipleFileChange(e)}
                />
              </div>

              )) : (
                <div>
                {" "}
                <label style={{fontSize:"18px", fontWeight:"500", marginBottom:"20px"}}>Add Variant Images <span style={{fontSize:"14px"}}> (Shown on Product detail page, File size : 500kb max, Image Dimensions: 590X295 ) </span></label>
                <FormFileInput
                  className="choose-file"
                  type="file"
                  multiple
                  name="myFiles"
                  onChange={(e) => MultipleFileChange(e)}
                />
              </div>
          )}
       

        <ImageSection>
          {images?.map((image) => (
            <ImageWrapper key={image}>
              <CirleCross></CirleCross>
              <Image1
                src={`${environmentVariables?.cdnUrl}uploads/${image}`}
                alt="Image"
              />
              <RemoveButton onClick={() => removeImage(image)}>
                delete
                {/* <FaTimes /> */}
              </RemoveButton>
            </ImageWrapper>
          ))}
        </ImageSection>
      </div>
    </div>
  );
};

export default ViewVariants;
