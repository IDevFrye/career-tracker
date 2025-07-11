package services

import (
	"encoding/json"
	"errors"
	"strconv"

	"github.com/IDevFrye/main/internal/models"
	"github.com/IDevFrye/main/internal/utils"
	"github.com/supabase-community/postgrest-go"
)

type ApplicationService struct {
	supabase *SupabaseService
}

func NewApplicationService(supabase *SupabaseService) *ApplicationService {
	return &ApplicationService{supabase: supabase}
}

func (s *ApplicationService) AddApplication(request models.ApplicationRequest, userID string) (int, error) {
	vacancyID, err := utils.ExtractVacancyID(request.URL)
	if err != nil {
		return 0, err
	}

	vacancy, err := utils.FetchHHVacancy(vacancyID)
	if err != nil {
		return 0, err
	}

	resultBytes, _, err := s.supabase.GetClient().From("applications").Insert(map[string]interface{}{
		"hh_id":            vacancyID,
		"title":            vacancy.Name,
		"company":          vacancy.Employer.Name,
		"salary_from":      vacancy.Salary.From,
		"salary_to":        vacancy.Salary.To,
		"salary_currency":  vacancy.Salary.Currency,
		"skills":           utils.ParseSkills(vacancy.KeySkills),
		"roles":            utils.ParseRoles(vacancy.Roles),
		"original_url":     request.URL,
		"work_schedule":    vacancy.Schedule.Name,
		"experience":       vacancy.Experience.Name,
		"employment_type":  vacancy.Employment.Name,
		"type":             vacancy.Type.Name,
		"recruiter_name":   request.RecruiterName,
		"recruiter_contact": request.RecruiterContact,
		"user_id":          userID,
	}, false, "", "", "").Execute()

	if err != nil {
		return 0, err
	}

	var result []map[string]interface{}
	if err := json.Unmarshal(resultBytes, &result); err != nil {
		return 0, err
	}

	var appID int
	if len(result) > 0 {
		if id, ok := result[0]["id"].(float64); ok {
			appID = int(id)
		}
	}

	for _, stage := range request.Stages {
		_, _, err = s.supabase.GetClient().From("application_stages").Insert(map[string]interface{}{
			"application_id": appID,
			"stage_name":     stage.StageName,
			"status":        stage.Status,
			"date":          stage.Date,
			"comment":       stage.Comment,
			"icon":          stage.Icon,
		}, false, "", "", "").Execute()
		if err != nil {
			return 0, err
		}
	}

	return appID, nil
}

func (s *ApplicationService) ListApplications(userID string) ([]models.ApplicationResponse, error) {
	var applications []models.ApplicationResponse

	resultBytes, _, err := s.supabase.GetClient().From("applications").
		Select("id,title,company,original_url,status,created_at", "", false).
		Eq("user_id", userID).
		Order("created_at", &postgrest.OrderOpts{Ascending: false}).
		Execute()

	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(resultBytes, &applications); err != nil {
		return nil, err
	}

	for i, app := range applications {
		var stages []models.ApplicationStage
		stageBytes, _, err := s.supabase.GetClient().From("application_stages").
			Select("stage_name,status,date,comment,icon", "", false).
			Eq("application_id", strconv.Itoa(app.ID)).
			Execute()

		if err == nil {
			json.Unmarshal(stageBytes, &stages)
		}
		applications[i].Stages = stages
	}

	return applications, nil
}

func (s *ApplicationService) GetApplication(id int, userID string) (*models.ApplicationDetail, error) {
	var application models.ApplicationDetail

	resultBytes, _, err := s.supabase.GetClient().From("applications").
		Select("*", "", false).
		Eq("id", strconv.Itoa(id)).
		Eq("user_id", userID).
		Single().
		Execute()

	if err != nil {
		return nil, errors.New("отклик не найден")
	}

	if err := json.Unmarshal(resultBytes, &application); err != nil {
		return nil, errors.New("ошибка разбора данных")
	}

	stageBytes, _, err := s.supabase.GetClient().From("application_stages").
		Select("stage_name,status,date,comment,icon", "", false).
		Eq("application_id", strconv.Itoa(id)).
		Execute()

	if err == nil {
		var stages []models.ApplicationStage
		json.Unmarshal(stageBytes, &stages)
		application.Stages = stages
	}

	return &application, nil
}

func (s *ApplicationService) UpdateApplication(id int, request struct {
	Title           *string `json:"title,omitempty"`
	RecruiterName   *string `json:"recruiter_name,omitempty"`
	RecruiterContact *string `json:"recruiter_contact,omitempty"`
	Status          *string `json:"status,omitempty"`
	Stages          *[]models.ApplicationStage `json:"stages,omitempty"`
}, userID string) error {
	updates := make(map[string]interface{})
	if request.Title != nil {
		updates["title"] = *request.Title
	}
	if request.RecruiterName != nil {
		updates["recruiter_name"] = *request.RecruiterName
	}
	if request.RecruiterContact != nil {
		updates["recruiter_contact"] = *request.RecruiterContact
	}
	if request.Status != nil {
		updates["status"] = *request.Status
	}

	if len(updates) > 0 {
		_, _, err := s.supabase.GetClient().From("applications").
			Update(updates, "", "").
			Eq("id", strconv.Itoa(id)).
			Eq("user_id", userID).
			Execute()

		if err != nil {
			return errors.New("ошибка обновления отклика")
		}
	}

	if request.Stages != nil {
		_, _, err := s.supabase.GetClient().From("application_stages").
			Delete("", "").
			Eq("application_id", strconv.Itoa(id)).
			Execute()

		if err != nil {
			return errors.New("ошибка удаления старых этапов")
		}

		for _, stage := range *request.Stages {
			_, _, err := s.supabase.GetClient().From("application_stages").
				Insert(map[string]interface{}{
					"application_id": id,
					"stage_name":    stage.StageName,
					"status":        stage.Status,
					"date":          stage.Date,
					"comment":       stage.Comment,
					"icon":          stage.Icon,
				}, false, "", "", "").
				Execute()

			if err != nil {
				return errors.New("ошибка добавления этапа")
			}
		}
	}

	return nil
}

func (s *ApplicationService) DeleteApplication(id int, userID string) error {
	_, _, err := s.supabase.GetClient().From("applications").
		Select("id", "", false).
		Eq("id", strconv.Itoa(id)).
		Eq("user_id", userID).
		Single().
		Execute()
	if err != nil {
		return errors.New("нет доступа к удалению этой записи")
	}
	_, _, err = s.supabase.GetClient().From("application_stages").
		Delete("", "").
		Eq("application_id", strconv.Itoa(id)).
		Execute()

	if err != nil {
		return errors.New("ошибка удаления этапов")
	}

	_, _, err = s.supabase.GetClient().From("applications").
		Delete("", "").
		Eq("id", strconv.Itoa(id)).
		Eq("user_id", userID).
		Execute()

	if err != nil {
		return errors.New("ошибка удаления отклика")
	}

	return nil
}