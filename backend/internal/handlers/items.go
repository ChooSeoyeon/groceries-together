package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"groceries-backend/internal/models"
)

type ItemHandler struct {
	items *models.ItemStore
}

func NewItemHandler(items *models.ItemStore) *ItemHandler {
	return &ItemHandler{items: items}
}

func (h *ItemHandler) List(w http.ResponseWriter, r *http.Request) {
	items, err := h.items.List()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"data": items})
}

func (h *ItemHandler) Create(w http.ResponseWriter, r *http.Request) {
	var input models.CreateItemInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	input.Name = strings.TrimSpace(input.Name)
	if input.Name == "" || input.Store == "" || input.Unit == "" {
		writeError(w, http.StatusBadRequest, "name, store, unit are required")
		return
	}
	if input.Urgency != "urgent" && input.Urgency != "relaxed" {
		writeError(w, http.StatusBadRequest, "urgency must be 'urgent' or 'relaxed'")
		return
	}

	item, err := h.items.Create(input)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{"data": item})
}

func (h *ItemHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var input models.UpdateItemInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	item, err := h.items.Update(id, input)
	if err == sql.ErrNoRows {
		writeError(w, http.StatusNotFound, "item not found")
		return
	} else if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"data": item})
}

func (h *ItemHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	if err := h.items.Delete(id); err == sql.ErrNoRows {
		writeError(w, http.StatusNotFound, "item not found")
		return
	} else if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}