import * as Yup from "yup";
export const AddColorSchema = Yup.object({
  colorValue: Yup.string().required("Color is required").min(3),
  isButtonDisabled: Yup.boolean(),
});
