# InsureNext

A production-grade, polyglot insurance microservices platform, built as a hands-on
DevOps learning project. Full explanation of *why* every piece exists is in
[`docs/INSURENEXT-DEVOPS-GUIDE.md`](docs/INSURENEXT-DEVOPS-GUIDE.md) — read that first.

## Services

| Service | Language | Port |
|---|---|---|
| auth-service | Java 21 / Spring Boot 3 | 8081 |
| policy-service | Java 21 / Spring Boot 3 | 8082 |
| billing-service | Java 21 / Spring Boot 3 | 8083 |
| claims-service | Node.js / Express | 8084 |
| notification-service | Node.js / Express | 8085 |
| fraud-detection-service | Python / FastAPI | 8086 |
| frontend | React + TypeScript | 3000 |

## Quick start (local)

```bash
docker-compose up --build
```

Then open http://localhost:3000

## Repo layout

- Each service folder is fully independent: own Dockerfile, own tests, own README.
- `infra/terraform/` — AWS infrastructure as code (VPC, EKS, RDS)
- `infra/helm/` — one reusable Helm chart + per-service values files
- `infra/argocd/` — GitOps deployment manifests
- `.github/workflows/ci-cd.yml` — CI/CD pipeline (build, test, security scan, Docker build, Trivy scan, push to ECR)
- `docs/INSURENEXT-DEVOPS-GUIDE.md` — the full walkthrough, explained simply

## Push to your own GitHub

```bash
git init
git add .
git commit -m "Initial commit: InsureNext microservices platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/insurenext.git
git push -u origin main
```
