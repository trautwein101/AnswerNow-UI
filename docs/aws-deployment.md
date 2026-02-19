# UI Deployment (Frontend)

AnswerNow UI is deployed as a static site using:

- Amazon S3 (static hosting origin)
- Amazon CloudFront (CDN + HTTPS)
- Route53 (DNS)
- ACM (SSL certificate)
- CloudFormation via AWS CLI (infrastructure provisioning)

This document captures the deployment workflow used for DEV/QA/PROD environments.

---

# Prerequisites

- AWS CLI installed
- AWS credentials configured
- Route53 hosted zone
- ACM certificate (must be created in us-east-1 for CloudFront)
- Region set appropriately for stack deployment

---

## Verifaction Tools:

# Verify AWS CLI:
aws --version

# Verify Credentials:
-> aws sts get-caller-identity

# Build Angular Application:
-> npm install
-> ng build --configuration production

---

## CloudFormation via AWS CLI (DEV)

aws cloudformation deploy \
  --template-file frontend-prod.yaml \
  --stack-name answernow-frontend-prod \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-west-2 \
  --parameter-overrides DomainName=example.com HostedZoneId=XXXXXXXX

---

## Frontend Stack Provisions:
- S3 bucket (static hosting origin)
- CloudFront distribution
- Route53 alias record
- ACM certificate reference

---

## Deployment Notes
- Angular environment files control the API base URL (DEV / QA / PROD).
- HTTPS is terminated at CloudFront using ACM.
- S3 is used as a private origin behind CloudFront.
- Static assets are cached globally via CloudFront.
- Environment separation is handled via separate CloudFormation stacks.
