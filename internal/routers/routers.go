package routers

import (
	"net/http"
	"project/internal/handlers"
	"project/internal/logger"
)

func Init(logger *logger.CombinedLogger) {
	// Обработчик для загрузки файла
	http.HandleFunc("/api/upload", func(w http.ResponseWriter, r *http.Request) {
		handlers.UploadHandler(w, r, logger)
	})

	// Обработчик для генерации PDF
	http.HandleFunc("/api/create-pdf", func(w http.ResponseWriter, r *http.Request) {
		handlers.CreatePDF(w, r, logger)
	})

	// Обработчик для статических файлов (HTML)
	http.Handle("/", http.FileServer(http.Dir("./")))

	logger.Info("routers started")
}
