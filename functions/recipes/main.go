package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	_ "github.com/go-sql-driver/mysql"
)

type Recipe struct {
	Id            *int64       `json:"id"`
	Name          *string      `json:"name"`
	EstTimeToMake *int64       `json:"est_time_to_make_in_min"`
	Description   *string      `json:"description"`
	Ingredients   []Ingredient `json:"ingredients"`
	Steps         []Step       `json:"steps"`
}

type Ingredient struct {
	Name   *string `json:"name"`
	Amount *string `json:"amount"`
}

type IngredientRecord struct {
	Id       *int64
	Name     *string
	Amount   *string
	RecipeId *int64
}

type Step struct {
	Number     *int64  `json:"number"`
	Directions *string `json:"directions"`
}

type StepRecord struct {
	Id         *int64
	Number     *int64  `json:"number"`
	Directions *string `json:"directions"`
	RecipeId   *int64
}

func GetDatabase() (*sql.DB, error) {
	db, err := sql.Open("mysql", os.Getenv("DSN"))
	return db, err
}

func handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {

	db, err := GetDatabase()
	if err != nil {
		log.Fatal(err)
	}

	if request.HTTPMethod == "GET" {
		return Get2(request, db)
	}

	if request.HTTPMethod == "POST" {
		return Post(request, db)
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 404,
	}, nil
}

func Get(request events.APIGatewayProxyRequest, db *sql.DB) (*events.APIGatewayProxyResponse, error) {
	query := "SELECT * FROM recipes"
	rows, err := db.Query(query)
	if err != nil {
		log.Println(err)
		return InternalServerErrorResponse()
	}

	recipes := []Recipe{}
	for rows.Next() {
		var recipe Recipe
		err = rows.Scan(&recipe.Id, &recipe.Name, &recipe.EstTimeToMake, &recipe.Description)
		if err != nil {
			log.Println(err)
			return InternalServerErrorResponse()
		}
		recipes = append(recipes, recipe)
	}

	barr, err := json.Marshal(recipes)
	if err != nil {
		log.Println(err)
		return InternalServerErrorResponse()
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body: string(barr),
	}, nil
}

type GetDbResponse struct {
	RecipeId            *int64
	RecipeName          *string
	RecipeEstTimeToMake *int64
	RecipeDescription   *string
	IngredientId        *int64
	IngredientName      *string
	IngredientAmount    *string
	IngredientRecipeId  *int64
	StepId              *int64
	StepNumber          *int64
	StepDirections      *string
	StepRecipeId        *int64
}

