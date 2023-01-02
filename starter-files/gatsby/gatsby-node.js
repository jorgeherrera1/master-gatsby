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
    console.log('Creating a page for: ', pizza.name);
    actions.createPage({
      path: `pizza/${pizza.slug.current}`,
      component: pizzaTemplate,
      context: {
        slug: pizza.slug.current,
      },
    });
  });
}

export async function createPages(params) {
  // Create pages dynamically: pizzas, toppings, slicemasters
  await turnPizzasIntoPages(params);
}
