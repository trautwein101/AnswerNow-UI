AnswerNow UI (Angular)

The project follows a component-based architecture separating UI presentation, routing, and API communication concerns.

---

## Architecture Overview

### Local Development
Angular SPA → .NET API → PostgreSQL (Docker)

### AWS Production Deployment
CloudFront → API Gateway (HTTP API) → Lambda (.NET 8) → RDS PostgreSQL

The AWS environment includes:

- Custom domain (Route53 + ACM)
- CloudWatch alarms
- SNS notifications (email)
- Budget monitoring
- Environment-based configuration (DEV / QA / PROD)

For a full technical breakdown, see:

➡️ **docs/architecture.md**  

➡️ **docs/aws-deployment.md**

---

## Key Features
- Angular v20
- Component-based UI architecture
- Route guards for protected navigation
- HTTP interceptors for JWT handling
- JWT-based authentication (access + refresh token flow)
- Environment-specific configuration
- Reactive programming using RxJS
- Static hosting via S3 + CloudFront
- Cost-conscious cloud deployment decisions