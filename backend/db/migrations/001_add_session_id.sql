-- Scopes chat history to anonymous browser sessions.
-- Messages saved before this migration get an empty session_id, so no visitor sees them.
ALTER TABLE conversations
  ADD COLUMN session_id CHAR(36) NOT NULL DEFAULT '' AFTER id;

ALTER TABLE conversations
  ADD INDEX idx_conversations_session_id (session_id, id);
