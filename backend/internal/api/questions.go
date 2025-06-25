package api

import (
	"net/http"
	"strconv"

	"github.com/IDevFrye/main/internal/models"
	"github.com/IDevFrye/maingit/internal/services"
	"github.com/gin-gonic/gin"
)

type QuestionAPI struct {
	service *services.QuestionService
}

func NewQuestionAPI(service *services.QuestionService) *QuestionAPI {
	return &QuestionAPI{service: service}
}

func (q *QuestionAPI) RegisterRoutes(r *gin.Engine) {
	r.GET("/api/vacancies/:id/questions", q.GetApplicationQuestions)
	r.GET("/api/questions", q.ListAllQuestions)
	r.POST("/api/questions", q.AddQuestion)
	r.GET("/api/questions/:id", q.GetQuestion)
	r.PUT("/api/questions/:id", q.UpdateQuestion)
}

func (q *QuestionAPI) GetApplicationQuestions(c *gin.Context) {
	appID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid application ID"})
		return
	}

	questions, err := q.service.ListQuestions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var appQuestions []models.Question
	for _, q := range questions {
		if q.ApplicationID == appID {
			appQuestions = append(appQuestions, q)
		}
	}

	c.JSON(http.StatusOK, appQuestions)
}

func (q *QuestionAPI) ListAllQuestions(c *gin.Context) {
	questions, err := q.service.ListQuestions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var responses []models.QuestionResponse
	for _, q := range questions {
		responses = append(responses, models.QuestionResponse{
			ID:       q.ID,
			Question: q.Question,
			Tags:     q.Tags,
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

	id, err := q.service.AddQuestion(question)
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

	question, err := q.service.GetQuestion(id)
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

	if err := q.service.UpdateQuestion(id, update); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}