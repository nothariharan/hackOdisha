package database

import (
"database/sql"
"log"
"os"

_ "modernc.org/sqlite"
)

type Database struct {
DB *sql.DB
}

func NewDatabase() (*Database, error) {
// Create database directory if it doesn't exist
if err := os.MkdirAll("./data", 0755); err != nil {
return nil, err
}

// Open SQLite database
db, err := sql.Open("sqlite", "./data/ecotracker.db")
if err != nil {
return nil, err
}

// Test the connection
if err := db.Ping(); err != nil {
return nil, err
}

database := &Database{DB: db}

// Initialize tables
if err := database.InitTables(); err != nil {
return nil, err
}

log.Println("Database connected successfully")
return database, nil
}

func (d *Database) InitTables() error {
// Create users table
usersTable := `
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT UNIQUE NOT NULL,
password TEXT NOT NULL,
name TEXT NOT NULL,
phone TEXT NOT NULL,
points INTEGER DEFAULT 0,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`

// Create shops table
shopsTable := `
CREATE TABLE IF NOT EXISTS shops (
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT UNIQUE NOT NULL,
password TEXT NOT NULL,
name TEXT NOT NULL,
address TEXT NOT NULL,
phone TEXT NOT NULL,
description TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`

// Create shop_items table
shopItemsTable := `
CREATE TABLE IF NOT EXISTS shop_items (
id INTEGER PRIMARY KEY AUTOINCREMENT,
shop_id INTEGER NOT NULL,
name TEXT NOT NULL,
price REAL NOT NULL,
category TEXT NOT NULL,
description TEXT,
is_eco_friendly BOOLEAN DEFAULT FALSE,
FOREIGN KEY (shop_id) REFERENCES shops (id)
);`

// Create receipts table
receiptsTable := `
CREATE TABLE IF NOT EXISTS receipts (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
shop_id INTEGER NOT NULL,
total_amount REAL NOT NULL,
points_earned INTEGER NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users (id),
FOREIGN KEY (shop_id) REFERENCES shops (id)
);`

// Create receipt_items table
receiptItemsTable := `
CREATE TABLE IF NOT EXISTS receipt_items (
id INTEGER PRIMARY KEY AUTOINCREMENT,
receipt_id INTEGER NOT NULL,
name TEXT NOT NULL,
price REAL NOT NULL,
quantity INTEGER NOT NULL,
category TEXT NOT NULL,
is_eco_friendly BOOLEAN DEFAULT FALSE,
FOREIGN KEY (receipt_id) REFERENCES receipts (id)
);`

// Execute table creation
tables := []string{usersTable, shopsTable, shopItemsTable, receiptsTable, receiptItemsTable}

for _, table := range tables {
if _, err := d.DB.Exec(table); err != nil {
return err
}
}

log.Println("Database tables initialized successfully")
return nil
}

func (d *Database) Close() error {
return d.DB.Close()
}
