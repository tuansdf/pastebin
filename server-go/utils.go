package main

import (
	gonanoid "github.com/matoous/go-nanoid/v2"
	"os"
	"strconv"
)

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

func getEnvAsInt(key string, fallback int) int {
	valStr := os.Getenv(key)
	if val, err := strconv.Atoi(valStr); err == nil {
		return val
	}
	return fallback
}

func boundNumber(current int, min int, max int) int {
	if current < min {
		return min
	}
	if current > max {
		return max
	}
	return current
}

func generateId(length int) string {
	result, err := gonanoid.Generate(IdAlphabet, length)
	if err != nil {
		return ""
	}
	return result
}
