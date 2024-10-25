package models

type ColumnInfo struct {
	Name        string `json:"name"`
	Type        string `json:"type"`
	UniqueCount int    `json:"unique_count"`
}

type CSVData struct {
	Columns []ColumnInfo `json:"columns"`
	Rows    [][]string   `json:"rows"`
}
