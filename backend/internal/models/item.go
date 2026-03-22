package models

import (
	"database/sql"
	"time"
)

type ShoppingItem struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	Store     string     `json:"store"`
	Quantity  float64    `json:"quantity"`
	Unit      string     `json:"unit"`
	Urgency   string     `json:"urgency"`
	Memo      *string    `json:"memo"`
	InCart    bool       `json:"inCart"`
	CheckedAt *time.Time `json:"checkedAt"`
	CreatedAt time.Time  `json:"createdAt"`
}

type CreateItemInput struct {
	Name     string  `json:"name"`
	Store    string  `json:"store"`
	Quantity float64 `json:"quantity"`
	Unit     string  `json:"unit"`
	Urgency  string  `json:"urgency"`
	Memo     *string `json:"memo"`
}

type UpdateItemInput struct {
	Name      *string    `json:"name"`
	Store     *string    `json:"store"`
	Quantity  *float64   `json:"quantity"`
	Unit      *string    `json:"unit"`
	Urgency   *string    `json:"urgency"`
	Memo      *string    `json:"memo"`
	InCart    *bool      `json:"inCart"`
}

type ItemStore struct {
	db *sql.DB
}

func NewItemStore(db *sql.DB) *ItemStore {
	return &ItemStore{db: db}
}

func (s *ItemStore) List() ([]ShoppingItem, error) {
	rows, err := s.db.Query(`
		SELECT id, name, store, quantity, unit, urgency, memo, in_cart, checked_at, created_at
		FROM shopping_items
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []ShoppingItem
	for rows.Next() {
		var item ShoppingItem
		if err := rows.Scan(
			&item.ID, &item.Name, &item.Store, &item.Quantity, &item.Unit,
			&item.Urgency, &item.Memo, &item.InCart, &item.CheckedAt, &item.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	if items == nil {
		items = []ShoppingItem{}
	}
	return items, rows.Err()
}

func (s *ItemStore) Create(input CreateItemInput) (ShoppingItem, error) {
	var item ShoppingItem
	err := s.db.QueryRow(`
		INSERT INTO shopping_items (name, store, quantity, unit, urgency, memo)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, name, store, quantity, unit, urgency, memo, in_cart, checked_at, created_at
	`, input.Name, input.Store, input.Quantity, input.Unit, input.Urgency, input.Memo).Scan(
		&item.ID, &item.Name, &item.Store, &item.Quantity, &item.Unit,
		&item.Urgency, &item.Memo, &item.InCart, &item.CheckedAt, &item.CreatedAt,
	)
	return item, err
}

func (s *ItemStore) Update(id string, input UpdateItemInput) (ShoppingItem, error) {
	// checked_at: inCart이 false로 바뀌면 현재 시각, true로 바뀌면 NULL
	var checkedAtExpr string
	if input.InCart != nil {
		if *input.InCart {
			checkedAtExpr = ", checked_at = NULL"
		} else {
			checkedAtExpr = ", checked_at = NOW()"
		}
	}

	query := `
		UPDATE shopping_items SET
			name      = COALESCE($2, name),
			store     = COALESCE($3, store),
			quantity  = COALESCE($4, quantity),
			unit      = COALESCE($5, unit),
			urgency   = COALESCE($6, urgency),
			memo      = CASE WHEN $7::boolean THEN $8 ELSE memo END,
			in_cart   = COALESCE($9, in_cart)` +
		checkedAtExpr + `
		WHERE id = $1
		RETURNING id, name, store, quantity, unit, urgency, memo, in_cart, checked_at, created_at
	`

	memoProvided := input.Memo != nil
	var item ShoppingItem
	err := s.db.QueryRow(query,
		id,
		input.Name, input.Store, input.Quantity, input.Unit, input.Urgency,
		memoProvided, input.Memo,
		input.InCart,
	).Scan(
		&item.ID, &item.Name, &item.Store, &item.Quantity, &item.Unit,
		&item.Urgency, &item.Memo, &item.InCart, &item.CheckedAt, &item.CreatedAt,
	)
	return item, err
}

func (s *ItemStore) Delete(id string) error {
	res, err := s.db.Exec(`DELETE FROM shopping_items WHERE id = $1`, id)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return sql.ErrNoRows
	}
	return nil
}