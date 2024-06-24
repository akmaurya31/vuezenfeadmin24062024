import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Mainlogo from "../../../Images/logo.webp";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../../../Backend/Components/CircularLoader/CircularLoader.js";
import { environmentVariables } from "../../../config/env.config";
import ReCAPTCHA from "react-google-recaptcha";
const ForgetPassword = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const siteKey = environmentVariables?.siteKey;
  const captchaRef = useRef();

  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [isOtp, setIsOtp] = useState(false);
  let initialTime = 5;
  const [time, setTime] = useState(initialTime);

  const onChangeRecaptcha = (value) => {
    formik.setFieldValue("captchaValue", value);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      captchaValue : ""
    },
    validationSchema: yup.object().shape({
      email: yup.string().email().required().email("please enter valid email"),
      captchaValue: yup.string().required("Please complete the reCAPTCHA"),

    }),

    onSubmit: async () => {
      //   setIsSubmit(true);

      console.log(formik?.values?.email);
      let config = {
        method: "put",
        url: `${environmentVariables?.apiUrl}api/admin/forgot_password`,
        data: {
          email: formik?.values?.email,
          captchaValue : formik?.values?.captchaValue
        },
      };

      axios
        .request(config)
        .then((response) => {
          console.log("response", response);

          setIsOtp(true);
          setIsSubmit(false);
          const timer = setInterval(() => {
            setTime((prev) => {
              if (prev > 0) {
                return prev - 1;
              } else {
                clearInterval(timer);
                return 0;
              }
            });
          }, 1000);
          return () => {
            clearInterval(timer);
          };
        })
        .catch((error) => {
          setIsSubmit(false);
          toast.error(error?.response?.data?.message || error?.message);
        });
    },
  });

  const handleSubmitOtp = () => {
    setTime(initialTime);

    let config = {
      method: "put",
      url: `${environmentVariables?.apiUrl}api/admin/forgot_password`,
      data: {
        email: formik?.values?.email,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setIsOtp(true);
        setIsSubmit(false);
        const timer = setInterval(() => {
          setTime((prev) => {
            if (prev > 0) {
              return prev - 1;
            } else {
              clearInterval(timer);
              return 0;
            }
          });
        }, 1000);
        return () => {
          clearInterval(timer);
        };
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message, {
          autoClose: 2000,
        });
        setIsSubmit(false);
      });
  };

  const handleChangeOtp = (e, index) => {
    const inputValue = e.target.value;
    if (
      /^[0-9]*$/.test(inputValue) ||
      inputValue === "" ||
      e.Key === "Backspace" ||
      e.key === "Delete"
    ) {
      let arr = [...otp];
      arr[index] = inputValue;
      setOtp(arr);
      if (
        index < inputRefs.length - 1 &&
        inputValue !== "" &&
        e.key !== "Delete" &&
        e.key !== "Backspace"
      ) {
        inputRefs[index + 1].current.focus();
      }
      if (e.key == "Backspace" && index > 0) {
        inputRefs[index - 1].current.focus();
        let arr = [...otp];
        arr[arr.length - 1] = "";
        setOtp(arr);
      }
    } else {
      e.preventDefault();
    }
  };
  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    let formattedMin = String(minutes).padStart(2, "0");
    let formattedSec = String(seconds).padStart(2, "0");
    return `${formattedMin}:${formattedSec}`;
  };
  const handleSubmitVerify = () => {
    const newOtp = otp.join("");

    setIsSubmit(true);

    let data = {
      email: formik.values.email,
      otp_code: newOtp,
    };

    let config = {
      method: "put",
      url: `${environmentVariables?.apiUrl}api/admin/verify_otp`,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        navigate("/reset-password", { state: { data: formik.values.email, otp: otp } });
        setIsSubmit(false);
        setOtp(["", "", "", ""]);
      })
      .catch((error) => {
        setOtp(["", "", "", ""]);
        toast.error(error?.response?.data?.message || error?.message, {
          autoClose: 2000,
        });
        setIsSubmit(false);
      });
  };
  return (
    <>
      <div className="login-23">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-5 col-lg-6 col-md-12 bg-color-23">
              <div className="form-section">
                <div className="logo"></div>
                <h3>
                  <Link to="/">
                    <img src={Mainlogo} />
                  </Link>
                </h3>
                <div className="login-inner-form">
                  <form>
                    <div className="form-group clearfix">
                      <div className="form-box">
                        <input
                          type="text"
                          className="form-control clear_string login_inputfield"
                          placeholder="Enter Your Email*"
                          name="email"
                          value={formik.values.email}
                          required=""
                          key="email"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <i
                          className="fa fa-envelope input_icons"
                          aria-hidden="true"
                        ></i>
                      </div>
                      {formik.touched.email && formik.errors.email ? (
                        <div style={{ color: "red" }}>
                          {formik.errors.email}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    {
                      !isOtp && (
                        <>
                          <Form.Group controlId="formBasicPassword" className="eyeeye-main">
                          <ReCAPTCHA
                            sitekey={siteKey}
                            onChange={onChangeRecaptcha}
                            ref={captchaRef}
                          />
                          </Form.Group>
                          {formik.touched.captchaValue && formik.errors.captchaValue ? (
                            <div style={{ color: "red" }}>{formik.errors.captchaValue}</div>
                          ) : null}
                      </>
                      )
                    }

                    {isOtp ? (
                      <>
                        <Form.Label className="logform-lable custom-placeholder-color">
                          Enter OTP
                        </Form.Label>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              className="square-input"
                              maxLength="1"
                              value={digit}
                              onChange={(e) => handleChangeOtp(e, index)}
                              onKeyDown={(e) => handleChangeOtp(e, index)}
                              ref={inputRefs[index]}
                            />
                          ))}
                        </div>
                        <div>
                          <span
                            onClick={() => {
                              if (time == 0) handleSubmitOtp();
                            }}
                            style={
                              time == 0
                                ? {
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                  }
                                : {
                                    textDecoration: "underline",
                                    cursor: "default",
                                  }
                            }
                          >
                            Resend OTP
                          </span>{" "}
                          in {formatTime(time)}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}

                    <div className="form-group clearfix mb-0">
                      <button
                        onClick={
                          isOtp ? handleSubmitVerify : formik.handleSubmit
                        }
                        type="button"
                        className="btn-theme login_button"
                        disabled={isSubmit}
                      >
                        {isSubmit ? <CircularLoader size={30} /> : "Submit"}
                      </button>
                    </div>
                    <div className="checkbox form-group clearfix mt-3">
                      {/* <h3>
                        Already a member?{" "}
                        <span onClick={() => navigate("/")}> Login here</span>
                      </h3> */}
                      <h5>Already a member?</h5>
                      <Link
                        to="/"
                        className="link-light float-end forgot-password"
                      >
                        Login here
                      </Link>
                    </div>

                    <ToastContainer />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
