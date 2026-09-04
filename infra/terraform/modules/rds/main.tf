variable "identifier_prefix" { type = string }
variable "vpc_id" { type = string }
variable "private_subnets" { type = list(string) }
variable "multi_az" { type = bool }

resource "aws_db_subnet_group" "this" {
  name       = "${var.identifier_prefix}-db-subnets"
  subnet_ids = var.private_subnets
}

resource "aws_security_group" "rds" {
  name        = "${var.identifier_prefix}-rds-sg"
  description = "Allow Postgres traffic only from inside the VPC (EKS nodes), never from the internet"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"] # VPC CIDR only - not 0.0.0.0/0, this is a private-subnet-only database
  }
}

# Real production secret management: the master password below is a placeholder default.
# In practice this is generated once and stored in AWS Secrets Manager with automatic
# rotation enabled - never hardcoded in a .tfvars file that ends up in Git.
resource "aws_db_instance" "policy_billing" {
  identifier             = "${var.identifier_prefix}-postgres"
  engine                 = "postgres"
  engine_version         = "16.3"
  instance_class         = var.multi_az ? "db.t3.medium" : "db.t3.micro"
  allocated_storage      = 20
  storage_encrypted      = true # backed by a KMS key - encryption at rest, non-negotiable for an insurance app
  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  multi_az               = var.multi_az
  username               = "insurenext"
  manage_master_user_password = true # Terraform + RDS create and manage the secret in Secrets Manager for you
  backup_retention_period = var.multi_az ? 7 : 1
  deletion_protection     = var.multi_az
  skip_final_snapshot     = !var.multi_az
}

output "endpoint" { value = aws_db_instance.policy_billing.endpoint }
output "secret_arn" { value = aws_db_instance.policy_billing.master_user_secret[0].secret_arn }
