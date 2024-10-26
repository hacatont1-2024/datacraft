package handlers

import (
	"encoding/json"
	"net/http"
	"project/internal/logger"
)

type ChartData struct {
	Title  string      `json:"title"`
	Series []DataPoint `json:"series"`
}

type DataPoint struct {
	Name  string  `json:"name"`
	Value float64 `json:"value"`
}

func ChartHandler(w http.ResponseWriter, r *http.Request, logger *logger.CombinedLogger) {
	// Добавляем заголовки CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Обработка preflight-запроса
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	logger.Info("start processing chart data")

	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
		logger.Error("invalid request method", "err", http.StatusMethodNotAllowed, "method", r.Method)
		return
	}

	var inputData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&inputData); err != nil {
		http.Error(w, "error decoding JSON", http.StatusBadRequest)
		logger.Error("error decoding JSON", "err", err)
		return
	}

	chartData := ChartData{
		Title:  "Пример графика",
		Series: []DataPoint{},
	}

	if data, ok := inputData["data"].([]interface{}); ok {
		for _, item := range data {
			if point, ok := item.(map[string]interface{}); ok {
				if name, ok := point["name"].(string); ok {
					if value, ok := point["value"].(float64); ok {
						chartData.Series = append(chartData.Series, DataPoint{Name: name, Value: value})
					}
				}
			}
		}
	}

	if err := json.NewEncoder(w).Encode(chartData); err != nil {
		http.Error(w, "error encoding JSON", http.StatusInternalServerError)
		logger.Error("error encoding JSON", "err", err)
		return
	}

	logger.Info("done processing chart data")
}
