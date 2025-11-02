package main

import (
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx 			context.Context
	WindowWidth		int 
	WindowHeight 	int
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	fmt.Printf("App started with size: %d x %d\n", a.WindowWidth, a.WindowHeight)
}

func (a *App) GetWindowSettings() map[string]int {
	return map[string]int{
		"width":  a.WindowWidth,
		"height": a.WindowHeight,
	}
}

func (a *App) SetWindowSettings(width int, height int) {
	a.WindowWidth = width
	a.WindowHeight = height
}