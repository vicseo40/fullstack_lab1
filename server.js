const express = require('express');
const bodyParser = require('body-parser');
const { connectDB, client } = require('./db');
const getRecipes = require('./myRecipes');
const { ObjectId } = require('mongodb'); // Import ObjectId
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(bodyParser.json());
app.use(express.static('public'));

const collection = getRecipes();

// My CRUD Operations

// GET all recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await collection.find().toArray();
    res.json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).send('Server error');
  }
});

// GET recipe by title
app.get('/recipes/:title', async (req, res) => {
  try {
    const title = decodeURIComponent(req.params.title);
    const recipe = await collection.findOne({ title });
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }
    res.json(recipe);
  } catch (err) {
    console.error('Error fetching recipe by title:', err);
    res.status(500).send('Server error');
  }
});

// POST create new recipe
app.post('/recipes', async (req, res) => {
  const { title, ingredients, instructions, cookingTime } = req.body;
  try {
    let recipe = await collection.findOne({ title });
    if (recipe) {
      return res.status(409).send('Recipe already exists');
    }
    recipe = { title, ingredients, instructions, cookingTime };
    await collection.insertOne(recipe);
    res.status(201).json(recipe);
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(500).send('Server error');
  }
});

// PUT update recipe by id
app.put('/recipes/:id', async (req, res) => {
  const { title, ingredients, instructions, cookingTime } = req.body;
  try {
    const recipe = await collection.findOne({ _id: new ObjectId(req.params.id) }); 
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }
    const updatedRecipe = { $set: { title, ingredients, instructions, cookingTime } };
    await collection.updateOne({ _id: new ObjectId(req.params.id) }, updatedRecipe); 
    res.json(updatedRecipe);
  } catch (err) {
    console.error('Error updating recipe:', err);
    res.status(500).send('Server error');
  }
});

// DELETE recipe by id
app.delete('/recipes/:id', async (req, res) => {
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) }); 
    if (result.deletedCount === 0) {
      return res.status(404).send('Recipe not found');
    }
    res.send('Recipe removed');
  } catch (err) {
    console.error('Error deleting recipe:', err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
