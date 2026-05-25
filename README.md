# teams-tracking-system
 

Sistema fullstack para acompanhamento de equipes externas em campo.

O projeto permite gerenciar agentes, sincronizar posições, registrar check-ins, consultar a rota do dia, visualizar áreas operacionais, acompanhar o histórico de sincronizações e consumir uma API externa de mídia/localização somente pelo backend.

## Funcionalidades

- Gestão de agentes de campo.
- Rastreamento e histórico de localizações.
- Histórico da rota do dia com cálculo de distância por Haversine.
- Registro manual e sincronização de check-ins.
- Áreas operacionais com visualização de coordenadas em mapa.
- Sincronizações automáticas por schedulers independentes.
- Histórico e monitoramento de sincronizações.
- Integração com API externa usando `WebClient`.
- Frontend em Next.js com App Router.

## Tecnologias

### Backend

- Java 21
- Spring Boot 3
- Spring Data JPA
- MySQL
- Flyway
- WebClient
- Docker

### Frontend

- Next.js 16
- App Router
- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod
- shadcn/ui
- Leaflet e React Leaflet

### Infraestrutura

- Docker
- Docker Compose
- MySQL 8

## Estrutura do projeto

```txt
teams-tracking-system/
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
└── README.md
```

- `backend/`: API Spring Boot, serviços de sincronização, schedulers, regras de negócio e persistência.
- `frontend/`: interface operacional em Next.js.
- `docs/`: decisões técnicas do projeto.
- `docker-compose.yml`: sobe MySQL, backend e frontend.

## Variáveis de ambiente

O projeto usa variáveis de ambiente. como a chave da API externa, não devem ser versionados.

Para executar com Docker, o arquivo `.env` deve ficar na raiz do projeto, no mesmo nível do `docker-compose.yml`.

Crie o arquivo `.env` a partir do exemplo da raiz:

```bash
cp .env.example .env
```

Não é necessário criar `.env` dentro de `backend/` ou `frontend/` para o fluxo com Docker Compose. O `docker-compose.yml` lê o `.env` da raiz e repassa as variáveis para cada serviço.

Principais variáveis:

```env
MYSQL_DATABASE=teams_tracking_system_db
MYSQL_USER=teams_user
MYSQL_PASSWORD=teams_password
MYSQL_ROOT_PASSWORD=root_password

SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/teams_tracking_system_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=teams_user
SPRING_DATASOURCE_PASSWORD=teams_password

MEDIA_API_BASE_URL=https://desafio-media.onrender.com
MEDIA_API_KEY=your_api_key_here

NEXT_PUBLIC_API_URL=http://localhost:8080
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Executando com Docker

1. Clone o repositório.

2. Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Preencha as variáveis obrigatórias no `.env`, principalmente:

```env
MEDIA_API_KEY=your_api_key_here
```

4. Suba todos os serviços:

```bash
docker compose up --build
```

5. Acesse:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- MySQL: `localhost:3306`
- Swagger da API: http://localhost:8080/swagger-ui/index.html

6. Para acompanhar logs:

```bash
docker compose logs -f
```

7. Para parar os containers:

```bash
docker compose down
```

8. Para parar e remover volumes:

```bash
docker compose down -v
```

## Serviços Docker

- `mysql`: banco de dados MySQL 8 usado pelo backend.
- `backend`: API Spring Boot publicada na porta `8080`.
- `frontend`: aplicação Next.js publicada na porta `3000`.

O MySQL persiste dados em um volume Docker chamado `mysql_data`. O backend se conecta ao banco usando o nome do serviço `mysql` dentro da rede Docker. As migrations do Flyway são executadas automaticamente na inicialização do backend. O frontend usa `NEXT_PUBLIC_API_URL` para chamar a API interna do backend.

## Documentação Swagger

A API backend possui documentação Swagger gerada pelo Springdoc.

Com o backend rodando, acesse:

- Swagger UI: http://localhost:8080/swagger-ui/index.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Endpoints úteis

### Agentes

- `GET /api/agents`
- `POST /api/agents`
- `GET /api/agents/{id}`
- `PUT /api/agents/{id}`
- `PATCH /api/agents/{id}/activate`
- `PATCH /api/agents/{id}/deactivate`
- `DELETE /api/agents/{id}`

### Localizações

- `POST /api/location/sync`
- `GET /api/location/{id}`
- `GET /api/location/agents/{agentId}`
- `GET /api/location/agents/{agentId}/today-route`

### Rotas

- `GET /api/routes/agents/{agentId}/today`

### Check-ins

- `GET /api/check-ins`
- `POST /api/check-ins`
- `GET /api/check-ins/{id}`
- `GET /api/check-ins/agents/{agentId}`
- `GET /api/check-ins/agents/{agentId}/today`
- `DELETE /api/check-ins/{id}`
- `POST /api/check-ins/sync`

### Sincronizações

- `GET /api/sync/summary`
- `GET /api/sync/executions`
- `GET /api/sync/executions/type/{syncType}`
- `GET /api/sync/executions/latest/{syncType}`

### Áreas operacionais

- `GET /api/geofences`
- `GET /api/geofences/{id}`
- `GET /api/geofences/type/{type}`
- `POST /api/geofences/sync`

## Decisões técnicas

As decisões técnicas completas estão em [docs/decisoesTecnicas.md](docs/decisoesTecnicas.md).

Principais decisões:

- A API externa é consumida somente pelo backend.
- `WebClient` foi usado no lugar de `RestTemplate`.
- Agentes usam ID textual porque a API externa retorna identificadores em `String`.
- Localizações são persistidas localmente para formar histórico e rota do dia.
- A distância da rota é calculada com Haversine.
- Check-ins usam UUID interno e armazenam IDs externos separadamente.
- `SyncExecution` registra histórico de sincronizações e `syncToken`.
- Schedulers são independentes por tipo de sincronização.
- O frontend oculta IDs técnicos e usa nomes de agentes na interface.

## Execução local sem Docker

Também é possível executar os serviços localmente, desde que exista um MySQL acessível e as variáveis de ambiente estejam configuradas.

Backend:

```bash
cd backend
./gradlew bootRun
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Observações

- A chave da API externa deve ser configurada por variável de ambiente.
- O frontend nunca chama a API externa diretamente.
- O backend é responsável por sincronização, persistência, regras de negócio e tratamento de erros.
- Em Docker, o backend usa o serviço `mysql`; fora do Docker, ajuste `SPRING_DATASOURCE_URL` para o endereço do banco local.
