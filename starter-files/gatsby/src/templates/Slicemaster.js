import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import styled from 'styled-components';
import SEO from '../components/SEO';

export default function SlicemasterPage({ data: { person } }) {
  return (
    <>
      <SEO title={person.name} image={person.image?.asset?.src} />
      <div className="center">
        <Img fluid={person.image.asset.fluid} />
        <h2 className="mark">{person.name}</h2>
        <p>{person.description}</p>
      </div>
    </>
  );
}

export const query = graphql`
  query($slug: String!) {
    person: sanityPerson(slug: {current: { eq: $slug}}) {
      name
      id
      description
      image {
        asset {
          fluid(maxWidth: 1000, maxHeight: 750) {
            ...GatsbySanityImageFluid
          }
        }
      }
    }
  }
`;