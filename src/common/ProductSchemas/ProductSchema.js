import * as Yup from "yup";
export const AddProductSchema = Yup.object({
  title: Yup.string().required("Title is required").min(3),
  sku: Yup.string().min(1).max(50).required("Sku is required"),
  modelNumber: Yup.string().min(1).max(50).required("Model Number is required"),
  weight: Yup.string(),
  size: Yup.string(),
  // frame_type: Yup.string().required("Frame Type is required"),
  frame_type: Yup.string(),
  description: Yup.string().required("Description is required").min(3),
  genderInCategory: Yup.array().min(1, "Select at least one gender category"),
  summary: Yup.string().required("Summary is required").min(3),
  selectedImage: Yup.mixed()
    .required("Image is required")
    .test(
      "fileFormat",
      "Unsupported file format",
      (value) =>
        value && ["image/jpeg", "image/png", "image/webp"].includes(value.type)
    ),
  category: Yup.string(),
  material: Yup.string(),
  // shape: Yup.string().required("Shape is required"),
  shape: Yup.string(),

  frame_width: Yup.number().integer(),
  lens_width: Yup.number().integer(),
  lens_height: Yup.number().integer(),
  bridge_width: Yup.number().integer(),
  temple_length: Yup.number().integer(),
});
