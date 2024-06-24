import * as Yup from "yup";
export const AddVariantSchema = Yup.object({
  colorValue: Yup.string().required("Color is required").min(1),
});
