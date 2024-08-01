data "aws_lb" "main_lb" {
  name = var.alb_name
}

data "aws_lb_listener" "main_lb_http_listener" {
  load_balancer_arn = data.aws_lb.main_lb.arn
  port              = 80
}

resource "aws_lb_listener_rule" "forum_client_forward_rule" {
  listener_arn = data.aws_lb_listener.main_lb_http_listener.arn
  # priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.forum_client_tg.arn
  }

  condition {
    path_pattern {
      values = ["*"]
    }
  }
}
