package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	_ "github.com/jackc/pgx/v5/stdlib"
	_ "github.com/joho/godotenv/autoload"
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
	db, err := sql.Open("pgx", EnvDbUrl)
	if err != nil {
		log.Fatalf("failed to open db: %v", err)
	}
	defer db.Close()

	repository := Repository{DB: db}
	service := Service{Repository: repository}

	r := chi.NewRouter()

	// Add CORS middleware
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		_, password, _ := r.BasicAuth()
		var request CreateRequest
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		result, err := service.Create(request.Content, request.IdSize, request.ExpireMinutes, password)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(CreateResponse{Id: result})
	})

	r.Get("/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		result, err := service.FindTopByPublicId(id)
		if err != nil || result == nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	})

	r.Delete("/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		_, password, _ := r.BasicAuth()
		service.DeleteTopByPublicId(id, password)
		w.WriteHeader(http.StatusOK)
	})

	r.Delete("/expired", func(w http.ResponseWriter, r *http.Request) {
		_, password, _ := r.BasicAuth()
		service.DeleteExpiredVaults(password)
		w.WriteHeader(http.StatusOK)
	})

	port := ":" + EnvPort
	fmt.Printf("Starting server at %s...\n", port)
	log.Fatal(http.ListenAndServe(port, r))
}
