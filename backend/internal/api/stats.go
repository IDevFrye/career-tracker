package api

import (
	"net/http"

	"github.com/IDevFrye/main/internal/services"
	"github.com/gin-gonic/gin"
)

type StatsAPI struct {
	service *services.StatsService
}

func NewStatsAPI(service *services.StatsService) *StatsAPI {
	return &StatsAPI{service: service}
}

func (s *StatsAPI) RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/api/stats/roles", s.GetRolesStats)
}

func (s *StatsAPI) GetRolesStats(c *gin.Context) {
	userID, _ := c.Get("user_id")
	stats, err := s.service.GetRolesStats(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}