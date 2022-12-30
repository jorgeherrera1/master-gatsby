import dotenv from 'dotenv';

dotenv.config({
  path: '.env',
});

export default {
  siteMetadata: {
    title: 'Slick Slices - Jorge',
    siteUrl: 'https://gatsby.pizza',
    description: 'Best pizza place in town',
  },
  plugins: [
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-source-sanity',
      options: {
        projectId: 'qbhj5kmr',
        dataset: 'production',
        watchMode: true,
        token: process.env.SANITY_TOKEN,
      },
    },
  ],
};
