package main

import (
	"database/sql"
	"errors"
)

type Vault struct {
	ID        int64  `json:"-"`
	PublicId  string `json:"id"`
	Content   string `json:"content"`
	ExpiresAt int64  `json:"-"`
}

type Repository struct {
	DB *sql.DB
}

func (r *Repository) Create(v Vault) error {
	query := `INSERT INTO vault (public_id, content, expires_at) VALUES (?, ?, ?)`
	_, err := r.DB.Exec(query, v.PublicId, v.Content, v.ExpiresAt)
	return err
}

func (r *Repository) FindTopByPublicId(id string) (*Vault, error) {
	query := `SELECT public_id, content FROM vault WHERE public_id = ? LIMIT 1`
	row := r.DB.QueryRow(query, id)

	var v Vault
	err := row.Scan(&v.PublicId, &v.Content)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &v, nil
}

func (r *Repository) DeleteByPublicId(id string) error {
	_, err := r.DB.Exec(`DELETE FROM vault WHERE public_id = ?`, id)
	return err
}

func (r *Repository) DeleteById(id int64) error {
	_, err := r.DB.Exec(`DELETE FROM vault WHERE id = ?`, id)
	return err
}

func (r *Repository) DeleteAllExpiresAtBefore(timestamp int64) error {
	_, err := r.DB.Exec(`DELETE FROM vault WHERE expires_at < ?`, timestamp)
	return err
}
