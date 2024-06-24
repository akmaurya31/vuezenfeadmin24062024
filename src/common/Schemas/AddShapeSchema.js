import * as Yup from "yup";
export const AddShapeSchema = Yup.object({
  shapeValue: Yup.string().required("Shape is required").min(3),
  isButtonDisabled: Yup.boolean(),
});
