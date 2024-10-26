package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

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
	pdf.AddPage()

	pdf.AddUTF8Font("DejaVu", "", "../fonts/DejaVuSans.ttf")
	pdf.SetFont("DejaVu", "", 12)

	for _, element := range requestBody.Elements {
		pdf.SetXY(float64(element.Coordinates.X), float64(element.Coordinates.Y))
		pdf.Cell(40, 10, element.Text)
	}

	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", "attachment; filename=report.pdf")
	if err := pdf.Output(w); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)

	}
}
