# TestOS — Enterprise AI-Powered Test Management Platform

![CI/CD](https://github.com/Iskanderqasem/Test-Management-Platform/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)

An enterprise-grade, AI-powered Test Management Platform that assists QA/Test Teams throughout the entire Software Testing Life Cycle (STLC). The AI behaves as an experienced Senior Test Manager.

---

## Features

### Core Modules
- **Project Management** — Projects, Releases, Sprints, CRs, UAT, PVT, Environment Management
- **Requirements Management** — Import from PDF, Word, Excel, PPT, Images, URLs, Confluence, SharePoint
- **AI Requirement Gap Analysis** — Identify missing requirements, conflicts, security/performance risks
- **AI Test Strategy Generator** — Complete enterprise test strategy with all sections
- **AI Test Plan Generator** — Detailed test plans with schedules, resources, milestones
- **AI Test Case Generator** — Positive, Negative, Boundary, Security, Performance, UAT, PVT test cases
- **Requirements Traceability Matrix (RTM)** — Full traceability from requirements to results
- **AI Test Execution** — Manual and automated execution with evidence capture
- **AI Defect Management** — Root cause analysis, log analysis, ADO/Jira export
- **AI Log Analysis** — PCAP, NetScout, SAS, application, server, database log analysis
- **Regression Impact Analysis** — AI-powered regression scope determination
- **Knowledge Management** — AI search across Confluence, SharePoint, previous test plans
- **Environment Health Monitor** — Real-time monitoring of all test environments
- **AI Reporting** — Daily, weekly, release, execution, defect, coverage reports
- **AI Email Generator** — Professional completion emails with statistics
- **AI Assistant** — Conversational AI Test Manager for any testing question

### Integrations
- Azure DevOps, Jira, ServiceNow
- Confluence, SharePoint, GitHub, GitLab
- Microsoft Teams, Outlook
- REST APIs, Swagger/OpenAPI, Postman

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, React Query, Zustand, Recharts |
| Backend | Node.js, NestJS, TypeScript, TypeORM |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| AI | OpenAI GPT-4o, RAG |
| Auth | JWT, Azure AD SSO, OAuth2 |
| Cloud | AWS (S3, ECS, RDS) |
| Containers | Docker, Kubernetes |
| CI/CD | GitHub Actions |
| Monitoring | Grafana, Prometheus |

---

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- OpenAI API Key

### 1. Clone the repository
```bash
git clone https://github.com/Iskanderqasem/Test-Management-Platform.git
cd Test-Management-Platform
```

### 2. Configure environment
```bash
# Backend
cp apps/backend/.env.example apps/backend/.env
# Edit .env and set OPENAI_API_KEY, DATABASE_URL, JWT_SECRET

# Frontend
cp apps/frontend/.env.local.example apps/frontend/.env.local
# Edit and set NEXT_PUBLIC_API_URL
```

### 3. Start with Docker Compose
```bash
# Set required env vars
export OPENAI_API_KEY=your-key-here
export JWT_SECRET=your-super-secret-key

# Start all services
docker-compose up -d
```

### 4. Access the platform
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api/docs

---

## Development Setup

```bash
# Install all dependencies
npm install

# Start PostgreSQL and Redis
docker-compose up postgres redis -d

# Start backend
npm run dev:backend

# Start frontend (new terminal)
npm run dev:frontend
```

---

## Project Structure

```
test-management-platform/
├── apps/
│   ├── frontend/               # Next.js 14 App Router
│   │   ├── src/
│   │   │   ├── app/            # Pages (App Router)
│   │   │   │   ├── page.tsx           # Dashboard
│   │   │   │   ├── projects/          # Project management
│   │   │   │   ├── requirements/      # Requirements + RTM + Gap Analysis
│   │   │   │   ├── test-planning/     # Strategy + Plans
│   │   │   │   ├── test-cases/        # Test cases + AI generator
│   │   │   │   ├── test-execution/    # Execution runner
│   │   │   │   ├── defects/           # Defect management
│   │   │   │   ├── ai-assistant/      # AI chat interface
│   │   │   │   ├── reports/           # Reports hub
│   │   │   │   ├── knowledge-base/    # KB + AI search
│   │   │   │   └── environments/      # Environment monitor
│   │   │   ├── components/
│   │   │   │   ├── layout/     # Sidebar, TopNav
│   │   │   │   ├── ai/         # AI components
│   │   │   │   ├── charts/     # Dashboard charts
│   │   │   │   └── ui/         # UI component library
│   │   │   ├── lib/            # API client, store, utils
│   │   │   └── types/          # TypeScript types
│   │   └── Dockerfile
│   │
│   └── backend/                # NestJS API
│       ├── src/
│       │   ├── modules/
│       │   │   ├── ai/         # OpenAI integration (all AI features)
│       │   │   ├── auth/       # JWT, SSO, RBAC
│       │   │   ├── projects/   # Project CRUD
│       │   │   ├── requirements/  # Requirements + gap analysis
│       │   │   ├── test-cases/ # Test case management
│       │   │   ├── defects/    # Defect management + ADO/Jira export
│       │   │   ├── users/      # User management
│       │   │   └── reports/    # Report generation
│       │   ├── config/         # Database, Redis, JWT config
│       │   └── common/         # Guards, interceptors, filters
│       └── Dockerfile
│
├── packages/
│   └── shared/                 # Shared TypeScript types
│
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI/CD
│
├── docker-compose.yml
└── README.md
```

---

## API Documentation

Full Swagger documentation available at `/api/docs` when running the backend.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | Authenticate user |
| GET | /projects | List all projects |
| POST | /ai/test-strategy | Generate Test Strategy |
| POST | /ai/test-cases | Generate Test Cases |
| POST | /ai/gap-analysis | Run Requirement Gap Analysis |
| POST | /ai/root-cause | AI Defect Root Cause Analysis |
| POST | /ai/analyze-logs | Analyze PCAP/SAS/application logs |
| POST | /ai/generate-email | Generate test completion email |
| POST | /ai/chat | Chat with AI Test Manager |
| GET | /defects | List defects |
| POST | /defects/:id/export-ado | Export defect to Azure DevOps |

---

## Security

- JWT authentication with configurable expiry
- Azure AD SSO integration
- Role-Based Access Control (RBAC): Admin, Test Manager, Test Lead, Test Engineer, Read-Only
- All secrets managed via environment variables
- HTTPS enforced in production
- Audit logging for all critical actions

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with AI assistance by Claude Code · Anthropic
