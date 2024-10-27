package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"project/internal/logger"
)

func UploadHandler_Merge(w http.ResponseWriter, r *http.Request, logger *logger.CombinedLogger) {
	logger.Info("starting UploadHandler")

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method != http.MethodPost {
		http.Error(w, "invalid request method", http.StatusMethodNotAllowed)
		logger.Error("invalid request method", "err", http.StatusMethodNotAllowed)
		return
	}

	// Получаем все файлы из запроса
	files := r.MultipartForm.File["csvFiles"]
	if len(files) == 0 {
		http.Error(w, "no files uploaded", http.StatusBadRequest)
		logger.Error("no files uploaded", "err", http.StatusBadRequest)
		return
	}

	var allData CSVData
	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "error retrieving the file", http.StatusBadRequest)
			logger.Error("error retrieving the file", "err", err)
			return
		}
		defer file.Close()

		tempFile, err := os.CreateTemp("", "*.csv")
		if err != nil {
			http.Error(w, "error creating temporary file", http.StatusInternalServerError)
			logger.Error("error creating temporary file", "err", err)
			return
		}
		defer os.Remove(tempFile.Name())

		if _, err := io.Copy(tempFile, file); err != nil {
			http.Error(w, "error saving file", http.StatusInternalServerError)
			logger.Error("error saving file", "err", err)
			return
		}

		data, err := readCSV(tempFile.Name(), logger)
		if err != nil {
			http.Error(w, "error reading csv file", http.StatusInternalServerError)
			logger.Error("error reading csv file", "err", err)
			return
		}

		// Объединяем данные
		allData.Columns = append(allData.Columns, data.Columns...)
		allData.Rows = append(allData.Rows, data.Rows...)
	}

	// Удаляем дубликаты колонок, если это необходимо
	// (можно добавить логику для обработки уникальных колонок)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(allData)

	logger.Info("complete UploadHandler")
}
