package main

var (
	EnvIdAlphabet       = "123456789abcdefghjkmnpqrstuvwxyz"
	EnvMinIdSize        = getEnvAsInt("MIN_ID_SIZE", 8)
	EnvMaxIdSize        = getEnvAsInt("MAX_ID_SIZE", 64)
	EnvMinExpireMinutes = getEnvAsInt("MIN_EXPIRE_MINUTES", 1)
	EnvMaxExpireMinutes = getEnvAsInt("MAX_EXPIRE_MINUTES", 525600)
	EnvApiKeyCreate     = getEnv("API_KEY_CREATE", "")
	EnvApiKeyDelete     = getEnv("API_KEY_DELETE", "")
	EnvMaxContentLength = getEnvAsInt("MAX_CONTENT_LENGTH", 100000)
	EnvDbUrl            = getEnv("DB_URL", "")
	EnvPort             = getEnv("PORT", "5000")
)
