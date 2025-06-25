package services

import (
	"encoding/json"
	"strconv"

	"github.com/IDevFrye/main/internal/models"
)

type QuestionService struct {
	supabase *SupabaseService
}

func NewQuestionService(supabase *SupabaseService) *QuestionService {
	return &QuestionService{supabase: supabase}
}

func (s *QuestionService) AddQuestion(question models.QuestionRequest) (int, error) {
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

func (s *QuestionService) GetQuestion(id int) (*models.Question, error) {
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

	return &question, nil
}

func (s *QuestionService) ListQuestions() ([]models.Question, error) {
	var questions []models.Question

	resultBytes, _, err := s.supabase.GetClient().From("interview_questions").
		Select("*", "", false).
		Execute()

	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(resultBytes, &questions); err != nil {
		return nil, err
	}

	return questions, nil
}

func (s *QuestionService) UpdateQuestion(id int, question models.QuestionUpdate) error {
	updates := make(map[string]interface{})
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