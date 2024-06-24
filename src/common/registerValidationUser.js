import * as yup from "yup";
import { object, string, ref } from "yup";

const getCharacterValidationError = (str) => {
  return `Your password must have at least 1 ${str} character`;
};
export const registerValidationUser = yup.object().shape({
  name: yup
    .string()
    .required("Full Name is required")
    .min(3, "Full Name length should be greater then 3")
    .max(45),
  email: yup.string().required().email("Please enter valid email"),
  contact: yup
    .string()
    .required("Mobile number is required"),
  password: string()
    .required("Please enter a password")
    .min(8, "Password must have at least 8 characters")
    .matches(/[0-9]/, getCharacterValidationError("digit"))
    .matches(/[a-z]/, getCharacterValidationError("lowercase"))
    .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
  confirmPassword: string()
    .required("Please re-type your password")
    .oneOf([ref("password")], "Passwords does not match"),
  type: yup.string().required("Please select type of registeration"),
});
//212 15:59