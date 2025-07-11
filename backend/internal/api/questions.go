package api

import (
	"net/http"
	"strconv"

	"github.com/IDevFrye/main/internal/models"
	"github.com/IDevFrye/main/internal/services"
	"github.com/gin-gonic/gin"
)

type QuestionAPI struct {
	service *services.QuestionService
}

func NewQuestionAPI(service *services.QuestionService) *QuestionAPI {
	return &QuestionAPI{service: service}
}

func (q *QuestionAPI) RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/api/vacancies/:id/questions", q.GetApplicationQuestions)
	r.GET("/api/questions", q.ListAllQuestions)
	r.POST("/api/questions", q.AddQuestion)
	r.GET("/api/questions/:id", q.GetQuestion)
	r.PUT("/api/questions/:id", q.UpdateQuestion)
	r.DELETE("/api/questions/:id", q.DeleteQuestion)
}

func (q *QuestionAPI) GetApplicationQuestions(c *gin.Context) {
	appID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid application ID"})
		return
	}
	userID, _ := c.Get("user_id")
	questions, err := q.service.ListQuestionsByApplication(appID, userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, questions)
}

func (q *QuestionAPI) ListAllQuestions(c *gin.Context) {
	userID, _ := c.Get("user_id")
	questions, err := q.service.ListQuestionsForUser(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var responses []models.QuestionResponse
	for _, q := range questions {
		responses = append(responses, models.QuestionResponse{
			ID:            q.ID,
			ApplicationID: q.ApplicationID,
			Question:      q.Question,
			Tags:          q.Tags,
			Difficulty:    q.Difficulty,
			CreatedAt:     q.CreatedAt,
		})
	}
	c.JSON(http.StatusOK, responses)
}

func (q *QuestionAPI) AddQuestion(c *gin.Context) {
	var question models.QuestionRequest
	if err := c.BindJSON(&question); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userID, _ := c.Get("user_id")
	id, err := q.service.AddQuestion(question, userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func (q *QuestionAPI) GetQuestion(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid question ID"})
		return
	}
	userID, _ := c.Get("user_id")
	question, err := q.service.GetQuestion(id, userID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, question)
}

func (q *QuestionAPI) UpdateQuestion(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid question ID"})
		return
	}
	var update models.QuestionUpdate
	if err := c.BindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userID, _ := c.Get("user_id")
	if err := q.service.UpdateQuestion(id, update, userID.(string)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (q *QuestionAPI) DeleteQuestion(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid question ID"})
		return
	}
	userID, _ := c.Get("user_id")
	if err := q.service.DeleteQuestion(id, userID.(string)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}