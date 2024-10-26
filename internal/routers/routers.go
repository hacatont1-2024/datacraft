package routers

import (
	"net/http"
	"project/internal/handlers"
	"project/internal/logger"
)

func Init(logger *logger.CombinedLogger) {
	http.HandleFunc("/api/upload", func(w http.ResponseWriter, r *http.Request) {
		handlers.UploadHandler(w, r, logger)
	})

	http.HandleFunc("/api/create-pdf", func(w http.ResponseWriter, r *http.Request) {
		handlers.CreatePDF(w, r, logger)
	})

	http.HandleFunc("/api/chart", func(w http.ResponseWriter, r *http.Request) {
		handlers.ChartHandler(w, r, logger)
	})

	http.Handle("/", http.FileServer(http.Dir("./")))

}
