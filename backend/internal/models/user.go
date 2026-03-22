package models

import (
	"database/sql"
	"time"
)

type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"createdAt"`
}

type UserStore struct {
	db *sql.DB
}

func NewUserStore(db *sql.DB) *UserStore {
	return &UserStore{db: db}
}

func (s *UserStore) Create(email, passwordHash string) (User, error) {
	var user User
	err := s.db.QueryRow(`
		INSERT INTO users (email, password_hash)
		VALUES ($1, $2)
		RETURNING id, email, password_hash, created_at
	`, email, passwordHash).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)
	return user, err
}

func (s *UserStore) FindByEmail(email string) (User, error) {
	var user User
	err := s.db.QueryRow(`
		SELECT id, email, password_hash, created_at
		FROM users WHERE email = $1
	`, email).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)
	return user, err
}