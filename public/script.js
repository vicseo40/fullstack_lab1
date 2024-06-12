const apiUrl = 'http://localhost:5000/recipes';

async function fetchRecipes() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching recipes: ${response.statusText}`);
    }
    const recipes = await response.json();
    const tableBody = document.querySelector('#recipesTable tbody');
    tableBody.innerHTML = '';

    recipes.forEach(recipe => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${recipe.title}</td>
        <td>${recipe.ingredients.join(', ')}</td>
        <td>${recipe.instructions}</td>
        <td>${recipe.cookingTime}</td>
        <td>
          <button onclick="updateRecipe('${recipe._id}')">Update</button>
          <button onclick="deleteRecipe('${recipe._id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error('Error fetching recipes:', err);
  }
}

async function addRecipe(event) {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const ingredients = document.getElementById('ingredients').value.split(',').map(ing => ing.trim());
  const instructions = document.getElementById('instructions').value;
  const cookingTime = document.getElementById('cookingTime').value;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, ingredients, instructions, cookingTime })
    });

    if (!response.ok) {
      throw new Error(`Error adding recipe: ${response.statusText}`);
    }

    fetchRecipes();
  } catch (err) {
    console.error('Error adding recipe:', err);
  }
}

async function deleteRecipe(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Error deleting recipe: ${response.statusText}`);
    }

    fetchRecipes();
  } catch (err) {
    console.error('Error deleting recipe:', err);
  }
}

async function updateRecipe(id) {
  try {
    // Get the updated data from the user 
    const title = prompt("Enter new title:");
    const ingredients = prompt("Enter new ingredients (comma separated):").split(',').map(ing => ing.trim());
    const instructions = prompt("Enter new instructions:");
    const cookingTime = parseInt(prompt("Enter new cooking time:"), 10);

    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, ingredients, instructions, cookingTime })
    });

    if (!response.ok) {
      throw new Error(`Error updating recipe: ${response.statusText}`);
    }

    fetchRecipes();
  } catch (err) {
    console.error('Error updating recipe:', err);
  }
}

document.getElementById('recipeForm').addEventListener('submit', addRecipe);
fetchRecipes();
