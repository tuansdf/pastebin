package main

import (
	"errors"
	"strconv"
	"time"
)

type Service struct {
	Repository Repository
}

func (s *Service) Create(content string, idSize int, expireMinutes int, password string) (string, error) {
	if AdminCreatePassword != "" && password != AdminCreatePassword {
		return "", errors.New("something went wrong")
	}

	if content == "" {
		return "", errors.New("content is empty")
	}
	if len(content) > MaxContentLength {
		return "", errors.New("content must be less than " + strconv.Itoa(MaxContentLength) + " characters")
	}

	idSize = boundNumber(idSize, MinIdSize, MaxIdSize)
	publicId := generateId(idSize)
	expireMinutes = boundNumber(expireMinutes, MinExpireMinutes, MaxExpireMinutes)
	expiresAt := time.Now().Add(time.Duration(expireMinutes) * time.Minute).UnixMilli()

	v := Vault{
		PublicId:  publicId,
		Content:   content,
		ExpiresAt: expiresAt,
	}
	if err := s.Repository.Create(v); err != nil {
		return "", err
	}
	return publicId, nil
}

func (s *Service) FindTopByPublicId(id string) (*Vault, error) {
	vault, err := s.Repository.FindTopByPublicId(id)
	if err != nil || vault == nil {
		return nil, err
	}
	if vault.ExpiresAt != 0 && vault.ExpiresAt < time.Now().UnixMilli() {
		return nil, nil
	}
	return vault, nil
}

func (s *Service) DeleteExpiredVaults(password string) {
	if AdminDeletePassword == "" || password != AdminDeletePassword {
		return
	}
	s.Repository.DeleteAllExpiresAtBefore(time.Now().UnixMilli())
}

func (s *Service) DeleteTopByPublicId(id string, password string) {
	if AdminDeletePassword == "" || password != AdminDeletePassword {
		return
	}
	s.Repository.DeleteByPublicId(id)
}
