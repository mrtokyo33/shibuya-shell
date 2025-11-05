package service

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"github.com/mrtokyo33/shibuya-shell/pkg/model"
	"google.golang.org/api/option"
)

const (
    modelName = "gemini-2.0-flash"
)

type GeminiService struct {
	client *genai.Client
}

type geminiStructuredResponse struct {
	Response string   `json:"response"`
	Keywords []string `json:"keywords"`
}

func NewGeminiService(ctx context.Context, apiKey string) (*GeminiService, error) {
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create genai client: %w", err)
	}
	return &GeminiService{client: client}, nil
}

func (g *GeminiService) GenerateResponse(ctx context.Context, history []*model.Message) (string, []string, error) {
	if len(history) == 0 {
		return "", nil, fmt.Errorf("empty chat history")
	}

	model := g.client.GenerativeModel(modelName)
	chatSession := model.StartChat()

	for i := 0; i < len(history)-1; i++ {
		msg := history[i]
		role := "user"
		if msg.Role == "model" {
			role = "model"
		}
		chatSession.History = append(chatSession.History, &genai.Content{
			Parts: []genai.Part{genai.Text(msg.Content)},
			Role:  role,
		})
	}

	lastMessage := history[len(history)-1]
	userPrompt := lastMessage.Content

	systemInstruction := fmt.Sprintf(
		`Você é um assistente de shell. Responda à seguinte solicitação do usuário.
Além da resposta, extraia de 3 a 5 palavras-chave (keyphrases) importantes da sua própria resposta.
Retorne sua saída EXCLUSIVAMENTE como um único objeto JSON válido, sem nenhum outro texto antes ou depois.
Use este schema JSON:
{
  "response": "Sua resposta completa para o usuário aqui.",
  "keywords": ["palavra-chave-1", "palavra-chave-2", "frase-chave-3"]
}
Solicitação do Usuário: "%s"`,
		userPrompt,
	)

	resp, err := chatSession.SendMessage(ctx, genai.Text(systemInstruction))
	if err != nil {
		return "", nil, fmt.Errorf("failed to send message: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", nil, fmt.Errorf("empty or invalid response from Gemini")
	}

	rawPart := resp.Candidates[0].Content.Parts[0]
	rawText, ok := rawPart.(genai.Text)
	if !ok {
		return "", nil, fmt.Errorf("gemini response part is not text")
	}

	jsonString := cleanGeminiJSON(string(rawText))

	var structuredResp geminiStructuredResponse
	if err := json.Unmarshal([]byte(jsonString), &structuredResp); err != nil {
		log.Printf("WARNING: Failed to parse JSON from Gemini. Returning raw response. Error: %v. JSON: %s", err, jsonString)
		return string(rawText), []string{}, nil
	}

	return structuredResp.Response, structuredResp.Keywords, nil
}

func (g *GeminiService) Close() {
	g.client.Close()
}

func cleanGeminiJSON(raw string) string {
	raw = strings.TrimSpace(raw)
	if strings.HasPrefix(raw, "```json") {
		raw = strings.TrimPrefix(raw, "```json")
		raw = strings.TrimSuffix(raw, "```")
	} else if strings.HasPrefix(raw, "```") {
		raw = strings.TrimPrefix(raw, "```")
		raw = strings.TrimSuffix(raw, "```")
	}
	return strings.TrimSpace(raw)
}