ALTER TABLE agents
    MODIFY status VARCHAR(30) NOT NULL;

ALTER TABLE agents
    DROP CHECK chk_agents_status;

ALTER TABLE agents
    ADD CONSTRAINT chk_agents_status
        CHECK (status IN ('ONLINE', 'OFFLINE', 'PAUSED', 'SIGNAL_LOST'));

ALTER TABLE agent_locations
    DROP CHECK chk_agent_locations_status;

ALTER TABLE agent_locations
    ADD CONSTRAINT chk_agent_locations_status
        CHECK (status IN ('ONLINE', 'OFFLINE', 'PAUSED', 'SIGNAL_LOST'));
