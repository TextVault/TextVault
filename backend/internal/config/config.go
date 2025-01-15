package config

// @CREDITS: https://github.com/GolangLessons/sso/blob/main/internal/config/config.go

import (
	"flag"
	"fmt"
	"os"

	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	Env      string         `yaml:"env" env-default:"local"`
	API      APIConfig      `yaml:"api"`
	Postgres PostgresConfig `yaml:"postgres"`
	S3       S3Config       `yaml:"s3"`
	Auth     AuthConfig     `yaml:"auth"`
}

type AuthConfig struct {
	Issuer   string `yaml:"issuer" env-default:"http://localhost:8080"`
	Audience string `yaml:"audience" env-default:"http://localhost:8080"`
	JWTKey   string `yaml:"jwtKey" env-default:"test-key"`
}

type APIConfig struct {
	Title        string   `yaml:"title" env-default:"TextVault API"`
	Description  string   `yaml:"description" env-default:"TextVault API"`
	Version      string   `yaml:"version" env-default:"1.0.0"`
	DocsClientID string   `yaml:"docsClientId" env-default:"TEST"`
	CORSAllowed  []string `yaml:"corsAllowed" env-default:"[]"`
}

type PostgresConfig struct {
	Host     string `yaml:"host"`
	Port     string `yaml:"port"`
	User     string `yaml:"user"`
	Password string `yaml:"password"`
	Database string `yaml:"database"`
}

func (cfg PostgresConfig) DSN() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.Database)
}

type Credentials struct {
	AccessKeyID     string `yaml:"accessKeyId"`
	SecretAccessKey string `yaml:"secretAccessKey"`
}

type S3Config struct {
	URL         string      `yaml:"url"`
	BucketName  string      `yaml:"bucketName" env-default:"textvault"`
	PathPrefix  string      `yaml:"pathPrefix" env-default:"textvault"`
	Credentials Credentials `yaml:"credentials"`
	Region      string      `yaml:"region"`
}

func MustLoad() *Config {
	configPath := fetchConfigPath()
	if configPath == "" {
		panic("config path is empty")
	}

	return MustLoadPath(configPath)
}

func MustLoadPath(configPath string) *Config {
	// check if file exists
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		panic("config file does not exist: " + configPath)
	}

	var cfg Config

	if err := cleanenv.ReadConfig(configPath, &cfg); err != nil {
		panic("cannot read config: " + err.Error())
	}

	return &cfg
}

func fetchConfigPath() string {
	var res string

	flag.StringVar(&res, "config", "", "path to config file")
	flag.Parse()

	if res == "" {
		res = os.Getenv("CONFIG_PATH")
	}

	return res
}
