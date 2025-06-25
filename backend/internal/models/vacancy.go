package models

type Skill struct {
	Name string `json:"name"`
}

type Role struct {
	Name string `json:"name"`
}

type Vacancy struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Employer struct {
		Name string `json:"name"`
	} `json:"employer"`
	Salary struct {
		From     float64 `json:"from"`
		To       float64 `json:"to"`
		Currency string  `json:"currency"`
	} `json:"salary"`
	KeySkills    []Skill `json:"key_skills"`
	AlternateURL string  `json:"alternate_url"`
	Schedule     struct {
		Name string `json:"name"`
	} `json:"schedule"`
	Employment struct {
		Name string `json:"name"`
	} `json:"employment"`
	Experience struct {
		Name string `json:"name"`
	} `json:"experience"`
	Type struct {
		Name string `json:"name"`
	} `json:"type"`
	Roles []Role `json:"professional_roles"`
}