package services

import (
	"log"
	"os"

	"github.com/supabase-community/supabase-go"
)

type SupabaseService struct {
	client *supabase.Client
}

func NewSupabaseService() *SupabaseService {
	url := os.Getenv("SUPABASE_URL")
	key := os.Getenv("SUPABASE_KEY")
	
	if url == "" || key == "" {
		log.Fatal("SUPABASE_URL и SUPABASE_KEY должны быть установлены")
	}

	client, err := supabase.NewClient(url, key, nil)
	if err != nil {
		panic("Ошибка подключения к Supabase: " + err.Error())
	}
	
	return &SupabaseService{client: client}
}

func (s *SupabaseService) GetClient() *supabase.Client {
	return s.client
}