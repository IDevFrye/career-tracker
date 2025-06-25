package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/IDevFrye/main/internal/models"
)

func ExtractVacancyID(url string) (string, error) {
	parts := strings.Split(url, "/")
	for i := len(parts) - 1; i >= 0; i-- {
		if parts[i] != "" && parts[i] != "vacancy" {
			return parts[i], nil
		}
	}
	return "", fmt.Errorf("не удалось извлечь ID из URL")
}

func FetchHHVacancy(id string) (*models.Vacancy, error) {
	resp, err := http.Get("https://api.hh.ru/vacancies/" + id)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API вернул статус %d", resp.StatusCode)
	}

	var vacancy models.Vacancy
	if err := json.NewDecoder(resp.Body).Decode(&vacancy); err != nil {
		return nil, err
	}

	return &vacancy, nil
}

func ParseSkills(skills []models.Skill) []string {
	result := make([]string, len(skills))
	for i, skill := range skills {
		result[i] = skill.Name
	}
	return result
}

func ParseRoles(roles []models.Role) []string {
	result := make([]string, len(roles))
	for i, role := range roles {
		result[i] = role.Name
	}
	return result
}