import { Recipe } from "./models"

const base = "/.netlify/functions"

export async function fetchRecipes() {
  let res = await fetch(`${base}/recipes`)
  return await res.json()
}

export async function createRecipe(recipe: Recipe) {
  let res = await fetch(`${base}/recipes`, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(recipe)
  })
  return await res.json()
}
