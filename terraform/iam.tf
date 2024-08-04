resource "aws_iam_role" "task_exec_role" {
  name = "${local.app_name}-task-execution"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })

  tags = local.tags
}

data "aws_iam_policy" "default_task_exec_policy" {
  name = "AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "task_role_attachemnt" {
  role       = aws_iam_role.task_exec_role.name
  policy_arn = data.aws_iam_policy.default_task_exec_policy.arn
}
