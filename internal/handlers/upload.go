package handlers

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
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

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("начали получать")

	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		fmt.Println("1")
		return
	}

	file, _, err := r.FormFile("csvFile")
	if err != nil {
		http.Error(w, "Error retrieving the file", http.StatusBadRequest)
		fmt.Println("2")
		return
	}
	defer file.Close()

	tempFile, err := os.CreateTemp("", "*.csv")
	if err != nil {
		http.Error(w, "Error creating temporary file", http.StatusInternalServerError)
		fmt.Println("3")
		return
	}
	defer os.Remove(tempFile.Name())

	if _, err := io.Copy(tempFile, file); err != nil {
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		fmt.Println("4")
		return
	}

	data, err := readCSV(tempFile.Name())
	if err != nil {
		http.Error(w, "Error reading CSV file", http.StatusInternalServerError)
		fmt.Println("5", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)

	fmt.Println("получили :)")
}
