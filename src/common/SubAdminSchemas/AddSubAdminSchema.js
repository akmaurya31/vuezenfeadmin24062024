import * as Yup from "yup";

export const AddNewSubAdmin = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z ]*$/, "Name must contain only alphabets")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  role: Yup.string().required("Role is required"),
  country: Yup.string().required("Country is required"),
});
