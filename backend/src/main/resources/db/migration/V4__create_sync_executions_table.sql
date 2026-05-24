CREATE TABLE sync_executions (
                                 id BINARY(16) PRIMARY KEY,

                                 sync_type VARCHAR(30) NOT NULL,
                                 status VARCHAR(30) NOT NULL,

                                 started_at DATETIME(3) NOT NULL,
                                 finished_at DATETIME(3),
                                 duration_ms BIGINT,
                                 items_processed INT NOT NULL DEFAULT 0,

                                 sync_token VARCHAR(255),
                                 error_message VARCHAR(1000),

                                 created_at DATETIME(3) NOT NULL,
                                 updated_at DATETIME(3) NOT NULL,

                                 CONSTRAINT chk_sync_executions_type
                                     CHECK (sync_type IN ('AGENTS', 'LOCATIONS', 'CHECK_INS', 'GEOFENCES', 'ALL')),

                                 CONSTRAINT chk_sync_executions_status
                                     CHECK (status IN ('RUNNING', 'SUCCESS', 'FAILED', 'PARTIAL'))
);

CREATE INDEX idx_sync_executions_sync_type
    ON sync_executions(sync_type);

CREATE INDEX idx_sync_executions_status
    ON sync_executions(status);

CREATE INDEX idx_sync_executions_started_at
    ON sync_executions(started_at);

CREATE INDEX idx_sync_executions_finished_at
    ON sync_executions(finished_at);

CREATE INDEX idx_sync_executions_type_started_at
    ON sync_executions(sync_type, started_at);

CREATE INDEX idx_sync_executions_type_status
    ON sync_executions(sync_type, status);
