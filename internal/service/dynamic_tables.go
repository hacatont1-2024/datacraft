package services

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq" // Импортируем драйвер PostgreSQL
)

type DynamicTableService struct {
	db *sql.DB
}

func NewDynamicTableService(dataSourceName string) (*DynamicTableService, error) {
	db, err := sql.Open("postgres", dataSourceName)
	if err != nil {
		return nil, err
	}
	return &DynamicTableService{db: db}, nil
}

func (s *DynamicTableService) CreateTable(tableName string, columns []string) error {
	query := fmt.Sprintf("CREATE TABLE IF NOT EXISTS %s (", tableName)
	for _, column := range columns {
		query += fmt.Sprintf("%s VARCHAR(255),", column)
	}
	query = query[:len(query)-1] + ")"
	_, err := s.db.Exec(query)
	return err
}

func (s *DynamicTableService) InsertData(tableName string, data map[string]interface{}) error {
	query := fmt.Sprintf("INSERT INTO %s (", tableName)
	for column := range data {
		query += fmt.Sprintf("%s,", column)
	}
	query = query[:len(query)-1] + ") VALUES ("
	for range data {
		query += "?,"
	}
	query = query[:len(query)-1] + ")"

	_, err := s.db.Exec(query, getValues(data)...)
	return err
}

func (s *DynamicTableService) GetData(tableName string) ([]map[string]interface{}, error) {
	rows, err := s.db.Query(fmt.Sprintf("SELECT * FROM %s", tableName))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}

	var results []map[string]interface{}
	for rows.Next() {
		values := make([]interface{}, len(columns))
		for i := range values {
			values[i] = new(sql.NullString)
		}
		if err := rows.Scan(values...); err != nil {
			return nil, err
		}

		row := make(map[string]interface{})
		for i, col := range columns {
			val := values[i].(*sql.NullString)
			if val.Valid {
				row[col] = val.String
			} else {
				row[col] = nil
			}
		}
		results = append(results, row)
	}
	return results, nil
}

func (s *DynamicTableService) DeleteData(tableName string, conditions map[string]interface{}) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE ", tableName)
	for column := range conditions {
		query += fmt.Sprintf("%s = ? AND ", column)
	}
	query = query[:len(query)-5] // Удаляем " AND "

	_, err := s.db.Exec(query, getValues(conditions)...)
	return err
}

// Вспомогательная функция для получения значений из карты
func getValues(data map[string]interface{}) []interface{} {
	values := make([]interface{}, len(data))
	i := 0
	for _, v := range data {
		values[i] = v
		i++
	}
	return values
}
