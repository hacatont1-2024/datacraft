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

	logger.Info("starting ChartHandler")

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		logger.Error("ChartHandler", "type", "bad r.Method", "err", r.Method)

		return
	}

	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
		logger.Error("ChartHandler", "type", "invalid request method", "err", http.StatusMethodNotAllowed)

		return
	}

	var inputData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&inputData); err != nil {
		http.Error(w, "error decoding JSON", http.StatusBadRequest)
		logger.Error("ChartHandler", "type", "error decoding JSON", "err", http.StatusBadRequest)

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
		logger.Error("ChartHandler", "type", "error encoding JSON", "err", http.StatusInternalServerError)

		return
	}

	logger.Info("complete ChartHandler")

}
