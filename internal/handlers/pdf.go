package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"project/config"
	"project/internal/logger"

	"github.com/jung-kurt/gofpdf"
)

type Text struct {
	Text string  `json:"text"` // Текст для отображения
	Size int     `json:"size"` // Размер шрифта
	X    float64 `json:"x"`    // Координата X
	Y    float64 `json:"y"`    // Координата Y
}

type Template struct {
	Texts []Text `json:"texts"` // Массив текстовых элементов
}

type RequestBody struct {
	Template []Template `json:"template"` // Массив шаблонов
}

func CreatePDF(w http.ResponseWriter, r *http.Request, logger *logger.CombinedLogger, conf *config.Config) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return // Обработка preflight-запроса
	}

	log.Println("enter")
	var requestBody RequestBody
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Println(body, err)
		return
	}

	if err := json.Unmarshal(body, &requestBody); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Println("Ошибка при распарсивании JSON:", err)
		return
	}

	pdf := gofpdf.New("P", "mm", "A4", "")

	// Проходим по каждому шаблону в запросе
	for _, template := range requestBody.Template {
		pdf.AddPage()
		pdf.AddUTF8Font("DejaVu", "", conf.Font)

		for _, textElement := range template.Texts {
			pdf.SetFont("DejaVu", "", float64(textElement.Size))
			pdf.SetXY(float64(textElement.X), float64(textElement.Y))
			pdf.Cell(0, 10, textElement.Text) // Увеличиваем высоту ячейки для лучшего отображения
		}
	}

	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", "attachment; filename=report.pdf")
	fmt.Println("закончили111111111111111")
	if err := pdf.Output(w); err != nil {
		fmt.Println(err, w, pdf)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
