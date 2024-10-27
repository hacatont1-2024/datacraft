package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"project/internal/logger"

	"github.com/jung-kurt/gofpdf"
)

type Text struct {
	Text string `json:"text"`
	Size int    `json:"size"`
	X    int    `json:"x"`
	Y    int    `json:"y"`
}

type Template struct {
	Texts []Text `json:"texts"`
}

type RequestBody struct {
	Template []Template `json:"template"`
}

func CreatePDF(w http.ResponseWriter, r *http.Request, logger *logger.CombinedLogger) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	log.Println("enter")
	var requestBody RequestBody
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := json.Unmarshal(body, &requestBody); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	pdf := gofpdf.New("P", "mm", "A4", "")

	// Проходим по каждой странице в шаблоне
	for _, template := range requestBody.Template {
		pdf.AddPage()
		pdf.AddUTF8Font("DejaVu", "", "../fonts/DejaVuSans.ttf")

		// Проходим по каждому текстовому элементу на странице
		for _, textElement := range template.Texts {
			pdf.SetFont("DejaVu", "", float64(textElement.Size))
			pdf.SetXY(float64(textElement.X), float64(textElement.Y))
			pdf.Cell(0, 10, textElement.Text) // Используем 0 для ширины, чтобы текст не обрезался
		}
	}

	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", "attachment; filename=report.pdf")
	if err := pdf.Output(w); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
