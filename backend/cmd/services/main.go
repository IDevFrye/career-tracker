package main

import (
	"log"
	"os"

	"github.com/IDevFrye/main/internal/api"
	"github.com/IDevFrye/main/internal/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gopkg.in/yaml.v3"
)

type Config struct {
	Supabase struct {
		URL string `yaml:"url"`
		Key string `yaml:"key"`
	} `yaml:"supabase"`
	CORS struct {
		Origins []string `yaml:"origins"`
	} `yaml:"cors"`
}

func loadConfig() (*Config, error) {
	data, err := os.ReadFile("config.yaml")
	if err != nil {
		return nil, err
	}

	var config Config
	err = yaml.Unmarshal(data, &config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}

func main() {
	// Загрузка конфигурации
	config, err := loadConfig()
	if err != nil {
		log.Fatal("Ошибка загрузки конфигурации:", err)
	}

	r := gin.Default()
	
	// Настройка CORS из конфигурации
	r.Use(cors.New(cors.Config{
		AllowOrigins:     config.CORS.Origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

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