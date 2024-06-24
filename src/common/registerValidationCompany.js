import * as yup from "yup";
import { object, string, ref } from "yup";

const getCharacterValidationError = (str) => {
  return `Your password must have at least 1 ${str} character`;
};
export const registerValidationCompany = yup.object().shape({
  name: yup
    .string()
    .required("Full Name is required")
    .matches(/^[A-Za-z\s]+$/, 'Only alphabetic characters are allowed in the Full Name field')
    .min(3, "Full Name length should be greater then 3")
    .max(45),
  email: yup
  .string()
  .required("Email is required")
  .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/, 'Invalid email address format').email(),
  company_name: yup
    .string()
    .required("Company Name is required")
    .matches(/^[A-Za-z\s]+$/, 'Only alphabetic characters are allowed in the Company Name')
    .min(3, "Company Name length should be greater then 3")
    .max(45),
  company_employee: yup?.number()
  ?.min(10,"Number Of Employees must have at least 10")
  .max(100000000, "Please confirm the accurate number of employees."),
  department: yup.string()
  .min(3, "Department name length should be greater then 3")
  .max(45)
  .matches(/^[A-Za-z\s]+$/, 'Only alphabetic characters are allowed in the Department'),
  contact: yup
    .string()
    .min(10, "Mobile Number must have at least 10")
    .required("Mobile number is required"),
  password: string()
    .required("Please enter a password")
    // check minimum characters
    .min(8, "Password must have at least 8 characters")
    // different error messages for different requirements
    .matches(/[0-9]/, getCharacterValidationError("digit"))
    .matches(/[a-z]/, getCharacterValidationError("lowercase"))
    .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
  confirmPassword: string()
    .required("Please re-type your password")
    // use oneOf to match one of the values inside the array.
    // use "ref" to get the value of passwrod.
    .oneOf([ref("password")], "Passwords does not match"),
  type: yup.string().required("Please select type of registeration"),
});
//212 15:59
