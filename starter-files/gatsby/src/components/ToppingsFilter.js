import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import styled from 'styled-components';

const ToppingsStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;
  a {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0 1rem;
    padding: 5px;
    align-items: center;
    background: var(--grey);
    border-radius: 8px;
    .count {
      background: white;
      padding: 2px 5px;
    }
    .active {
      background: var(--yellow);
    }
  }
`;

function countPizzasInToppings(pizzas) {
  const counts = pizzas
    .map((pizza) => pizza.toppings)
    .flat()
    .reduce((acc, topping) => {
      const existingTopping = acc[topping.id];
      if (existingTopping) {
        existingTopping.count += 1;
      } else {
        acc[topping.id] = {
          id: topping.id,
          name: topping.name,
          count: 1,
        };
      }

      return acc;
    }, {});

  const sortedToppings = Object.values(counts).sort((a, b) => b.count - a. count);

  return sortedToppings;
}

export default function ToppingsFilter() {
  // Get a list of toppings
  const { toppings, pizzas } = useStaticQuery(graphql`
    query ToppingsQuery {
      toppings: allSanityTopping {
        nodes {
          name
          id
          vegetarian
        }
      }
      pizzas: allSanityPizza {
        nodes {
          toppings {
            name
            id
          }
        }
      }
    }
  `);
  // Count how many pizzas are in each toppings
  const toppingsWithCounts = countPizzasInToppings(pizzas.nodes);
  console.log(toppingsWithCounts);
  return (
    <ToppingsStyles>
      {toppingsWithCounts.map((topping) => (
          <Link key={topping.id} to={`/topping/${topping.name}`}>
            <span className='name'>{topping.name}</span>
            <span className='count'>{topping.count}</span>
          </Link>
      ))}
    </ToppingsStyles>
  );
}