import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import axios from "axios";
import { environmentVariables } from "../config/env.config";
import ButtonLoader from "../Backend/Components/ButtonLoader/ButtonLoader.js";
import "./LoginStyle.css";
import Mainlogo from "../Images/logo.webp";
import { useFormik } from "formik";
import * as yup from "yup";
import CircularLoader from "../Backend/Components/CircularLoader/CircularLoader.js";
import { userContext } from "../context/userContext.js";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
  const siteKey = environmentVariables?.siteKey;
  const captchaRef = useRef();

  const onChangeRecaptcha = (value) => {
    formik.setFieldValue("captchaValue", value);
  };


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      captchaValue : ""
    },
    validationSchema: yup.object().shape({
      email: yup.string().required().email("please enter valid email"),
      password: yup.string().required().min(8),
      captchaValue: yup.string().required("Please complete the reCAPTCHA"),
    }),

    onSubmit: async () => {
      setIsSubmit(true);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${environmentVariables?.apiUrl}api/admin/login`,
        data: formik.values,
      };

      axios
        .request(config)
        .then((response) => {
          console.log('response', response)
          toast.success(response.data.message);
          setIsSubmit(false);
          Swal.fire({
            title: 'OTP',
            text: 'Please enter OTP',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off',
              inputmode: 'numeric',
              pattern: '[0-9]{4}',
              maxLength: 4 
            },
            inputValidator: (value) => {
              if (!value || !/^[0-9]{4}$/.test(value)) {
                return 'Please enter a valid 4-digit OTP.';
              }
            },
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showLoaderOnConfirm: true,
            preConfirm: (otp) => {
              const otpValue = otp;
              let configOtp = {
                method: "post",
                maxBodyLength: Infinity,
                url: `${environmentVariables?.apiUrl}api/admin/login_with_otp`,
                data: { email: formik.values.email, otp_code: otpValue },
              };
              return axios
                .request(configOtp)
                .then((res) => {
                  console.log('res', res);
                  toast.success(res?.data?.message);
                  setIsUserLogin(true);
                  // navigate("/dashboard");
                  return
                })
                .catch((err) => {
                  // toast.error(err?.response?.data?.message || err?.message);
                  console.log('error', err)
                  Swal.showValidationMessage(
                    `Failed: ${err?.response?.data?.message}`
                  );
                });
            }
          })
          // .then((result) => {
          //   if (result.isConfirmed) {
          //     // Handle success
          //     console.log('result',result)
          //     Swal.fire({
          //       icon: 'success',
          //       title: 'API Response',
          //       text: result.value.message
          //     });
          //   }
          // });
        })
        .catch((error) => {
          setIsSubmit(false);
          toast.error(error?.response?.data?.message || error?.message);
        });
    },
  });
  const baseUrl = environmentVariables?.apiUrl;
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isUserLogin, setIsUserLogin } = useContext(userContext);

  useEffect(() => {
    if (isUserLogin) {
      // navigate("/dashboard");
    }
  }, [isUserLogin]);
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

                    <div className="form-group clearfix">
                      <div className="form-box">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control clear_string login_inputfield"
                          placeholder="Enter Your Password*"
                          name="password"
                          key="password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        >
                          {showPassword ? (
                            <i className="fas fa-eye Eeye"></i>
                          ) : (
                            <i className="fas fa-eye-slash Eeye"></i>
                          )}
                        </span>
                        <i
                          className="fa fa-key input_icons"
                          aria-hidden="true"
                        ></i>
                      </div>
                      {formik.touched.password && formik.errors.password ? (
                        <div style={{ color: "red" }}>
                          {formik.errors.password}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div controlId="formBasicPassword" className="eyeeye-main">
                      <ReCAPTCHA
                        sitekey={siteKey}
                        onChange={onChangeRecaptcha}
                        ref={captchaRef}
                      />
                    </div>
                    {formik.touched.captchaValue && formik.errors.captchaValue ? (
                      <div style={{ color: "red" }}>{formik.errors.captchaValue}</div>
                    ) : null}

                    <div className="checkbox form-group clearfix mt-3">
                      <Link
                        to="/forgot-password"
                        className="link-light float-end forgot-password"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <div className="form-group clearfix mb-0">
                      <button
                        onClick={formik.handleSubmit}
                        type="button"
                        className="btn-theme login_button"
                        disabled={isSubmit}
                      >
                        {isSubmit ? <CircularLoader size={30} /> : "Login"}
                      </button>
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
}
export default Login;
//1112
