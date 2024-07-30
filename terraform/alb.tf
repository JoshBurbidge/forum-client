data "aws_lb" "main_lb" {
  name = var.alb_name
}

data "aws_lb_listener" "main_lb_http_listener" {
  load_balancer_arn = data.aws_lb.main_lb.arn
  port              = 80
}

resource "aws_lb_listener_rule" "forum_server_forward_rule" {
  listener_arn = data.aws_lb_listener.main_lb_http_listener.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.forum_client_tg.arn
  }

  condition {
    // maybe change this to have an app prefix or something
    path_pattern {
      values = ["*"]
    }
  }
}
