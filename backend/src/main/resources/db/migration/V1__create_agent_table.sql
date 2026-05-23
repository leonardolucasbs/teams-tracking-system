CREATE TABLE agents (
                        id VARCHAR(100) PRIMARY KEY,

                        external_id VARCHAR(100) NOT NULL UNIQUE,

                        name VARCHAR(120) NOT NULL,

                        role VARCHAR(11) NOT NULL,

                        team VARCHAR(80) NOT NULL,

                        phone VARCHAR(14),

                        email VARCHAR(120),

                        active BOOLEAN NOT NULL DEFAULT TRUE,

                        status VARCHAR(7) NOT NULL,

                        source VARCHAR(30) NOT NULL,

                        battery INT NOT NULL,

                        last_seen DATETIME(3),

                        external_created_at DATETIME(3),

                        external_updated_at DATETIME(3),

                        created_at DATETIME(3) NOT NULL,

                        updated_at DATETIME(3) NOT NULL,

                        CONSTRAINT chk_agents_role
                            CHECK (role IN ('INSTALLER', 'TECHNICIAN', 'VENDOR', 'MAINTENANCE')),

                        CONSTRAINT chk_agents_status
                            CHECK (status IN ('ONLINE', 'OFFLINE', 'PAUSED')),

                        CONSTRAINT chk_agents_source
                            CHECK (source IN ('EXTERNAL_API', 'LOCAL')),

                        CONSTRAINT chk_agents_battery
                            CHECK (battery BETWEEN 0 AND 100)
);
