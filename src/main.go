package main

import (
	"log"
	"net/http"
	"project/internal/routers"
)

func main() {
	// Инициализация маршрутов
	routers.SetupRoutes()

	log.Println("Сервер запущен на порту 8080")
	// Запуск сервера на порту 8080
	log.Fatal(http.ListenAndServe(":8080", nil))
}
