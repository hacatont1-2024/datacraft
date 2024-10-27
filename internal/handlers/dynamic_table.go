package handlers

import (
	"encoding/json"
	"net/http"
	"project/internal/logger" // Импортируем модели
	services "project/internal/service"
)

var dynamicTableService *services.DynamicTableService // Предполагается, что у вас есть сервис для работы с динамическими таблицами

func init() {
	// Инициализация сервиса с вашей строкой подключения
	var err error
	dynamicTableService, err = services.NewDynamicTableService("your_connection_string_here")
	if err != nil {
		panic(err)
	}
}

func CreateTableHandler(w http.ResponseWriter, r *http.Request, logger *logger.CombinedLogger) {
	var request struct {
		TableName string   `json:"tableName"`
		Columns   []string `json:"columns"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := dynamicTableService.CreateTable(request.TableName, request.Columns); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Table created"))
}

func InsertDataHandler(w http.ResponseWriter, r *http.Request, logger *logger.CombinedLogger) {
	tableName := r.URL.Query().Get("tableName")
	var data map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := dynamicTableService.InsertData(tableName, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Data inserted"))
}

func GetDataHandler(w http.ResponseWriter, r *http.Request, logger *logger.CombinedLogger) {
	tableName := r.URL.Query().Get("tableName")
	data, err := dynamicTableService.GetData(tableName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func DeleteDataHandler(w http.ResponseWriter, r *http.Request, logger *logger.CombinedLogger) {
	tableName := r.URL.Query().Get("tableName")
	var conditions map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&conditions); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := dynamicTableService.DeleteData(tableName, conditions); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Data deleted"))
}
