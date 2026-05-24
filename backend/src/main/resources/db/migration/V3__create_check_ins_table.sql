CREATE TABLE check_ins (
                            id BINARY(16) PRIMARY KEY,

                            agent_id VARCHAR(100) NOT NULL,

                            external_check_in_id VARCHAR(100),
                            external_event_id VARCHAR(120),

                            type VARCHAR(30) NOT NULL,
                            origin VARCHAR(30) NOT NULL,
                            source VARCHAR(40),

                            latitude DOUBLE NOT NULL,
                            longitude DOUBLE NOT NULL,

                            address VARCHAR(255),
                            accuracy DOUBLE,
                            speed DOUBLE,
                            notes VARCHAR(500),
                            distance_from_previous DOUBLE,

                            occurred_at DATETIME(3) NOT NULL,
                            synced_at DATETIME(3),

                            created_at DATETIME(3) NOT NULL,
                            updated_at DATETIME(3) NOT NULL,

                            CONSTRAINT fk_check_ins_agent
                                FOREIGN KEY (agent_id) REFERENCES agents(id),

                            CONSTRAINT chk_check_ins_latitude
                                CHECK (latitude BETWEEN -90 AND 90),

                            CONSTRAINT chk_check_ins_longitude
                                CHECK (longitude BETWEEN -180 AND 180),

                            CONSTRAINT chk_check_ins_type
                                CHECK (type IN (
                                    'CHECKIN',
                                    'CHECKOUT',
                                    'VISIT_COMPLETED',
                                    'STOP_DETECTED',
                                    'STOP_ENDED',
                                    'SIGNAL_LOST',
                                    'SIGNAL_RESTORED',
                                    'LOW_BATTERY',
                                    'GEOFENCE_ENTER',
                                    'GEOFENCE_EXIT'
                                )),

                            CONSTRAINT chk_check_ins_origin
                                CHECK (origin IN ('LOCAL', 'EXTERNAL_API'))
);

CREATE UNIQUE INDEX idx_check_ins_external_check_in_id
    ON check_ins(external_check_in_id);

CREATE UNIQUE INDEX idx_check_ins_external_event_id
    ON check_ins(external_event_id);

CREATE INDEX idx_check_ins_agent_id
    ON check_ins(agent_id);

CREATE INDEX idx_check_ins_type
    ON check_ins(type);

CREATE INDEX idx_check_ins_origin
    ON check_ins(origin);

CREATE INDEX idx_check_ins_occurred_at
    ON check_ins(occurred_at);

CREATE INDEX idx_check_ins_agent_occurred_at
    ON check_ins(agent_id, occurred_at);
