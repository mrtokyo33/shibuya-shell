package config

import (
	"log"
	"os"
	"github.com/joho/godotenv"
)

type Config struct {
	GeminiAPIKey string
}

var AppConfig *Config

func LoadConfig() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file:", err)
	}

	AppConfig = &Config{
		GeminiAPIKey: os.Getenv("GEMINI_API_KEY"),
	}

	if AppConfig.GeminiAPIKey == "" {
		log.Fatal("Gemini API Key is missing in the environment variables")
	}

	return AppConfig, nil
}