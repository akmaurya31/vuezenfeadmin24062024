import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SocialLinksForm from "./SocialLinksForm";
import SocialLinksPopup from "../../Components/Popups/SocialLinksPopup";
import styled from "styled-components";
import { environmentVariables } from "../../../config/env.config";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";
import Swal from "sweetalert2";

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
const SubHeading = styled.div`
  width: 300px;
  font-size: 14px;
  padding-left: 10px;
`;

const Footer = () => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [resData, setResData] = useState();
  const [description, setDescription] = useState();
  const [socialLinks, setSocialLinks] = useState([]);
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [logo, setLogo] = useState();
  const [showSocialrPopup, setShowSocialPopup] = useState(false);
  const [socialInfo, setSocialInfo] = useState();

  const getResData = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/footer/get`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setResData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        setResData();
      });
  };
  useEffect(() => {
    getResData();
  }, []);

  useEffect(() => {
    if (resData) {
      setLogo(resData?.h1_image);
      setDescription(resData?.h1_description);
      setSocialLinks(resData?.social_media_data);
      setEmail(resData?.footer_email);
      setPhone(resData?.footer_phone);
    }
  }, [resData]);

  const handleUpdate = () => {
    setIsSubmit(true);
    let data = new FormData();

    data.append("h1_description", description);
    data.append("id", resData?.id);
    data.append("h1_image", logo);
    data.append("footer_email", email);
    data.append("footer_phone", phone);

    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/footer/add`,
      withCredentials: true,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        toast.success(response?.data?.message);
        getResData();
        setIsSubmit(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
        setIsSubmit(false);
      });
  };

  const handleDeleteSocialLink = (item) => {
    Swal.fire({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        let config = {
          method: "delete",
          url: `${environmentVariables?.apiUrl}api/admin/footer/delete_by_id?id=${resData?.id}&social_id=${item?.id}`,
          withCredentials: true,
        };
        Swal.showLoading();

        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            getResData();
            toast.success(response?.data?.message);
            Swal.close();
          })
          .catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.message);
            Swal.close();
          });
      }
    });
  };

  const handleChangePhone = (event) => {
    const { value } = event.target;
    const sanitizedValue = value.replace(/[^0-9/_\-+@!#$%&*(){}|\.]/g, ""); // Including underscore (_), hyphen (-), plus (+), and dot (.)
    setPhone(sanitizedValue);
  };
  const handleEmailChange = (event) => {
    const { value } = event.target;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9._@+-]/g, ""); // Keep only valid email characters
    setEmail(sanitizedValue);
  };
  return (
    <div>
      <h2 style={{ marginBottom: "30px" }}>Footer Section</h2>
      <div className="footer-sec">
        <div className="footer-sec-main ui-para" style={{}}>
          <h5>Footer Logo</h5>
          <div className="upload-image-fixed">
            <img
              src={`${environmentVariables?.cdnUrl}uploads/footer/${resData?.h1_image}`}
            />
          </div>
          <div>
            <input
              style={{ margin: "0 0 20px" }}
              placeholder="Choose Logo"
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              // ref={fileInputRef}
            />
          </div>
          <div className="ui-para">
            <h5>Description:</h5>
            <textarea
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="ui-para" style={{ margin: "20px 0" }}>
            <h5>Email:</h5>
            <input type="text" value={email} onChange={handleEmailChange} />
          </div>
          <div className="ui-para">
            <h5>Phone number:</h5>
            <input type="text" value={phone} onChange={handleChangePhone} />
          </div>
          <button
            className="ui-edit-button"
            style={{
              width: "300px",
              backgroundColor: "#032140",
              margin: "20px 0",
            }}
            onClick={() => handleUpdate()}
            disabled={isSubmit}
          >
            {isSubmit ? <ButtonLoader size={30} /> : "Update Changes"}
          </button>
        </div>

        <div className="footer-sec-main" style={{}}>
          <div className="ui-para">
            <h5>Social links:</h5>
            {/* <button onClick={handleAddSocialLink}>+</button> */}
            <ul
              style={{
                marginTop: "20px",
                padding: "0",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {socialLinks?.map((item, index) => {
                return (
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "0 0 20px",
                    }}
                    key={index}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        style={{ paddingRight: "10px" }}
                        src={`${environmentVariables?.cdnUrl}uploads/footer/${item?.image}`}
                      />
                      <SubHeading>{item?.url}</SubHeading>
                    </div>
                    <div>
                      <EditButton
                        onClick={() => {
                          setShowSocialPopup(true);
                          setSocialInfo(item);
                        }}
                      >
                        Edit
                      </EditButton>
                      <DeleteButton
                        onClick={() => handleDeleteSocialLink(item)}
                      >
                        Delete
                      </DeleteButton>
                    </div>
                  </li>
                );
              })}
            </ul>
            <SocialLinksForm getResData={getResData} resData={resData} />
          </div>
        </div>
      </div>

      {showSocialrPopup && (
        <SocialLinksPopup
          open={showSocialrPopup}
          setOpen={setShowSocialPopup}
          socialInfo={socialInfo}
          getResData={getResData}
          resData={resData}
        ></SocialLinksPopup>
      )}
    </div>
  );
};

export default Footer;