func Get2(request events.APIGatewayProxyRequest, db *sql.DB) (*events.APIGatewayProxyResponse, error) {
	query := `select * from recipes r 
		left join steps s on r.id = s.recipe_id 
		left join ingredients i on r.id = i.recipe_id`
	rows, err := db.Query(query)
	if err != nil {
		log.Println(err)
		return InternalServerErrorResponse()
	}

	dbmodels := []GetDbResponse{}
	for rows.Next() {
		var dbmodel GetDbResponse
		err = rows.Scan(
			&dbmodel.RecipeId,
			&dbmodel.RecipeName,
			&dbmodel.RecipeEstTimeToMake,
			&dbmodel.RecipeDescription,
			&dbmodel.StepId,
			&dbmodel.StepNumber,
			&dbmodel.StepDirections,
			&dbmodel.StepRecipeId,
			&dbmodel.IngredientId,
			&dbmodel.IngredientName,
			&dbmodel.IngredientAmount,
			&dbmodel.IngredientRecipeId,
		)
		if err != nil {
			log.Println(err)
			return InternalServerErrorResponse()
		}
		dbmodels = append(dbmodels, dbmodel)
	}

	recipesMap := map[int]Recipe{}
	ingredientsMap := map[string]Ingredient{}
	stepsMap := map[string]Step{}
	for _, el := range dbmodels {
		if _, ok := recipesMap[int(*el.RecipeId)]; !ok {
			recipesMap[int(*el.RecipeId)] = Recipe{
				Id:            el.RecipeId,
				Name:          el.RecipeName,
				EstTimeToMake: el.RecipeEstTimeToMake,
				Description:   el.RecipeDescription,
			}
		}

		if el.IngredientId != nil {
			ingKey := fmt.Sprintf("%v_%v", *el.RecipeId, *el.IngredientId)
			if _, ok := ingredientsMap[ingKey]; !ok {
				ingredientsMap[ingKey] = Ingredient{
					Name:   el.IngredientName,
					Amount: el.IngredientAmount,
				}
			}
		}

		if el.StepId != nil {
			stepKey := fmt.Sprintf("%v_%v", *el.RecipeId, *el.StepId)
			if _, ok := stepsMap[stepKey]; !ok {
				stepsMap[stepKey] = Step{
					Number:     el.StepNumber,
					Directions: el.StepDirections,
				}
			}
		}
	}

	var recipes []Recipe
	for _, el := range recipesMap {
		for ingKey, ing := range ingredientsMap {
			if strings.HasPrefix(ingKey, fmt.Sprintf("%v", *el.Id)) {
				el.Ingredients = append(el.Ingredients, ing)
			}
		}
		log.Println("recipe", *el.Id)
		for stepKey, step := range stepsMap {
			if strings.HasPrefix(stepKey, fmt.Sprintf("%v", *el.Id)) {
				log.Println(stepKey, step)
				el.Steps = append(el.Steps, step)
			}
		}

		recipes = append(recipes, el)
	}

	barr, err := json.Marshal(recipes)
	if err != nil {
		log.Println(err)
		return InternalServerErrorResponse()
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body: string(barr),
	}, nil
}

func Post(request events.APIGatewayProxyRequest, db *sql.DB) (*events.APIGatewayProxyResponse, error) {
	var recipe Recipe
	err := json.Unmarshal([]byte(request.Body), &recipe)
	if err != nil {
		log.Println(err)
		return InternalServerErrorResponse()
	}

	query := "INSERT INTO recipes (name, est_time_to_make_in_min, description) VALUES (?, ?, ?)"
	result, err := db.Exec(query, recipe.Name, recipe.EstTimeToMake, recipe.Description)
	if err != nil {
		log.Println(err)
		return InternalServerErrorResponse()
	}

	id, err := result.LastInsertId()
	if err != nil {
		log.Println(err)
		return InternalServerErrorResponse()
	}

	recipe.Id = &id

	query = "INSERT INTO ingredients (name, amount, recipe_id) VALUES "
	var ingredientsParams []interface{}
	for idx, el := range recipe.Ingredients {
		if idx > 0 {
			query += ","
		}
		query += " (?, ?, ?)"
		ingredientsParams = append(ingredientsParams, el.Name)
		ingredientsParams = append(ingredientsParams, el.Amount)
		ingredientsParams = append(ingredientsParams, recipe.Id)
	}
	result, err = db.Exec(query, ingredientsParams...)
	if err != nil {
		log.Println(err)
		return InternalServerErrorResponse()
	}

	query = "INSERT INTO steps (number, directions, recipe_id) VALUES "
	var params []interface{}
	for idx, el := range recipe.Steps {
		if idx > 0 {
			query += ","
		}
		query += " (?, ?, ?)"
		params = append(params, el.Number)
		params = append(params, el.Directions)
		params = append(params, recipe.Id)
	}
	result, err = db.Exec(query, params...)
	if err != nil {
		log.Println(err)
		return InternalServerErrorResponse()
	}

	barr, err := json.Marshal(recipe)
	if err != nil {
		log.Println(err)
		return InternalServerErrorResponse()
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 201,
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body: string(barr),
	}, nil
}

func InternalServerErrorResponse() (*events.APIGatewayProxyResponse, error) {
	return &events.APIGatewayProxyResponse{
		StatusCode: 500,
	}, nil
}

func main() {
	lambda.Start(handler)
}
