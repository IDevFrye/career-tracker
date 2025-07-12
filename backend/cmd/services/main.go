package main

import (
	"log"
	"os"
	"strings"

	"github.com/IDevFrye/main/internal/api"
	"github.com/IDevFrye/main/internal/middleware"
	"github.com/IDevFrye/main/internal/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Config struct {
	Supabase struct {
		URL string
		Key string
	}
	CORS struct {
		Origins []string
	}
	Auth struct {
		JwtSecret string
	}
}

func loadConfig() (*Config, error) {
	var config Config

	config.Supabase.URL = os.Getenv("SUPABASE_URL")
	config.Supabase.Key = os.Getenv("SUPABASE_KEY")
	config.Auth.JwtSecret = os.Getenv("JWT_SECRET")
	
	corsOrigins := os.Getenv("CORS_ORIGINS")
	if corsOrigins != "" {
		// Разбиваем по запятой и убираем пробелы
		origins := strings.Split(corsOrigins, ",")
		for i := range origins {
			origins[i] = strings.TrimSpace(origins[i])
		}
		config.CORS.Origins = origins
	} else {
		config.CORS.Origins = []string{"*"}
	}

	return &config, nil
}

func main() {
	config, err := loadConfig()
	if err != nil {
		log.Fatal("Ошибка загрузки конфигурации:", err)
	}

	r := gin.Default()
	
	r.Use(cors.New(cors.Config{
		AllowOrigins:     config.CORS.Origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	supabaseService := services.NewSupabaseService()
	applicationService := services.NewApplicationService(supabaseService)
	questionService := services.NewQuestionService(supabaseService)
	statsService := services.NewStatsService(supabaseService)

	applicationAPI := api.NewApplicationAPI(applicationService)
	questionAPI := api.NewQuestionAPI(questionService)
	statsAPI := api.NewStatsAPI(statsService)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"service": "career-tracker-backend",
			"version": "1.0.0",
		})
	})

	apiGroup := r.Group("/api", middleware.AuthRequired([]byte(config.Auth.JwtSecret)))
	applicationAPI.RegisterRoutes(apiGroup)
	questionAPI.RegisterRoutes(apiGroup)
	statsAPI.RegisterRoutes(apiGroup)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	r.Run(":" + port)
}