// next.config.mjs
export const images = {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "cdn.myanimelist.net",
      port: "",
      pathname: "/**",
    },
  ],
};

export default {
  images,
};
