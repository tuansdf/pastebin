package main

var (
	IdAlphabet       = "123456789abcdefghjkmnpqrstuvwxyz"
	MinIdSize        = getEnvAsInt("MIN_ID_SIZE", 8)
	MaxIdSize        = getEnvAsInt("MAX_ID_SIZE", 64)
	MinExpireMinutes = getEnvAsInt("MIN_EXPIRE_MINUTES", 1)
	MaxExpireMinutes = getEnvAsInt("MAX_EXPIRE_MINUTES", 525600)
	SuperPassword    = getEnv("SUPER_PASSWORD", "")
	MaxContentLength = getEnvAsInt("MAX_CONTENT_LENGTH", 100000)
	DbUrl            = getEnv("DB_URL", "")
	Port             = getEnv("PORT", "5000")
)
