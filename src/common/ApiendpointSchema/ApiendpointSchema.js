import * as Yup from "yup";
export const AddApiEndpointSchema = Yup.object({
  name: Yup.string()
    .required("Api endpoint name is required")
    .min(3),
  type: Yup.string()
    .required("Type is required")
    .min(3),
  // backendRoute: Yup.array().min(1, "Select at least one Backend Route "),
  // frontendRoute: Yup.array().min(1, "Select at least one Frontend Route"),
});
