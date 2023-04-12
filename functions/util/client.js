const sanityClient = require("@sanity/client");

const client = sanityClient({
  projectId: "k0utdl03",
  dataset: "production",
  apiVersion: "2022-03-10",
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

module.exports = {
  client,
};
