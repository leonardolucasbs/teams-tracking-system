CREATE TABLE geofences (
                           id VARCHAR(100) PRIMARY KEY,

                           external_id VARCHAR(100) NOT NULL UNIQUE,
                           name VARCHAR(150) NOT NULL,
                           type VARCHAR(30) NOT NULL,
                           coordinates_json TEXT NOT NULL,

                           alert_on_enter BOOLEAN NOT NULL,
                           alert_on_exit BOOLEAN NOT NULL,
                           assigned_teams VARCHAR(255),

                           synced_at DATETIME(3) NOT NULL,
                           created_at DATETIME(3) NOT NULL,
                           updated_at DATETIME(3) NOT NULL,

                           CONSTRAINT chk_geofences_type
                               CHECK (type IN ('POLYGON', 'CIRCLE'))
);

CREATE INDEX idx_geofences_external_id
    ON geofences(external_id);

CREATE INDEX idx_geofences_type
    ON geofences(type);

CREATE INDEX idx_geofences_synced_at
    ON geofences(synced_at);
