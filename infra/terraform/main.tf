terraform {
  required_version = ">= 1.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "insurenext-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "insurenext-terraform-locks" # state locking - prevents two people running apply at once
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source             = "./modules/vpc"
  vpc_cidr           = "10.0.0.0/16"
  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]
  environment        = var.environment
}

module "eks" {
  source          = "./modules/eks"
  cluster_name    = "insurenext-${var.environment}"
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnet_ids
  environment     = var.environment
}

module "rds" {
  source            = "./modules/rds"
  identifier_prefix = "insurenext-${var.environment}"
  vpc_id            = module.vpc.vpc_id
  private_subnets   = module.vpc.private_subnet_ids
  multi_az          = var.environment == "prod"
}
