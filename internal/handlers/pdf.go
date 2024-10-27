package handlers

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"project/config"
	"project/internal/logger"
	"strings"

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
	pdf.AddUTF8Font("DejaVu", "", conf.Font)

	// Проходим по каждому шаблону в запросе
	for _, template := range requestBody.Template {
		pdf.AddPage()

		for _, textElement := range template.Texts {
			if strings.HasPrefix(textElement.Text, "data:image/svg+xml;base64,") {
				// Декодируем base64 строку
				base64Data := strings.TrimPrefix(textElement.Text, "data:image/svg+xml;base64,")
				imgData, err := base64.StdEncoding.DecodeString(base64Data)
				if err != nil {
					http.Error(w, "Ошибка декодирования base64: "+err.Error(), http.StatusBadRequest)
					return
				}

				// Сохраняем изображение во временный файл
				imgFileName := "temp_image.svg"
				if err := os.WriteFile(imgFileName, imgData, 0644); err != nil {
					http.Error(w, "Ошибка сохранения изображения: "+err.Error(), http.StatusInternalServerError)
					return
				}

				// Добавляем изображение в PDF
				pdf.Image(imgFileName, float64(textElement.X), float64(textElement.Y), 0, 0, false, "", 0, "")
			} else {
				pdf.SetFont("DejaVu", "", float64(textElement.Size))
				pdf.SetXY(float64(textElement.X), float64(textElement.Y))
				pdf.Cell(0, float64(textElement.Size+2), textElement.Text) // Увеличиваем высоту ячейки для лучшего отображения
			}
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
