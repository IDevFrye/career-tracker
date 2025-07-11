package main

import (
	"log"
	"os"

	"github.com/IDevFrye/main/internal/api"
	"github.com/IDevFrye/main/internal/middleware"
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
	Auth struct {
		JwtSecret string `yaml:"jwt_secret"`
	} `yaml:"auth"`
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

	apiGroup := r.Group("/", middleware.AuthRequired([]byte(config.Auth.JwtSecret)))
	applicationAPI.RegisterRoutes(apiGroup)
	questionAPI.RegisterRoutes(apiGroup)
	statsAPI.RegisterRoutes(apiGroup)

	r.Run(":8080")
}