package leonardolucasbs.backend.agent.controller;

import leonardolucasbs.backend.agent.service.AgentService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController("/agent")
@AllArgsConstructor
public class AgentController {
    private final AgentService agentService;

}
