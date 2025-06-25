package models

type QuestionRequest struct {
	ApplicationID int      `json:"application_id" binding:"required"`
	Question      string   `json:"question" binding:"required"`
	Answer        string   `json:"answer"`
	Tags          []string `json:"tags"`
	Difficulty    int      `json:"difficulty" binding:"gte=1,lte=5"`
}

type Question struct {
	ID            int      `json:"id"`
	ApplicationID int      `json:"application_id"`
	Question      string   `json:"question"`
	Answer        string   `json:"answer"`
	Tags          []string `json:"tags"`
	Difficulty    int      `json:"difficulty"`
}

type QuestionUpdate struct {
	Question   *string   `json:"question,omitempty"`
	Answer     *string   `json:"answer,omitempty"`
	Tags       *[]string `json:"tags,omitempty"`
	Difficulty *int      `json:"difficulty,omitempty"`
}

type QuestionResponse struct {
	ID       int      `json:"id"`
	Question string   `json:"question"`
	Tags     []string `json:"tags"`
}