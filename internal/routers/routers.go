package routers

import (
	"net/http"
	"project/internal/handlers"
)

func Init() {
	http.HandleFunc("/api/upload", func(w http.ResponseWriter, r *http.Request) {
		handlers.UploadHandler(w, r)
	})

	http.HandleFunc("/api/create-pdf", func(w http.ResponseWriter, r *http.Request) {
		handlers.CreatePDF(w, r)
	})

	http.HandleFunc("/api/chart", func(w http.ResponseWriter, r *http.Request) {
		handlers.ChartHandler(w, r)
	})

	http.Handle("/", http.FileServer(http.Dir("./")))

}
