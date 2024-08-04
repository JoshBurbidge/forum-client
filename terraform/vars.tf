variable "git_commit_sha" {
  description = "the git commit that triggered the deployment"
  type        = string
}

variable "ecr_repository_name" {
  description = "ECR repository name that stores the images for ECS"
  type        = string
  default     = "forum-client"
}

variable "alb_name" {
  description = "Name of the shared ALB for this account"
  type        = string
  default     = "main-lb"
}
