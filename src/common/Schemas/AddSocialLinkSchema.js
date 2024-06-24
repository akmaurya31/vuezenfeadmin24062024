import * as Yup from "yup";
export const AddSocialLinkSchema = Yup.object({
    socialinkValue: Yup.string().required("Social Link is required").min(3),
});
