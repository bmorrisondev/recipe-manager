import { useEffect, useState } from 'react';
import { Recipe } from './models';
import AddRecipeModal from './components/AddRecipeModal'
import RecipeCard from './components/RecipeCard';
import * as api from './api'

const data: Recipe[] = [
  {
    id: 1,
    name: "Pizza",
    est_time_to_make_in_min: 60,
    description: "Because everyone loves it!",
    ingredients: [
      {
        id: 1,
        name: "Sauce",
        amount: "1 cup"
      }
    ],
    steps: [
      {
        id: 1,
        number: 1,
        directions: "Lay out the dough"
      },
      {
        id: 2,
        number: 2,
        directions: "Apply sauce",
      },
      {
        id: 3,
        number: 3,
        directions: "Put the cheese on",
      },
      {
        id: 4,
        number: 4,
        directions: "Cook at 500 for 10 min",
      }
    ]
  },
  {
    id: 2,
    name: "Pizza",
    est_time_to_make_in_min: 60,
    description: "Because everyone loves it!",
    ingredients: [
      {
        id: 1,
        name: "Sauce",
        amount: "1 cup"
      }
    ],
    steps: [
      {
        id: 1,
        number: 1,
        directions: "Lay out the dough"
      },
      {
        id: 2,
        number: 2,
        directions: "Apply sauce",
      },
      {
        id: 3,
        number: 3,
        directions: "Put the cheese on",
      },
      {
        id: 4,
        number: 4,
        directions: "Cook at 500 for 10 min",
      }
    ]
  },
  {
    id: 3,
    name: "Pizza",
    est_time_to_make_in_min: 60,
    description: "Because everyone loves it!",
    ingredients: [
      {
        id: 1,
        name: "Sauce",
        amount: "1 cup"
      }
    ],
    steps: [
      {
        id: 1,
        number: 1,
        directions: "Lay out the dough"
      },
      {
        id: 2,
        number: 2,
        directions: "Apply sauce",
      },
      {
        id: 3,
        number: 3,
        directions: "Put the cheese on",
      },
      {
        id: 4,
        number: 4,
        directions: "Cook at 500 for 10 min",
      }
    ]
  }
]

function App() {
  const [isAddingRecipe, setIsAddingRecipe] = useState(false)
  const [_recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    async function init() {
      let recipes = await api.fetchRecipes()
      setRecipes(recipes)
    }
    init()
  }, [])
  
  async function saveRecipe(r: Recipe) {
    let created = await api.createRecipe(r)
    setRecipes([..._recipes, created])
  }

  return (
    <div className="p-4">
      <h1>My recipes!</h1>
      <AddRecipeModal open={isAddingRecipe} onClose={() => setIsAddingRecipe(false)} onSave={saveRecipe} />
      <div className="App grid grid-cols-12 gap-2 mb-2">
        {_recipes.map((r: Recipe) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center" onClick={() => setIsAddingRecipe(true)}>
        <span>Add recipe</span>
      </button>
    </div>
  );
}

export default App;
