const envvars = process.env;

export const environmentVariables = {
  apiUrl: envvars.REACT_APP_API_BACKEND,
  siteKey: envvars.REACT_APP_API_SITE_KEY,
  cdnUrl: envvars.REACT_APP_CDN_URL,
};
