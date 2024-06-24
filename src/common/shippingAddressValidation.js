import * as yup from "yup";
import { object, string, ref } from "yup";

export const shippingAddressValidation = yup.object().shape({
  address_type: yup.string().required("Please select type of address"),
  fullname: yup
    .string()
    .required("Full Name is required")
    .min(3, "length should be greater then 3")
    .max(45),
  mobile1: yup
    .number()
    .test("is-valid-number", "Mobile number must be valid", (value) => {
      if (!value) {
        return true; // Skip validation if the value is empty
      }
      const mobileNumberRegex = /^\d{7,12}$/;
      return mobileNumberRegex.test(value);
    })
    .required("Mobile Number is required"),
  address1: yup.string().min(10).required("Address 1 is required"),
  address2: yup.string().min(10).required("Address 2 is required"),
  country: yup.string().min(4).required("Country is required"),
  state: yup.string().min(2).required("State is required"),
  city: yup.string().min(4).required("City is required"),
  pincode: yup.number().min(1).required("Zipcode  is required"),
  landmark: yup.string().min(4),
});
