package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	_ "github.com/go-sql-driver/mysql"
)

type Recipe struct {
	Id            *int64  `json:"id"`
	Name          *string `json:"name"`
	EstTimeToMake *int    `json:"est_time_to_make_in_min"`
	Description   *string `json:"description"`
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
		return Get(request, db)
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
