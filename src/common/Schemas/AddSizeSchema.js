import * as Yup from "yup";
export const AddSizeSchema = Yup.object({
  sizeValue: Yup.string().required("Size is required").min(3),
  isButtonDisabled: Yup.boolean(),
});
