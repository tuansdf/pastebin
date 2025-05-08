package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/joho/godotenv/autoload"
	_ "github.com/mattn/go-sqlite3"
)

type CreateRequest struct {
	Content       string `json:"content"`
	IdSize        int    `json:"idSize"`
	ExpireMinutes int    `json:"expireMinutes"`
}

type CreateResponse struct {
	Id string `json:"id"`
}

func main() {
	db, err := sql.Open("sqlite3", DbUrl)
	if err != nil {
		log.Fatalf("failed to open db: %v", err)
		return
	}
	defer db.Close()

	repository := Repository{DB: db}
	service := Service{Repository: repository}

	mux := http.NewServeMux()
	mux.HandleFunc("POST /", func(w http.ResponseWriter, r *http.Request) {
		_, password, _ := r.BasicAuth()
		var request = CreateRequest{}
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		result, err := service.Create(request.Content, request.IdSize, request.ExpireMinutes, password)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(CreateResponse{Id: result})
	})
	mux.HandleFunc("GET /{id}", func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		result, err := service.FindTopByPublicId(id)
		if err != nil || result == nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(result)
	})
	mux.HandleFunc("DELETE /{id}", func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		_, password, _ := r.BasicAuth()
		service.DeleteTopByPublicId(id, password)
		w.WriteHeader(http.StatusOK)
	})
	mux.HandleFunc("DELETE /expired", func(w http.ResponseWriter, r *http.Request) {
		_, password, _ := r.BasicAuth()
		service.DeleteExpiredVaults(password)
		w.WriteHeader(http.StatusOK)
	})

	port := ":" + Port
	fmt.Printf("Starting server at %s...\n", port)
	log.Fatal(http.ListenAndServe(port, mux))
}
