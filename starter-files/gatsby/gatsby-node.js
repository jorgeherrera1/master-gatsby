import path from 'path';
import fetch from 'isomorphic-fetch';

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

async function fetchBeersAndTurnIntoNodes({ actions, createNodeId, createContentDigest }) {
  // 1. Fetch beers
  const res = await fetch('https://api.sampleapis.com/beers/ale');
  const beers = await res.json();
  // 2. Loop over each beer
  for (const beer of beers) {
    const nodeMeta = {
      id: createNodeId(`beer-${beer.name}`),
      parent: null,
      children: [],
      internal: {
        type: 'Beer',
        mediaType: 'application/json',
        contentDigest: createContentDigest(beer),
      },
    };
    // 3. Create node
    actions.createNode({
      ...beer,
      ...nodeMeta,
    });
  }
}

async function turnSlicemastersIntoPages({graphql, actions}) {
  // 1. query all slicemasters
  const { data } = await graphql(`
    query {
      slicemasters: allSanityPerson {
        totalCount
        nodes {
          name
          id
          slug {
            current
          }
        }
      }
    }
  `);
  // 2. turn each slicemaster into their own page
  // 3. figure out how many pages there are based on # slicemasters and how many per page
  const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
  const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);

  console.log(
    `There are ${data.slicemasters.totalCount} slicemasters. We have ${pageCount} pages with ${pageSize} per page`
  );
  // 4. loop thru 1..N and create pages for them
  Array.from({ length: pageCount }).forEach((_, i) => {
    console.log(`Creating page ${i}`);
    actions.createPage({
      path: `/slicemasters/${i + 1}`,
      component: path.resolve('./src/pages/slicemasters.js'),
      // This data is passed to the template
      context: {
        // how many records will be skipped on each page. for example, on the first one
        // since i=0 we are not skipping anything.
        skip: i * pageSize,
        currentPage: i + 1,
        pageSize,
      }
    });
  });
}

export async function sourceNodes(params) {
  await Promise.all([fetchBeersAndTurnIntoNodes(params)]);
}

export async function createPages(params) {
  // Create pages dynamically: pizzas, toppings, slicemasters
  // Wait for all promises to finish
  await Promise.all([
    turnPizzasIntoPages(params),
    turnToppingsIntoPages(params),
    turnSlicemastersIntoPages(params),
  ]);
}
