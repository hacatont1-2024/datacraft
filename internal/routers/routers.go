package routers

import (
	"net/http"
	"project/config"
	"project/internal/handlers"
	"project/internal/logger"
)

func Init(logger *logger.CombinedLogger, conf *config.Config) {
	http.HandleFunc("/api/upload", func(w http.ResponseWriter, r *http.Request) {
		handlers.UploadHandler(w, r, logger)
	})

	http.HandleFunc("/api/create-pdf", func(w http.ResponseWriter, r *http.Request) {
		handlers.CreatePDF(w, r, logger, conf)
	})

	http.HandleFunc("/api/chart", func(w http.ResponseWriter, r *http.Request) {
		handlers.ChartHandler(w, r, logger)
	})

	// Новые маршруты для работы с динамическими таблицами
	http.HandleFunc("/api/dynamic/createTable", func(w http.ResponseWriter, r *http.Request) {
		handlers.CreateTableHandler(w, r, logger)
	})

	http.HandleFunc("/api/dynamic/{tableName}/insert", func(w http.ResponseWriter, r *http.Request) {
		handlers.InsertDataHandler(w, r, logger)
	})

	http.HandleFunc("/api/dynamic/{tableName}/data", func(w http.ResponseWriter, r *http.Request) {
		handlers.GetDataHandler(w, r, logger)
	})

	http.HandleFunc("/api/dynamic/{tableName}/delete", func(w http.ResponseWriter, r *http.Request) {
		handlers.DeleteDataHandler(w, r, logger)
	})

	// Новые маршруты для работы с merger csv
	http.HandleFunc("/api/merge-csv", func(w http.ResponseWriter, r *http.Request) {
		handlers.UploadHandler_Merge(w, r, logger)
	})

	http.Handle("/", http.FileServer(http.Dir("./")))
}
