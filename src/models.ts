export type User = {
  id: number
  name: string
  email: string
}

export type Recipe = {
  id: number
  name: string
  est_time_to_make_in_min: number
  description: string
  ingredients: Ingredient[]
  steps: Step[]
}

export type Ingredient = {
  id: number
  name: string
  amount: string
}

export type Step = {
  id: number
  number: number
  directions: string
}