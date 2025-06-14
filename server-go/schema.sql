CREATE TABLE vault
(
    id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    public_id  TEXT,
    content    TEXT,
    expires_at BIGINT
);
