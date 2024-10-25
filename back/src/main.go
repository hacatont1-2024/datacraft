package main

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

	// Создаем новый CSV Reader с указанием разделителя
	reader := csv.NewReader(file)
	reader.Comma = ';' // Устанавливаем разделитель на точку с запятой

	records, err := reader.ReadAll()
	if err != nil {
		return CSVData{}, err
	}

	if len(records) == 0 {
		return CSVData{}, nil
	}

	columns := make([]ColumnInfo, len(records[0]))
	uniqueCounts := make(map[string]map[string]struct{})

	// Инициализация уникальных значений для каждой колонки
	for i, header := range records[0] {
		columns[i].Name = header
		columns[i].Type = "string" // По умолчанию считаем строковым типом
		uniqueCounts[header] = make(map[string]struct{})
	}

	// Считывание данных и подсчет уникальных значений
	for _, record := range records[1:] {
		for i, value := range record {
			uniqueCounts[records[0][i]][value] = struct{}{}
		}
	}

	// Заполнение информации о колонках
	for i, header := range records[0] {
		columns[i].UniqueCount = len(uniqueCounts[header])
	}

	return CSVData{Columns: columns, Rows: records[1:]}, nil
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("начали получать")

	// Разрешаем CORS
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

	// Создаем временный файл для сохранения загруженного файла
	tempFile, err := os.CreateTemp("", "*.csv")
	if err != nil {
		http.Error(w, "Error creating temporary file", http.StatusInternalServerError)
		fmt.Println("3")
		return
	}
	defer os.Remove(tempFile.Name()) // Удаляем временный файл после обработки

	// Копируем содержимое загруженного файла во временный файл
	if _, err := io.Copy(tempFile, file); err != nil {
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		fmt.Println("4")
		return
	}

	// Читаем CSV данные из временного файла
	data, err := readCSV(tempFile.Name())
	if err != nil {
		http.Error(w, "Error reading CSV file", http.StatusInternalServerError)
		fmt.Println("5", err)
		return
	}

	// Возвращаем данные в формате JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)

	fmt.Println("получили :)")
}

func main() {
	// Обработчик для загрузки файла
	http.HandleFunc("/api/upload", uploadHandler)

	// Обработчик для статических файлов (HTML)
	http.Handle("/", http.FileServer(http.Dir("./")))

	fmt.Println("запустили")

	// Запуск сервера на порту 8080
	http.ListenAndServe(":8080", nil)
}
