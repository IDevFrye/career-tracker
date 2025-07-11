package services

import (
	"encoding/json"
)

type StatsService struct {
	supabase *SupabaseService
}

func NewStatsService(supabase *SupabaseService) *StatsService {
	return &StatsService{supabase: supabase}
}

func (s *StatsService) GetRolesStats(userID string) ([]RoleStat, error) {
	rolesBytes, _, err := s.supabase.GetClient().From("applications").
		Select("roles", "", false).
		Eq("user_id", userID).
		Execute()

	if err != nil {
		return nil, err
	}

	var apps []struct {
		Roles []string `json:"roles"`
	}
	json.Unmarshal(rolesBytes, &apps)

	uniqueRoles := make(map[string]bool)
	for _, app := range apps {
		for _, role := range app.Roles {
			uniqueRoles[role] = true
		}
	}

	var stats []RoleStat
	for role := range uniqueRoles {
		var stat RoleStat
		stat.Role = role

		totalBytes, _, _ := s.supabase.GetClient().From("applications").
			Select("count", "exact", false).
			Contains("roles", []string{role}).
			Eq("user_id", userID).
			Execute()

		var total []map[string]interface{}
		json.Unmarshal(totalBytes, &total)
		if len(total) > 0 {
			stat.Total = int(total[0]["count"].(float64))
		}

		activeBytes, _, _ := s.supabase.GetClient().From("applications").
			Select("count", "exact", false).
			Contains("roles", []string{role}).
			Eq("user_id", userID).
			Eq("status", "Активный").
			Execute()

		var active []map[string]interface{}
		json.Unmarshal(activeBytes, &active)
		if len(active) > 0 {
			stat.Active = int(active[0]["count"].(float64))
		}

		rejectedBytes, _, _ := s.supabase.GetClient().From("applications").
			Select("count", "exact", false).
			Contains("roles", []string{role}).
			Eq("user_id", userID).
			Eq("status", "Отклонённый").
			Execute()

		var rejected []map[string]interface{}
		json.Unmarshal(rejectedBytes, &rejected)
		if len(rejected) > 0 {
			stat.Rejected = int(rejected[0]["count"].(float64))
		}

		offerBytes, _, _ := s.supabase.GetClient().From("applications").
			Select("count", "exact", false).
			Contains("roles", []string{role}).
			Eq("user_id", userID).
			Eq("status", "Оффер").
			Execute()

		var offer []map[string]interface{}
		json.Unmarshal(offerBytes, &offer)
		if len(offer) > 0 {
			stat.Offer = int(offer[0]["count"].(float64))
		}

		ignoredBytes, _, _ := s.supabase.GetClient().From("applications").
			Select("count", "exact", false).
			Contains("roles", []string{role}).
			Eq("user_id", userID).
			Eq("status", "Проигнорированный").
			Execute()

		var ignored []map[string]interface{}
		json.Unmarshal(ignoredBytes, &ignored)
		if len(ignored) > 0 {
			stat.Ignored = int(ignored[0]["count"].(float64))
		}

		abandonedBytes, _, _ := s.supabase.GetClient().From("applications").
			Select("count", "exact", false).
			Contains("roles", []string{role}).
			Eq("user_id", userID).
			Eq("status", "Заброшенный").
			Execute()

		var abandoned []map[string]interface{}
		json.Unmarshal(abandonedBytes, &abandoned)
		if len(abandoned) > 0 {
			stat.Abandoned = int(abandoned[0]["count"].(float64))
		}

		stats = append(stats, stat)
	}

	return stats, nil
}

type RoleStat struct {
	Role     string `json:"role"`
	Total    int    `json:"total"`
	Active   int    `json:"active"`
	Rejected int    `json:"rejected"`
	Offer    int    `json:"offer"`
	Ignored   int    `json:"ignored"`
	Abandoned    int    `json:"abandoned"`
}