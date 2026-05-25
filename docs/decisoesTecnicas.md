# Decisões técnicas

## Agentes

### Identificação com `String`

A entidade `Agent` utiliza `String` como tipo do identificador principal porque a API externa retorna IDs em formato textual, como `seed_agent_001`.

Essa decisão evita conversões desnecessárias para tipos numéricos e preserva o formato original dos dados recebidos da integração externa.

### Uso do `id` externo como chave principal

O campo `id` vindo da API externa foi adotado como chave principal do agente no banco local.

Como esse identificador já representa o agente na origem externa, não foi necessário criar um ID numérico interno apenas para a aplicação. Isso simplifica a sincronização e facilita a rastreabilidade entre o dado local e o dado externo.

### `externalId` como identificador complementar

Além do `id`, a API externa também retorna o campo `externalId`.

Esse campo foi mantido como identificador complementar e único, servindo como uma camada adicional de validação para detectar inconsistências ou conflitos entre registros sincronizados.

### Idempotência e conflitos

A sincronização de agentes foi pensada para evitar duplicidade.

Durante a sincronização, o sistema verifica se o agente já existe pelo `id`. Se existir, o registro é atualizado. Se não existir, o sistema verifica se já existe outro agente com o mesmo `externalId`.

Essa regra evita que execuções repetidas do scheduler criem registros duplicados e também impede que um mesmo `externalId` fique associado a agentes diferentes.

### Origem `LOCAL` / `EXTERNAL_API`

Foi adicionada uma identificação de origem para diferenciar agentes criados manualmente de agentes sincronizados pela API externa.

Os agentes criados pelo CRUD local recebem origem `LOCAL`, enquanto os agentes vindos da API externa recebem origem `EXTERNAL_API`.

Essa decisão permite aplicar regras diferentes dependendo da origem do registro.

### Agentes locais não sobrescritos

Agentes criados localmente não devem ser sobrescritos automaticamente pela sincronização externa.

Essa regra protege alterações feitas manualmente no sistema e evita que dados externos substituam informações administrativas cadastradas pelo usuário.

### `battery` e `status` como dados operacionais

Os campos `battery` e `status` representam informações operacionais do agente em campo.

Por isso, esses dados não devem ser alterados em atualizações cadastrais manuais, como mudança de nome, telefone ou equipe. Eles continuam sendo atualizados por sincronizações externas, pois refletem o estado operacional mais recente do agente.

---

## Localizações e rotas

### Persistência local de localizações

As localizações dos agentes são salvas no banco local em vez de serem apenas consultadas diretamente da API externa.

Essa decisão permite manter histórico de movimentação, montar rotas do dia, calcular distância percorrida e reduzir a dependência da API externa em tempo real.

### ID idempotente para localização

A API externa não retorna um identificador único para cada localização.

Por isso, o sistema gera um ID interno baseado em dados da posição, como agente, horário de captura e coordenadas.

Essa estratégia evita duplicidade quando a mesma localização é recebida mais de uma vez durante execuções próximas da sincronização.

### Uso de `lastSeen` como referência operacional

O campo `lastSeen` é usado como referência temporal da localização dentro do sistema.

Ele permite ordenar os pontos de localização e montar a rota do dia de forma cronológica.

Essa decisão garante que a rota seja construída a partir da sequência operacional das posições capturadas.

### Descarte de GPS com `accuracy > 50`

Localizações com precisão maior que `50` metros são descartadas antes da persistência.

Essa regra segue o comportamento descrito pela API externa e evita que pontos muito imprecisos prejudiquem o histórico de rotas e o cálculo de distância.

### Rota do dia baseada em dados locais

A rota do dia é calculada a partir das localizações já persistidas no banco local.

Essa decisão evita depender da API externa no momento da consulta e valoriza o histórico sincronizado pela própria aplicação.

### Cálculo com Haversine

A distância percorrida é calculada com a fórmula de Haversine, que considera latitude e longitude para calcular a distância entre dois pontos geográficos.

A lógica foi isolada em uma classe própria para evitar acoplamento com controllers ou services e permitir reutilização futura.

### Não criação de tabela de rotas

Não foi criada uma tabela específica para rotas.

A rota é calculada dinamicamente a partir dos registros existentes em `agent_locations`. Essa decisão evita duplicação de dados e mantém a modelagem mais simples.

---

## Check-ins

### Check-ins manuais e externos

Os check-ins representam eventos operacionais vinculados aos agentes.

Eles podem ser criados manualmente pela aplicação ou sincronizados a partir da API externa. Essa modelagem atende ao requisito de registro manual sem descartar eventos externos importantes.

### UUID como ID interno

O `CheckIn` utiliza `UUID` como identificador interno, pois check-ins manuais são registros criados pela própria aplicação.

Essa decisão separa o controle interno do sistema dos identificadores recebidos pela API externa.

### Separação entre `externalCheckInId` e `externalEventId`

Os identificadores externos são armazenados em campos separados.

O `externalCheckInId` representa o ID do check-in retornado pela API externa, enquanto `externalEventId` representa o identificador do evento externo relacionado.

Essa separação ajuda na idempotência e na detecção de conflitos durante a sincronização.

### Origem local/externa

Os check-ins possuem origem para diferenciar registros criados localmente de registros sincronizados.

A origem `LOCAL` representa check-ins manuais. A origem `EXTERNAL_API` representa check-ins recebidos da integração externa.

Essa decisão facilita auditoria, filtros e regras específicas de sincronização.

### Precedência de check-ins manuais

Check-ins manuais têm prioridade sobre dados externos equivalentes.

