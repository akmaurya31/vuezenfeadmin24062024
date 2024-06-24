import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Mainlogo from "../../../Images/logo.webp";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../../Components/CircularLoader/CircularLoader";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";

const ResetPassword = () => {
  const { state } = useLocation();
  const [email, setEmail] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const initialValues = {
    password: "",
    confirm: "",
  };

  let formik = useFormik({
    initialValues: initialValues,
    validationSchema: yup.object({
      password: yup
        .string()
        .min(8, "Password must be atleast 8 characters")
        .matches(/[a-z]/, "Password must contain atleast one lowercase")
        .matches(/[A-Z]/, "Password must contain atleast one uppercase")
        .matches(/\d/, "Password must contain atleast one digit")
        .matches(
          /[!@#$%^&*]/,
          "Password must contain atleast one special character"
        )
        .required("Password is required"),
      confirm: yup
        .string()
        .oneOf([yup.ref("password"), null], "Password must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      setIsSubmit(true);
      const newOtp = state?.otp?.join("");
      let data = {
        email: email,
        password: values.password,
        otp_code: newOtp,  
      };

      let config = {
        method: "put",
        url: `${environmentVariables?.apiUrl}api/admin/reset_password`,
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          toast.success("Password Changed Successfully", {
            autoClose: 2000,
          });
          setIsSubmit(false);
          navigate("/");
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || error?.message, {
            autoClose: 2000,
          });
          setIsSubmit(false);
        });
    },
  });

  useEffect(() => {
    if (state?.data) {
      setEmail(state?.data);
    } else {
      navigate("/login");
    }
  }, [state]);
  const { values, errors, handleSubmit } = formik;
  return (
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
                        type="password"
                        className="form-control clear_string login_inputfield"
                        placeholder="New Password"
                        // className="logform-input"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <i
                        className="fa fa-envelope input_icons"
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

                  <div className="form-box">
                    <input
                      type="password"
                      className="form-control clear_string login_inputfield"
                      placeholder="Confirm Your Password"
                      //   className="logform-input"
                      name="confirm"
                      value={formik.values.confirm}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <i
                      className="fa fa-envelope input_icons"
                      aria-hidden="true"
                    ></i>
                  </div>
                  {formik.touched.confirm && formik.errors.confirm ? (
                    <div style={{ color: "red" }}>{formik.errors.confirm}</div>
                  ) : (
                    <></>
                  )}

                  <div className="form-group clearfix mb-0">
                    <button
                      onClick={handleSubmit}
                      type="button"
                      className="btn-theme login_button"
                      disabled={isSubmit}
                    >
                      {isSubmit ? <CircularLoader size={30} /> : "Submit"}
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
  );
};

export default ResetPassword;
