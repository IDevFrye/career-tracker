package main

import (
	"github.com/IDevFrye/main/internal/api"
	"github.com/IDevFrye/main/internal/services"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Инициализация сервисов
	supabaseService := services.NewSupabaseService()
	applicationService := services.NewApplicationService(supabaseService)
	questionService := services.NewQuestionService(supabaseService)
	statsService := services.NewStatsService(supabaseService)

	// Инициализация API
	applicationAPI := api.NewApplicationAPI(applicationService)
	questionAPI := api.NewQuestionAPI(questionService)
	statsAPI := api.NewStatsAPI(statsService)

	// Маршруты
	applicationAPI.RegisterRoutes(r)
	questionAPI.RegisterRoutes(r)
	statsAPI.RegisterRoutes(r)

	r.Run(":8080")
}