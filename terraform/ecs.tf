resource "aws_ecs_cluster" "cluster" {
  name = local.app_name

  tags = local.tags
}

resource "aws_ecs_cluster_capacity_providers" "example" {
  cluster_name = aws_ecs_cluster.cluster.name

  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
}

# this target group should point to the container in the task
# outside, we create a LB with listener that points to this TG
resource "aws_lb_target_group" "forum_client_tg" {
  name        = "forum-client-tg"
  port        = 3001
  protocol    = "HTTPS"
  target_type = "ip"
  vpc_id      = data.aws_vpc.default_vpc.id
  tags        = local.tags
  health_check {
    interval = 60
    path     = "/"
  }
}

resource "aws_lb_target_group" "forum_client_tg_http" {
  name        = "forum-client-tg"
  port        = 3001
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.aws_vpc.default_vpc.id
  tags        = local.tags
  health_check {
    interval = 60
    path     = "/"
  }
}

resource "aws_ecs_service" "service" {
  name            = local.app_name
  launch_type     = "FARGATE"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.task.arn
  desired_count   = 1

  network_configuration {
    # multiple subnets means it can create tasks in each subnet
    # so if you have multiple tasks you can have tasks in multiple subnets
    subnets          = data.aws_subnets.default_vpc_subnets.ids
    assign_public_ip = true
  }

  # ip must be target because this service is awsvpc network
  # Your load balancer subnet configuration must include all Availability Zones that your container instances reside in. (subnets within the given VPC)
  load_balancer {
    target_group_arn = aws_lb_target_group.forum_client_tg.arn
    container_name   = local.app_name
    container_port   = 3001
  }

  lifecycle {
    ignore_changes = [desired_count]
  }

  tags = local.tags
}

resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/ecs/${local.app_name}-ecs-task"
  retention_in_days = 3

  tags = local.tags
}

resource "aws_ecs_task_definition" "task" {
  family             = "forum-client-task"
  execution_role_arn = aws_iam_role.task_exec_role.arn # permissions to pull container images and run the task (the default TaskExecutionRole policy)
  # task_role_arn      = data.aws_iam_role.task_exec_role.arn # permissions used for the application to access other AWS services (secrets, s3, etc)
  network_mode = "awsvpc"
  cpu          = 256
  memory       = 512
  container_definitions = jsonencode([
    {
      name      = "${local.app_name}"
      image     = "${data.aws_ecr_repository.repository.repository_url}:${var.git_commit_sha}"
      essential = true
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "${aws_cloudwatch_log_group.log_group.name}"
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
      healthCheck = {
        command  = ["CMD-SHELL", "curl http://localhost:3001 || exit 1"]
        interval = 60
      }
      portMappings = [
        {
          containerPort = 3001
          hostPort      = 3001
        }
      ]
    }
  ])
  tags = local.tags
}
