package main

import (
	"log"
	"net/http"
	"os"

	appdb "groceries-backend/internal/db"
	"groceries-backend/internal/handlers"
	"groceries-backend/internal/middleware"
	"groceries-backend/internal/models"
)

func main() {
	db, err := appdb.Connect()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	itemStore := models.NewItemStore(db)
	userStore := models.NewUserStore(db)

	itemHandler := handlers.NewItemHandler(itemStore)
	authHandler := handlers.NewAuthHandler(userStore)

	mux := http.NewServeMux()

	// auth (public)
	mux.HandleFunc("POST /api/auth/register", authHandler.Register)
	mux.HandleFunc("POST /api/auth/login", authHandler.Login)

	// items (protected)
	mux.Handle("GET /api/items", middleware.Auth(http.HandlerFunc(itemHandler.List)))
	mux.Handle("POST /api/items", middleware.Auth(http.HandlerFunc(itemHandler.Create)))
	mux.Handle("PATCH /api/items/{id}", middleware.Auth(http.HandlerFunc(itemHandler.Update)))
	mux.Handle("DELETE /api/items/{id}", middleware.Auth(http.HandlerFunc(itemHandler.Delete)))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, corsMiddleware(mux)); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:3000"
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}