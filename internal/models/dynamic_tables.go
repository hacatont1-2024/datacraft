package models

type DynamicTable struct {
	TableName string                 `json:"tableName"`
	Columns   map[string]interface{} `json:"columns"`
}
