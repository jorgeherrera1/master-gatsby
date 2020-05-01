import dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const config = {
  plugins: [
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-source-sanity',
      options: {
        projectId: 'q8tcrnkv',
        dataset: 'development',
        token: process.env.SANITY_TOKEN,
        watchMode: true,
      },
    },
  ],
};

export default config;