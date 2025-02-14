import 'dotenv/config';

export default {
  expo: {
    name: "Licenta",
    slug: "Licenta",
    extra: {
      mapsApiKey: process.env.MAPS_API_KEY,
    },
  },
};
