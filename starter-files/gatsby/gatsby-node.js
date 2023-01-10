import path from 'path';

async function turnPizzasIntoPages({ graphql, actions }) {
  // 1 get template
  const pizzaTemplate = path.resolve('./src/templates/Pizza.js');
  // 2 query pizzas
  const { data } = await graphql(`
    query {
      pizzas: allSanityPizza {
        nodes {
          name
          slug {
            current
          }
        }
      }
    }
  `);
  // 3 create a page for each pizza
  data.pizzas.nodes.forEach(pizza => {
    console.log('Creating page for Pizza: ', pizza.name);

    actions.createPage({
      path: `pizza/${pizza.slug.current}`,
      component: pizzaTemplate,
      context: {
        slug: pizza.slug.current,
      },
    });
  });
}

async function turnToppingsIntoPages({ graphql, actions }) {
  // 1 get template
  const toppingsTemplate = path.resolve('./src/pages/pizzas.js');
  // 2 query toppings
  const { data } = await graphql(`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
        }
      }
    }
  `);
  // 3 create page per topping
  data.toppings.nodes.forEach((topping) => {
    console.log('Creating page for Topping:', topping.name);

    actions.createPage({
      path: `topping/${topping.name}`,
      component: toppingsTemplate,
      context: {
        topping: topping.name,
        toppingRegex: `/${topping.name}/i`,
      },
    });
  });
}

export async function createPages(params) {
  // Create pages dynamically: pizzas, toppings, slicemasters
  // Wait for all promises to finish
  await Promise.all([
    turnPizzasIntoPages(params),
    turnToppingsIntoPages(params),
  ]);
}
