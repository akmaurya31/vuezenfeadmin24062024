import * as Yup from "yup";
export const AddFrameTypeSchema = Yup.object({
  frameTypeValue: Yup.string().required("Frame Type is required").min(1),
  isButtonDisabled: Yup.boolean(),
});