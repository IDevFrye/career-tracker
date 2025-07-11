package services

import (
	"encoding/json"
	"errors"
	"strconv"

	"github.com/IDevFrye/main/internal/models"
)

type QuestionService struct {
	supabase *SupabaseService
}

func NewQuestionService(supabase *SupabaseService) *QuestionService {
	return &QuestionService{supabase: supabase}
}

func (s *QuestionService) AddQuestion(question models.QuestionRequest, userID string) (int, error) {
	_, _, err := s.supabase.GetClient().From("applications").
		Select("id", "", false).
		Eq("id", strconv.Itoa(question.ApplicationID)).
		Eq("user_id", userID).
		Single().
		Execute()
	if err != nil {
		return 0, errors.New("Нет доступа к этой вакансии")
	}
	resultBytes, _, err := s.supabase.GetClient().From("interview_questions").
		Insert(map[string]interface{}{
			"application_id": question.ApplicationID,
			"question":      question.Question,
			"answer":        question.Answer,
			"tags":         question.Tags,
			"difficulty":    question.Difficulty,
		}, false, "", "", "").
		Execute()
	if err != nil {
		return 0, err
	}
	var results []struct {
		ID int `json:"id"`
	}
	if err := json.Unmarshal(resultBytes, &results); err != nil {
		return 0, err
	}
	if len(results) == 0 {
		return 0, err
	}
	return results[0].ID, nil
}

func (s *QuestionService) GetQuestion(id int, userID string) (*models.Question, error) {
	var question models.Question
	resultBytes, _, err := s.supabase.GetClient().From("interview_questions").
		Select("*", "", false).
		Eq("id", strconv.Itoa(id)).
		Single().
		Execute()
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(resultBytes, &question); err != nil {
		return nil, err
	}
	_, _, err = s.supabase.GetClient().From("applications").
		Select("id", "", false).
		Eq("id", strconv.Itoa(question.ApplicationID)).
		Eq("user_id", userID).
		Single().
		Execute()
	if err != nil {
		return nil, errors.New("Нет доступа к вопросу")
	}
	return &question, nil
}

func (s *QuestionService) ListQuestionsByApplication(appID int, userID string) ([]models.Question, error) {
	_, _, err := s.supabase.GetClient().From("applications").
		Select("id", "", false).
		Eq("id", strconv.Itoa(appID)).
		Eq("user_id", userID).
		Single().
		Execute()
	if err != nil {
		return nil, errors.New("Нет доступа к этой вакансии")
	}
	var questions []models.Question
	resultBytes, _, err := s.supabase.GetClient().From("interview_questions").
		Select("*", "", false).
		Eq("application_id", strconv.Itoa(appID)).
		Execute()
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(resultBytes, &questions); err != nil {
		return nil, err
	}
	return questions, nil
}

func (s *QuestionService) ListQuestionsForUser(userID string) ([]models.Question, error) {
	appsBytes, _, err := s.supabase.GetClient().From("applications").
		Select("id", "", false).
		Eq("user_id", userID).
		Execute()
	if err != nil {
		return nil, err
	}
	var apps []struct{ ID int `json:"id"` }
	if err := json.Unmarshal(appsBytes, &apps); err != nil {
		return nil, err
	}
	if len(apps) == 0 {
		return []models.Question{}, nil
	}
	ids := make([]int, len(apps))
	for i, a := range apps {
		ids[i] = a.ID
	}
	var questions []models.Question
	for _, appID := range ids {
		resultBytes, _, err := s.supabase.GetClient().From("interview_questions").
			Select("*", "", false).
			Eq("application_id", strconv.Itoa(appID)).
			Execute()
		if err == nil {
			var qs []models.Question
			if err := json.Unmarshal(resultBytes, &qs); err == nil {
				questions = append(questions, qs...)
			}
		}
	}
	return questions, nil
}

func (s *QuestionService) UpdateQuestion(id int, question models.QuestionUpdate, userID string) error {
	if _, err := s.GetQuestion(id, userID); err != nil {
		return errors.New("Нет доступа к вопросу")
	}
	updates := make(map[string]interface{})
	if question.ApplicationID != nil {
		updates["application_id"] = *question.ApplicationID
	}
	if question.Question != nil {
		updates["question"] = *question.Question
	}
	if question.Answer != nil {
		updates["answer"] = *question.Answer
	}
	if question.Tags != nil {
		updates["tags"] = *question.Tags
	}
	if question.Difficulty != nil {
		updates["difficulty"] = *question.Difficulty
	}

	_, _, err := s.supabase.GetClient().From("interview_questions").
		Update(updates, "", "").
		Eq("id", strconv.Itoa(id)).
		Execute()
	return err
}

func (s *QuestionService) DeleteQuestion(id int, userID string) error {
	if _, err := s.GetQuestion(id, userID); err != nil {
		return errors.New("Нет доступа к вопросу")
	}
	_, _, err := s.supabase.GetClient().From("interview_questions").
		Delete("", "").
		Eq("id", strconv.Itoa(id)).
		Execute()		
	return err
}