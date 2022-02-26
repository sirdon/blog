import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
export const API = publicRuntimeConfig.PRODUCTION
  ? "https://blogdeploytest.herokuapp.com/api"
  : "https://blogdeploytest.herokuapp.com/api";
export const APP_NAME = publicRuntimeConfig.APP_NAME;