Isso evita que uma sincronização externa sobrescreva um registro operacional criado diretamente pelo usuário.

### Idempotência e conflitos

A sincronização de check-ins verifica identificadores externos antes de criar novos registros.

Se o `externalCheckInId` já existir, o sistema atualiza ou ignora o registro. Se o `externalEventId` já existir associado a outro check-in, o caso é tratado como conflito.

Essa regra evita duplicidade e preserva a consistência dos eventos operacionais.

---

## Geofences

### Domínio próprio

Geofences foram modeladas como um domínio próprio porque representam áreas operacionais no mapa, e não localizações de agentes.

Uma geofence define uma região, como círculo ou polígono, que pode ser usada para identificar entrada, saída ou permanência de agentes em uma área.

### Upsert por `externalId`

A sincronização de geofences usa `externalId` como chave principal de upsert.

Se uma geofence com o mesmo `externalId` já existir, ela é atualizada. Caso contrário, uma nova geofence é criada.

Essa decisão segue o contrato da API externa e evita duplicidade.

### Validação de conflitos entre `id` e `externalId`

Como a API externa retorna tanto `id` quanto `externalId`, o sistema valida se esses identificadores não estão associados a registros diferentes.

Essa regra impede que uma geofence existente seja sobrescrita incorretamente por outra com identificadores conflitantes.

### Scheduler independente

Geofences possuem um scheduler próprio de sincronização.

Essa decisão contribui para cumprir o requisito dos quatro schedulers obrigatórios e mantém a sincronização de geofences separada dos demais fluxos.

### Integração com `SyncExecution`

As execuções de sincronização de geofences são registradas em `SyncExecution`.

Isso permite monitorar sucesso, falha, duração e quantidade de itens processados no mesmo painel usado para agentes, localizações e check-ins.

---

## Sincronizações

### Histórico persistido em `SyncExecution`

Foi criada a entidade `SyncExecution` para registrar cada execução de sincronização.

Ela armazena informações como tipo da sincronização, status, horário de início e fim, duração, quantidade de itens processados, erro e `syncToken`.

Essa decisão atende ao requisito de persistir histórico de sincronização.

### Status e tipos de sincronização

Os tipos e status foram representados como enums para padronizar os registros.

Tipos como `AGENTS`, `LOCATIONS`, `CHECK_INS`, `GEOFENCES` e `ALL` permitem filtrar o histórico por fluxo.

Status como `RUNNING`, `SUCCESS`, `FAILED` e `PARTIAL` permitem entender o resultado de cada execução.

### `syncToken` para check-ins

O `syncToken` é armazenado principalmente para a sincronização incremental de check-ins.

A API externa usa esse token para identificar a última execução bem-sucedida e retornar apenas eventos novos nas próximas sincronizações.

### Falhas persistidas mesmo em rollback

As atualizações de `SyncExecution` usam controle transacional próprio.

Essa decisão garante que falhas sejam registradas mesmo quando a transação principal da sincronização falha e sofre rollback.

### Endpoints internos para monitoramento

Foram criados endpoints internos para consultar histórico e resumo das sincronizações.

Esses endpoints servem como base para o painel de monitoramento no frontend, permitindo visualizar status, erros, duração e itens processados.

---

## Compatibilidade com API externa

### Enums compatíveis com OpenAPI

Os enums internos foram ajustados para refletir os valores documentados pela API externa.

Isso reduz risco de erro de desserialização e mantém o domínio alinhado ao contrato externo.

### `source` de check-ins como `String`

O campo `source` dos check-ins foi mantido como `String`.

Essa decisão evita falhas caso a API externa passe a retornar novos valores não previstos inicialmente.

### Fallback de check-ins

A sincronização de check-ins tenta usar o fluxo incremental com `syncToken`.

Quando esse fluxo apresenta instabilidade, o sistema pode usar o endpoint de consulta como fallback e registrar a execução como parcial.

Essa decisão mantém a sincronização funcional sem esconder que parte do fluxo principal falhou.

### Retry para `429` e `503`

A integração com a API externa trata falhas temporárias.

Para `429`, o sistema respeita o `Retry-After` quando disponível. Para `503` e erros transitórios, aplica retry com backoff limitado.

Essa decisão evita retentativas agressivas e melhora a estabilidade da integração.

### Paginação conforme documentação externa

O backend não inventa parâmetros de paginação que não estejam documentados na OpenAPI.

Quando a documentação informa que um endpoint de sincronização já trata paginação internamente, o sistema respeita esse contrato e evita duplicar comportamento de forma indevida.

---

## Frontend

### IDs técnicos ocultos na interface

A interface não exibe identificadores técnicos como `id`, `externalId`, `agentId` ou IDs de sincronização.

Esses campos continuam existindo nos contratos e tipos, mas não são mostrados ao usuário final porque têm pouco valor operacional na interface.

### Busca de agentes por nome

Nas telas de localizações, rotas e check-ins, a busca por agente é feita pelo nome.

O frontend usa o ID internamente apenas depois que o usuário seleciona o agente.

Essa decisão melhora a usabilidade sem alterar os contratos do backend.

### Contratos preservam identificadores

Mesmo ocultando IDs na interface, os identificadores continuam preservados nas respostas da API e nos tipos TypeScript.

Isso mantém compatibilidade com backend, rotas internas, mutações, auditoria e sincronização.

### Mapa com Leaflet carregado no cliente

A visualização de áreas operacionais usa Leaflet no frontend.

Como o Leaflet depende de APIs do navegador, ele é carregado apenas no cliente para evitar problemas com SSR no Next.js.

Essa decisão permite exibir geofences no mapa sem expor a API externa ao navegador.
