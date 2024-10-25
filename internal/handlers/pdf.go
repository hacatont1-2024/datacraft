package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/jung-kurt/gofpdf"
)

type Element struct {
	Text        string `json:"text"`
	Coordinates struct {
		X int `json:"x"`
		Y int `json:"y"`
	} `json:"coordinates"`
}

type RequestBody struct {
	Elements []Element `json:"elements"`
}

func CreatePDF(w http.ResponseWriter, r *http.Request) {
	// Установите заголовки CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return // Обработка preflight-запроса
	}

	log.Println("enter")
	var requestBody RequestBody
	body, err := io.ReadAll(r.Body) // Читаем тел�� запроса
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Println("Ошибка чтения тела запроса:", err)
		return
	}
	log.Println("Тело запроса:", string(body)) // Выводим тело запроса

	if err := json.Unmarshal(body, &requestBody); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Println("Ошибка декодирования JSON:", err)
		return
	}

	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()

	// Добавляем шрифт, который поддерживает кириллицу

	currentDir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	log.Println(currentDir)

	pdf.AddUTF8Font("DejaVu", "", "../fonts/DejaVuSans.ttf") // Укажите путь к вашему шрифту
	pdf.SetFont("DejaVu", "", 12)                            // Устанавливаем шрифт DejaVu, размер 12

	for _, element := range requestBody.Elements {
		pdf.SetXY(float64(element.Coordinates.X), float64(element.Coordinates.Y))
		pdf.Cell(40, 10, element.Text)
	}

	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", "attachment; filename=document.pdf")
	if err := pdf.Output(w); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
