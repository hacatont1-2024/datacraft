package main

import (
	"fmt"
	"log"
	"net/http"
	"project/internal/routers"
)

func main() {
	// conf, err := config.NewConfig()
	// if err != nil {
	// 	log.Fatalf("config error: %v\n", err)
	// }

	// slogger := logger.NewSLogger()
	// fileLogger, err := logger.NewFLogger(conf.AppLogfile)
	// if err != nil {
	// 	slogger.Error("Ошибка создания FileLogger", "error", err)
	// }
	// defer fileLogger.Close()

	// logger := logger.NewCombinedLogger(slogger, fileLogger)

	routers.Init()
	fmt.Println("8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
