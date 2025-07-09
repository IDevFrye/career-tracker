package models

import "time"

type ApplicationRequest struct {
	URL             string             `json:"url"`
	RecruiterName   string             `json:"recruiter_name"`
	RecruiterContact string            `json:"recruiter_contact"`
	Stages          []ApplicationStage `json:"stages"`
}

type ApplicationStage struct {
	StageName string    `json:"stage_name"`
	Status    string    `json:"status"`
	Date      time.Time `json:"date"`
	Comment   string    `json:"comment"`
	Icon      string    `json:"icon"`
}

type ApplicationResponse struct {
	ID          int                `json:"id"`
	Title       string             `json:"title"`
	Company     string             `json:"company"`
	OriginalURL string             `json:"original_url"`
	Status      string             `json:"status"`
	CreatedAt   time.Time          `json:"created_at"`
	Stages      []ApplicationStage `json:"stages"`
}

type ApplicationDetail struct {
	ID              int                `json:"id"`
	Title           string             `json:"title"`
	Company         string             `json:"company"`
	OriginalURL     string             `json:"original_url"`
	Status          string             `json:"status"`
	SalaryFrom      float64            `json:"salary_from"`
	SalaryTo        float64            `json:"salary_to"`
	SalaryCurrency  string             `json:"salary_currency"`
	WorkSchedule    string             `json:"work_schedule"`
	Experience      string             `json:"experience"`
	EmploymentType  string             `json:"employment_type"`
	Type            string             `json:"type"`
	RecruiterName   string             `json:"recruiter_name"`
	RecruiterContact string            `json:"recruiter_contact"`
	Skills          []string           `json:"skills"`
	Roles           []string           `json:"roles"`
	Stages          []ApplicationStage `json:"stages"`
}

type ApplicationUpdate struct {
	Title           *string            `json:"title,omitempty"`
	Type            *string            `json:"type,omitempty"`
	RecruiterName   *string            `json:"recruiter_name,omitempty"`
	RecruiterContact *string           `json:"recruiter_contact,omitempty"`
	Status          *string            `json:"status,omitempty"`
	Stages          *[]ApplicationStage `json:"stages,omitempty"`
}