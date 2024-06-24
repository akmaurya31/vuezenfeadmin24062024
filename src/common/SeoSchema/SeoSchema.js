import * as Yup from "yup";
export const AddSeoSchema = Yup.object({
  product: Yup.string().required("Please Select Product"),
  meta_title: Yup.string().required("Meta Title is required").min(3),
  meta_desc: Yup.string().required("Meta Description is required").min(3),
  metatags: Yup.array().min(1, "Select at least one gender category"),
});
