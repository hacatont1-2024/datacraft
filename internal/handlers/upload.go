package handlers

import (
	"encoding/csv"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"project/internal/logger"
)

type ColumnInfo struct {
	Name        string `json:"name"`
	Type        string `json:"type"`
	UniqueCount int    `json:"unique_count"`
}

type CSVData struct {
	Columns []ColumnInfo `json:"columns"`
	Rows    [][]string   `json:"rows"`
}

func readCSV(filePath string) (CSVData, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return CSVData{}, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.Comma = ';'

	records, err := reader.ReadAll()
	if err != nil {
		return CSVData{}, err
	}

	if len(records) == 0 {
		return CSVData{}, nil
	}

	columns := make([]ColumnInfo, len(records[0]))
	uniqueCounts := make(map[string]map[string]struct{})

	for i, header := range records[0] {
		columns[i].Name = header
		columns[i].Type = "string"
		uniqueCounts[header] = make(map[string]struct{})
	}

	for _, record := range records[1:] {
		for i, value := range record {
			uniqueCounts[records[0][i]][value] = struct{}{}
		}
	}

	for i, header := range records[0] {
		columns[i].UniqueCount = len(uniqueCounts[header])
	}

	return CSVData{Columns: columns, Rows: records[1:]}, nil
}

func UploadHandler(w http.ResponseWriter, r *http.Request, logger *logger.CombinedLogger) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	logger.Info("start reading csv")

	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method != http.MethodPost {
		http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
		logger.Error("invalid request method", "err", http.StatusMethodNotAllowed)
		return
	}

	file, _, err := r.FormFile("csvFile")
	if err != nil {
		http.Error(w, "error retrieving the file", http.StatusBadRequest)
		logger.Error("error retrieving the file", "err", http.StatusBadRequest)
		return
	}
	defer file.Close()

	tempFile, err := os.CreateTemp("", "*.csv")
	if err != nil {
		http.Error(w, "error creating temporary file", http.StatusInternalServerError)
		logger.Error("error creating temporary file", "err", http.StatusInternalServerError)
		return
	}
	defer os.Remove(tempFile.Name())

	if _, err := io.Copy(tempFile, file); err != nil {
		http.Error(w, "error saving file", http.StatusInternalServerError)
		logger.Error("error saving file", "err", http.StatusInternalServerError)
		return
	}

	data, err := readCSV(tempFile.Name())
	if err != nil {
		http.Error(w, "error reading scv file", http.StatusInternalServerError)
		logger.Error("error reading scv file", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)

	logger.Info("done reading csv")
}
