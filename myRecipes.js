const { client } = require('./db');

const getRecipes = () => {
  return client.db("recipes").collection("recipes");
};

module.exports = getRecipes;
