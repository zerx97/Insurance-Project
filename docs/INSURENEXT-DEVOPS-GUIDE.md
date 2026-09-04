# InsureNext — Your Insurance Project, Explained Simply

This is the same kind of guide as the ShopNest one, but this time **every piece of code actually exists** — it's sitting in this same folder, ready for you to run and push to your own GitHub.

Think of InsureNext like an actual insurance company, but a small one, run entirely by computers talking to each other:

- **auth-service** = the receptionist who checks your ID card before letting you into the building
- **policy-service** = the filing cabinet where every insurance policy lives
- **billing-service** = the accountant who sends you a bill every month
- **claims-service** = the person at the front desk who takes your claim form
- **fraud-detection-service** = the detective who quietly checks if a claim looks suspicious
- **notification-service** = the person who emails you updates
- **frontend** = the actual building/website you walk into

They don't share one giant brain. They're **7 separate small programs**, each doing one job, talking to each other through messages — this is what "microservices" really means, and it's why one service can be written in Java, another in Python, another in JavaScript: each is a separate box with its own job.

---

## Part 1 — What happens when YOU use the app (the simple story)

1. You open the **frontend** website, type your email and a password, click "Register."
2. The frontend sends that to **auth-service**. Auth-service saves your password (scrambled, never stored as plain text) and gives you back a **token** — think of it like a wristband you get at a concert. Every time you want to do anything else, you show this wristband.
3. You click "New Policy." The frontend sends your policy details + your wristband to **policy-service**.
4. Policy-service checks your wristband is real, saves the policy, calculates your monthly premium, and — this is the important bit — **shouts out loud** "Hey, a new policy was just created!" It doesn't call billing-service directly. It just shouts into a room (this room is called **Kafka**), and whoever's listening, listens.
5. **billing-service** was listening in that room. It hears the shout, and creates your first bill automatically. It never had to be told directly — it just reacts.
6. **notification-service** was ALSO listening in that same room. It hears the same shout and sends you a "Your policy is active!" email (well — for now it just prints it, since we didn't hook up real email yet — more on that below).
7. Later, you click "File a Claim." claims-service saves it, and shouts "a claim came in!" into the room.
8. **fraud-detection-service** hears that shout, does some quick maths on your claim (is it a huge amount? is your policy brand new? — new policies with big claims are classic warning signs), and shouts back "here's the score for that claim."
9. claims-service hears that answer and updates your claim's status to APPROVED or UNDER_REVIEW.
10. notification-service hears it too, and emails you the outcome.

Nobody in this story ever waited on hold for anyone else. That's the entire point of using this "shout into a room" pattern (Kafka) instead of everyone calling everyone directly.

---

## Part 2 — Why each language was picked (not random)

| Service | Language | The simple reason |
|---|---|---|
| auth-service | Java | Login/identity is boring and important — it should never be flashy or experimental, just rock-solid. Java has been doing "boring and reliable" for 25+ years. |
| policy-service | Java | A policy either fully exists or it doesn't — no "half a policy." Java + a real relational database (Postgres) is the safest way to guarantee that. |
| billing-service | Java | Same reasoning — money and consistency go together. |
| claims-service | Node.js | Claims involve lots of people submitting things around the same time, often with file attachments later. Node.js is very good at handling "lots of things happening at once, mostly waiting on network/disk," which is exactly this job. |
| notification-service | Node.js | It does nothing heavy — just listens for a message and fires off an email. Node is lightweight and perfect for that. |
| fraud-detection-service | Python | This is the ONE service that's likely to get smarter over time — today it's simple math rules, but this is exactly where a real company would plug in a trained AI model later. Python is the language almost the entire data science/ML world uses. |
| frontend | React + TypeScript | The industry-standard way to build a website that feels like an "app," not a plain old page that reloads every click. |

**You will never need to touch this code yourself** — you said you focus on deployment, not development, and that's exactly what the rest of this guide is for.

---

## Part 3 — Run it on your own laptop (the easiest first step)

You don't need AWS for this part at all. You just need Docker installed.

```bash
cd insurenext
docker-compose up --build
```

This one command:
1. Builds all 7 Docker images (one per service) from the Dockerfiles already written
2. Starts Postgres (with 4 separate databases already created automatically — one per service that needs one)
3. Starts Redis (used by policy-service to remember recently-looked-up policies, instead of asking the database every single time)
4. Starts Kafka (the "shouting room" — in the newest, simplest mode called KRaft, which doesn't need the old-fashioned Zookeeper helper anymore)
5. Starts all 7 services, in the right order, waiting for the database to be ready first

Then open **http://localhost:3000** in your browser. Register an account, create a policy, file a claim, and watch it flow through the whole system for real.

---

## Part 4 — Push it to your own GitHub

```bash
cd insurenext
git init
git add .
git commit -m "Initial commit: InsureNext microservices platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/insurenext.git
git push -u origin main
```

That's it — this repo is already structured the way real companies structure a polyglot microservices repo: **one top-level folder per service, each with its own Dockerfile, its own tests, its own README**, plus shared `infra/` (Terraform, Helm, ArgoCD) and `.github/workflows/` (CI/CD) at the root.

---

## Part 5 — Now the "real AWS production" version, phase by phase

This is the exact same structure and reasoning as the ShopNest guide — the tools are identical, only the business domain changed from e-commerce to insurance.

### Foundation — accounts & identity
Same as ShopNest: **IAM** roles (never long-lived access keys) for every human and service, **AWS Organizations** to keep dev/staging/prod in separate accounts once you're past solo-learner scale.

### Version control
**Git + GitHub** — already done, see Part 4. Branching: short-lived feature branches + pull request review (trunk-based), not old long-lived `develop` branches.

### Build tools — matched to each language, same rule as before
- **Maven** — auth-service, policy-service, billing-service (already set up — try `mvn clean package` inside any of them)
- **npm** — claims-service, notification-service, frontend (already set up — try `npm install && npm test`)
- **pip** — fraud-detection-service (already set up — try `pip install -r requirements-dev.txt && pytest`)

### Containerization
**Docker** — every service already has a working multi-stage Dockerfile (build stage compiles/installs, tiny final stage only has the runtime — this keeps images small and avoids shipping your entire build toolchain into production).
**Docker Compose** — already built (Part 3), and same as before: **for local development only**. It does not scale, does not self-heal, does not get used in production — Kubernetes replaces it entirely once you deploy to AWS.

### Security scanning (already wired into `.github/workflows/ci-cd.yml`)
- **SonarQube (SAST)** — reads the source code for bugs/security smells before it's ever built
- **Snyk / OWASP Dependency-Check** — checks every Maven/npm/pip dependency against known vulnerabilities
- **Trivy (already in the pipeline file)** — scans the *built Docker image* for OS/package vulnerabilities, and the pipeline is written to **fail the build** if anything CRITICAL or HIGH is found — this is what "shift-left security" means in practice, not just a slogan
- **OWASP ZAP (DAST)** — attacks the *running* app in staging, simulating a real hacker, after deploy

### CI/CD (already written: `.github/workflows/ci-cd.yml`)
GitHub Actions was chosen over Jenkins here because the code already lives on GitHub — no separate server to run and patch. The pipeline: build → test → security scan → Docker build → Trivy scan → push to ECR → **update the config repo, not the cluster** (see ArgoCD below).

### ArgoCD (GitOps — already written: `infra/argocd/`)
This is the important one to actually understand, because it's the biggest mental shift from "how a beginner deploys" to "how a real team deploys."

**The beginner way:** your CI/CD pipeline runs `kubectl apply` or `helm upgrade` directly against your live cluster. This means your CI/CD server needs a real, powerful key to your production cluster sitting in GitHub's servers.

**The InsureNext way (what's actually built here):** your CI/CD pipeline's LAST job is just: "go edit one line in a different, small Git repo (the image tag) and commit it." That's all it does. It never touches the cluster. Meanwhile, **ArgoCD** — a program running quietly INSIDE your cluster — is constantly watching that small config repo. The moment it sees a change, it pulls the change in itself and updates the cluster.

Why this matters, in plain words: if a hacker ever breaks into your CI/CD pipeline, in the beginner way, they now have a key to your live production cluster. In the InsureNext way, they don't — because the pipeline was never holding that key in the first place. ArgoCD is the only thing with cluster access, and it only ever pulls, never gets pushed to.

Look at `infra/argocd/apps/auth-service.yaml` vs `infra/argocd/apps/policy-service-prod.yaml` — the second one is missing the `automated:` block on purpose. That's the manual "someone has to click approve" gate for production, done the GitOps way instead of a pipeline approval button.

### Infrastructure as Code (already written: `infra/terraform/`)
- **Terraform** — the VPC, EKS cluster, and RDS database are all defined as code in `infra/terraform/modules/`. Nobody clicks around the AWS Console. Every change goes through a pull request, just like application code.
- **Ansible** — not really needed here, same reasoning as ShopNest: everything runs in containers on EKS, so there's very little "log into a server and install things by hand" left to automate. Skipped on purpose, not by accident.

### AWS Networking (same shapes as ShopNest — see `infra/terraform/modules/vpc/main.tf`, already written)
- **VPC** across **3 Availability Zones** — one data center problem doesn't take down the whole app
- **Public subnets** hold only the load balancer and NAT Gateways; **private subnets** hold your actual services and database — nothing sensitive is ever directly reachable from the internet
- **Internet Gateway** — the public front door
- **NAT Gateway + Elastic IP** — lets your private services reach OUT to the internet (e.g. to pull a security patch) without letting anything reach IN
- **Security Groups** — a bouncer per service ("only the load balancer is allowed to talk to auth-service, nothing else")
- **ALB (Application Load Balancer)** — the receptionist that reads the incoming web address and sends `/api/policies/*` to policy-service, `/api/claims/*` to claims-service, etc.
- **Route 53 + CloudFront + WAF** — your domain name, a global speed-up layer for the React frontend's static files, and a firewall that blocks common attack patterns before they even reach your servers

### Compute (already written: `infra/terraform/modules/eks/main.tf`)
- **EKS** — the real Kubernetes cluster your 7 services actually run inside once deployed
- Regular **EC2 worker nodes** run the steady, predictable Java/Node services
- **fraud-detection-service runs on Fargate** instead — its workload is bursty and unpredictable (claims don't arrive on a steady schedule), and Fargate means you're not paying for idle EC2 capacity waiting around for a burst that might not come for hours

### Storage & Databases
- **RDS PostgreSQL** (already written: `infra/terraform/modules/rds/main.tf`) — one shared instance in this learning setup, with **one separate database per service** (`insurenext_auth`, `insurenext_policy`, `insurenext_billing`, `insurenext_claims`) — this is exactly the "database per service" rule real microservice teams follow: no service can accidentally read or corrupt another service's tables
- **ElastiCache/Redis** — caches policy lookups, same reasoning as ShopNest's product catalog cache: reading from memory is far faster and cheaper than hitting the database on every request
- **S3** — stores Terraform state files, and would store claim-attachment file uploads (photos of damage, etc.) if you extend claims-service later

### Kubernetes internals (once you `helm install` the charts in `infra/helm/`)
- **Deployment** — every one of the 7 services runs as a Deployment (see `infra/helm/insurenext-service/templates/deployment.yaml`)
- **Service** — the stable internal address each Deployment gets, so e.g. claims-service can be reached at a fixed name even as individual pods restart
- **HPA (Horizontal Pod Autoscaler)** — already templated (`hpa.yaml`) — adds more copies of a service automatically when it's under heavy CPU load (e.g. claims-service during a natural disaster, when claim volume spikes hugely)
- **ConfigMaps / Secrets** — environment-specific values (database hostnames, Kafka broker addresses) are injected per-environment through the per-service `values-*.yaml` files, not hardcoded
- **RBAC / Namespaces** — dev/staging/prod get separate namespaces (or separate clusters entirely for prod, for stronger isolation) with different access rules for who can touch what
- **One Helm chart, seven uses** — notice `infra/helm/insurenext-service/` is a SINGLE chart, and `infra/helm/per-service-values/` has 7 different values files. This is the real production pattern: you very rarely write 7 nearly-identical charts — you write one generic chart and vary only what's actually different per service.

### Observability (the part you'd add once this is actually deployed)
- **Prometheus** — every service already exposes a `/metrics` (or `/actuator/prometheus` for the Java ones) endpoint, ready to be scraped
- **Grafana** — dashboards on top of those metrics
- **Loki** — collects logs from all 7 services (chosen over the heavier ELK stack for the same cost reasons as ShopNest)
- **OpenTelemetry + Tempo** — traces a single claim submission across claims-service → Kafka → fraud-detection-service → back to claims-service → notification-service, so you can see exactly where time was spent

---

## Part 6 — What's deliberately simple right now, and how you'd grow it

Being honest about this, the way you asked:

- **JWT uses one shared secret across all 5 backend services** — fine for learning, but the comment inside `policy-service/src/main/java/.../JwtAuthFilter.java` explains the real production upgrade: auth-service signs with a private key, every other service verifies using auth-service's *public* key, so no secret ever needs to be copied around.
- **notification-service prints emails to the console instead of really sending them** — see the comment in `notification-service/src/channels/emailChannel.js`. Swapping in real AWS SES later is a small, isolated change, not a rewrite.
- **fraud-detection-service uses simple math rules, not a trained AI model** — this is honestly how most companies start too. The file `fraud-detection-service/app/scoring.py` is written so a real data scientist could later swap the rules for a trained model without touching any other service.
- **fraud-detection-service doesn't call policy-service to get the real policy start date** — it fakes a number from the policy ID for this demo. In a real system, this would be one more real network call (or a shared read-only view) — flagged clearly in the code comment so you know it's a simplification, not a mistake.

---

## Quick reference — where everything lives in this repo

```
insurenext/
├── auth-service/            (Java - registration, login, JWT)
├── policy-service/          (Java - policy CRUD, Redis cache, Kafka producer)
├── billing-service/         (Java - invoices, Kafka consumer)
├── claims-service/          (Node.js - claim intake, Kafka producer + consumer)
├── notification-service/    (Node.js - Kafka consumer, mock email)
├── fraud-detection-service/ (Python - rule-based fraud scoring, Kafka consumer + producer)
├── frontend/                (React + TypeScript - customer portal)
├── docker-compose.yml       (run everything locally with one command)
├── init-db.sh               (creates the 4 per-service databases automatically)
├── .github/workflows/ci-cd.yml  (build, test, scan, Docker build, Trivy scan, push to ECR)
└── infra/
    ├── terraform/           (VPC, EKS, RDS - as code)
    ├── helm/                (one generic chart + 7 per-service values files)
    └── argocd/               (GitOps: app-of-apps + per-service Application manifests)
```
