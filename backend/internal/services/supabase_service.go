package services

import (
	"log"
	"os"

	"github.com/supabase-community/supabase-go"
	"gopkg.in/yaml.v3"
)

type SupabaseService struct {
	client *supabase.Client
}

type Config struct {
	Supabase struct {
		URL string `yaml:"url"`
		Key string `yaml:"key"`
	} `yaml:"supabase"`
}

func NewSupabaseService() *SupabaseService {
	data, err := os.ReadFile("config.yaml")
	if err != nil {
		log.Fatal(err)
	}

	var config Config
	err = yaml.Unmarshal(data, &config)
	if err != nil {
		log.Fatal(err)
	}

	client, err := supabase.NewClient(config.Supabase.URL, config.Supabase.Key, nil)
	if err != nil {
		panic("Ошибка подключения к Supabase: " + err.Error())
	}
	
	return &SupabaseService{client: client}
}

func (s *SupabaseService) GetClient() *supabase.Client {
	return s.client
}