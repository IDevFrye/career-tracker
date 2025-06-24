package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	supabase "github.com/supabase-community/supabase-go"
)

var supabaseClient *supabase.Client

type Skill struct {
    Name string `json:"name"`
}

type Role struct {
	Name string `json:"name"`
}

type Vacancy struct {
    ID       string `json:"id"`
    Name     string `json:"name"`
    Employer struct {
        Name string `json:"name"`
    } `json:"employer"`
    Salary struct {
        From     float64 `json:"from"`
        To       float64 `json:"to"`
        Currency string  `json:"currency"`
    } `json:"salary"`
    KeySkills   []Skill `json:"key_skills"`
    AlternateURL string `json:"alternate_url"`
	Schedule struct {
        Name string `json:"name"`
    } `json:"schedule"`
	Employment struct {
        Name string `json:"name"`
    } `json:"employment"`
	Experience struct {
        Name string `json:"name"`
    } `json:"experience"`
	Type struct {
        Name string `json:"name"`
    } `json:"type"`
	Roles  []Role `json:"professional_roles"`
}

func init() {
	supabaseURL := ""
	supabaseKey := ""
	
	client, err := supabase.NewClient(supabaseURL, supabaseKey, nil)
	if err != nil {
		log.Fatal("Ошибка подключения к Supabase:", err)
	}
	supabaseClient = client
}

func main() {
	r := gin.Default()
	r.POST("/api/vacancies", addApplication)
	r.Run(":8080")
}

func extractVacancyID(url string) (string, error) {
	parts := strings.Split(url, "/")
	for i := len(parts) - 1; i >= 0; i-- {
		if parts[i] != "" && parts[i] != "vacancy" {
			return parts[i], nil
		}
	}
	return "", fmt.Errorf("не удалось извлечь ID из URL")
}

func fetchHHVacancy(id string) (*Vacancy, error) {
	resp, err := http.Get("https://api.hh.ru/vacancies/" + id)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API вернул статус %d", resp.StatusCode)
	}

	var vacancy Vacancy
	if err := json.NewDecoder(resp.Body).Decode(&vacancy); err != nil {
		return nil, err
	}

	return &vacancy, nil
}

func parseSkills(skills []Skill) []string {
	result := make([]string, len(skills))
	for i, skill := range skills {
		result[i] = skill.Name
	}
	return result
}

func parseRoles(roles []Role) []string {
	result := make([]string, len(roles))
	for i, role := range roles {
		result[i] = role.Name
	}
	return result
}

func addApplication(c *gin.Context) {
	var request struct {
		URL             string `json:"url"`
		RecruiterName   string `json:"recruiter_name"`
		RecruiterContact string `json:"recruiter_contact"`
		Stages          []struct {
			StageName string `json:"stage_name"`
			Status    string `json:"status"`
			Date      string `json:"date"`
		} `json:"stages"`
	}

	if err := c.BindJSON(&request); err != nil {
		c.JSON(400, gin.H{"error": "Неверный формат данных"})
		return
	}

	vacancyID, err := extractVacancyID(request.URL)
	if err != nil {
		c.JSON(400, gin.H{"error": "Неверный URL вакансии"})
		return
	}

	vacancy, err := fetchHHVacancy(vacancyID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Ошибка запроса к HH.ru"})
		return
	}

	var resultBytes []byte
	var result []map[string]interface{}
	resultBytes, _, err = supabaseClient.From("applications").Insert(map[string]interface{}{
		"hh_id":            vacancyID,
		"title":            vacancy.Name,
		"company":          vacancy.Employer.Name,
		"salary_from":      vacancy.Salary.From,
		"salary_to":        vacancy.Salary.To,
		"salary_currency":  vacancy.Salary.Currency,
		"skills":           parseSkills(vacancy.KeySkills),
		"roles":            parseRoles(vacancy.Roles),
		"original_url":     request.URL,
		"work_schedule":    vacancy.Schedule.Name,
		"experience":       vacancy.Experience.Name,
		"employment_type":  vacancy.Employment.Name,
		"type":             vacancy.Type.Name,
		"recruiter_name":   request.RecruiterName,
		"recruiter_contact": request.RecruiterContact,
	}, false, "", "", "").Execute()

	if err != nil {
		c.JSON(500, gin.H{"error": "Ошибка сохранения отклика: " + err.Error()})
		return
	}

	err = json.Unmarshal(resultBytes, &result)
	if err != nil {
		log.Fatal("JSON unmarshal error:", err)
	}

	// Получаем ID новой записи
	var appID int
	if len(result) > 0 {
		if id, ok := result[0]["id"].(float64); ok {
			appID = int(id)
		}
	}

	// Сохраняем этапы
	for _, stage := range request.Stages {
		resultBytes,_, err = supabaseClient.From("application_stages").Insert(map[string]interface{}{
			"application_id": appID,
			"stage_name":     stage.StageName,
			"status":        stage.Status,
			"date":          stage.Date,
		}, false, "", "", "").Execute()
		if err != nil {
			c.JSON(500, gin.H{"error": "Ошибка сохранения этапа: " + err.Error()})
			return
		}
		err = json.Unmarshal(resultBytes, &result)
		if err != nil {
			log.Fatal("JSON unmarshal error:", err)
		}
	}

	c.JSON(200, gin.H{"id": appID})
}