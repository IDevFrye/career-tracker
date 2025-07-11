package api

import (
	"net/http"
	"strconv"

	"github.com/IDevFrye/main/internal/models"
	"github.com/IDevFrye/main/internal/services"
	"github.com/gin-gonic/gin"
)

type ApplicationAPI struct {
	service *services.ApplicationService
}

func NewApplicationAPI(service *services.ApplicationService) *ApplicationAPI {
	return &ApplicationAPI{service: service}
}

func (a *ApplicationAPI) RegisterRoutes(r *gin.RouterGroup) {
	r.POST("/api/vacancies", a.addApplication)
	r.GET("/api/vacancies", a.listApplications)
	r.GET("/api/vacancies/:id", a.getApplication)
	r.PUT("/api/vacancies/:id", a.updateApplication)
	r.DELETE("/api/vacancies/:id", a.deleteApplication)
}

func (a *ApplicationAPI) addApplication(c *gin.Context) {
	var request models.ApplicationRequest
	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат данных"})
		return
	}

	userID, _ := c.Get("user_id")
	appID, err := a.service.AddApplication(request, userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": appID})
}

func (a *ApplicationAPI) listApplications(c *gin.Context) {
	userID, _ := c.Get("user_id")
	applications, err := a.service.ListApplications(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, applications)
}

func (a *ApplicationAPI) getApplication(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный ID"})
		return
	}
	userID, _ := c.Get("user_id")
	application, err := a.service.GetApplication(id, userID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, application)
}

func (a *ApplicationAPI) deleteApplication(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный ID"})
		return
	}
	userID, _ := c.Get("user_id")
	if err := a.service.DeleteApplication(id, userID.(string)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (a *ApplicationAPI) updateApplication(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный ID"})
		return
	}

	var request struct {
		Title           *string `json:"title,omitempty"`
		RecruiterName   *string `json:"recruiter_name,omitempty"`
		RecruiterContact *string `json:"recruiter_contact,omitempty"`
		Status          *string `json:"status,omitempty"`
		Stages          *[]models.ApplicationStage `json:"stages,omitempty"`
	}

	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат данных"})
		return
	}
	userID, _ := c.Get("user_id")
	if err := a.service.UpdateApplication(id, request, userID.(string)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	application, err := a.service.GetApplication(id, userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка получения обновленной вакансии"})
		return
	}

	c.JSON(http.StatusOK, application)
}