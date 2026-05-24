CREATE TABLE agent_locations (
                                 id VARCHAR(180) PRIMARY KEY,

                                 agent_id VARCHAR(100) NOT NULL,
                                 external_id VARCHAR(100) NOT NULL,
                                 agent_name VARCHAR(120) NOT NULL,

                                 latitude DOUBLE NOT NULL,
                                 longitude DOUBLE NOT NULL,

                                 current_address VARCHAR(255),

                                 accuracy DOUBLE,
                                 speed DOUBLE,
                                 battery INT,

                                 status VARCHAR(30) NOT NULL,

                                 last_seen DATETIME(3) NOT NULL,

                                 created_at DATETIME(3) NOT NULL,
                                 updated_at DATETIME(3) NOT NULL,

                                 CONSTRAINT fk_agent_locations_agent
                                     FOREIGN KEY (agent_id) REFERENCES agents(id),

                                 CONSTRAINT chk_agent_locations_status
                                     CHECK (status IN ('ONLINE', 'OFFLINE', 'PAUSED')),

                                 CONSTRAINT chk_agent_locations_battery
                                     CHECK (battery IS NULL OR battery BETWEEN 0 AND 100)
);

CREATE INDEX idx_agent_locations_agent_id
    ON agent_locations(agent_id);

CREATE INDEX idx_agent_locations_external_id
    ON agent_locations(external_id);

CREATE INDEX idx_agent_locations_status
    ON agent_locations(status);

CREATE INDEX idx_agent_locations_last_seen
    ON agent_locations(last_seen);

CREATE INDEX idx_agent_locations_agent_last_seen
    ON agent_locations(agent_id, last_seen);
