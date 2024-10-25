package routers

import (
	"net/http"
	"project/internal/handlers"
)

func SetupRoutes() {
	// Обработчик для загрузки файла
	http.HandleFunc("/api/upload", handlers.UploadHandler)

	// Обработчик для генерации PDF
	http.HandleFunc("/api/create-pdf", handlers.CreatePDF)

	// Обработчик для статических файлов (HTML)
	http.Handle("/", http.FileServer(http.Dir("./")))
}
