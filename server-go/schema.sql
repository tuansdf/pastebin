CREATE TABLE vault
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    public_id  TEXT(64),
    content    TEXT(100000),
    expires_at INTEGER
)
