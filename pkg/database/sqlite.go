package database

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

func ConnectDB(dataSourceName string) *sql.DB {
	db, err := sql.Open("sqlite", dataSourceName)
	if err != nil {
		log.Fatalf("FATAL: Error opening database file: %v", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatalf("FATAL: Error connecting to database: %v", err)
	}

	pragmaSQL := `PRAGMA foreign_keys = ON;`
	_, err = db.Exec(pragmaSQL)
	if err != nil {
		log.Fatalf("FATAL: Error enabling foreign keys: %v", err)
	}

	createTablesSQL := `
	CREATE TABLE IF NOT EXISTS conversations (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS messages (
		id INTEGER PRIMARY KEY,
		conversation_id INTEGER NOT NULL,
		role TEXT NOT NULL CHECK(role IN ('user', 'model')),
		content TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE
	);
	`

	_, err = db.Exec(createTablesSQL)
	if err != nil {
		log.Fatalf("FATAL: Error creating tables: %v", err)
	}

	log.Println("INFO: Database connected and tables verified successfully.")
	return db
}