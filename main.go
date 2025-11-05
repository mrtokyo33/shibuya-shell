package main

import (
	"context"
	"embed"
	"log"

	"github.com/mrtokyo33/shibuya-shell/pkg/config"
	"github.com/mrtokyo33/shibuya-shell/pkg/database"
	"github.com/mrtokyo33/shibuya-shell/pkg/repository"
	"github.com/mrtokyo33/shibuya-shell/pkg/service"
	"github.com/mrtokyo33/shibuya-shell/pkg/utils"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	config.LoadConfig()

	if err := utils.InitSnowflake(1, 1); err != nil {
		log.Fatalf("FATAL: Failed to initialize Snowflake generator: %v", err)
	}

	db := database.ConnectDB("./shibuya.db")

	ctx := context.Background()
	geminiSvc, err := service.NewGeminiService(ctx, config.AppConfig.GeminiAPIKey)
	if err != nil {
		log.Fatalf("FATAL: Failed to initialize Gemini service: %v", err)
	}

	chatRepo := repository.NewChatRepository(db)
	chatSvc := service.NewChatService(chatRepo, geminiSvc)

	app := NewApp()
	app.ChatService = chatSvc

	err = wails.Run(&options.App{
		Title:            "Shibuya Shell",
		Width:            1280,
		Height:           720,
		DisableResize:    false,
		Frameless:        true,
		MinWidth:         800,
		MinHeight:        600,
		AssetServer:      &assetserver.Options{Assets: assets},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		OnShutdown:       app.shutdown,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		log.Fatalf("FATAL: Wails application failed to run: %v", err)
	}
}