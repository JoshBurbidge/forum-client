data "aws_lb" "main_lb" {
  name = var.alb_name
}

resource "aws_lb_listener" "main_lb_https_listener" {
  load_balancer_arn = data.aws_lb.main_lb.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = data.aws_acm_certificate.cert.arn

  default_action {
    type = "fixed-response"
    fixed_response {
      status_code  = 200
      content_type = "text/plain"
      message_body = "HTTPS listener default action"
    }
  }

  tags = local.tags
}

data "aws_lb_listener" "main_lb_http_listener" {
  load_balancer_arn = data.aws_lb.main_lb.arn
  port              = 80
}

resource "aws_lb_listener_rule" "forum_client_forward_rule_http" {
  listener_arn = data.aws_lb_listener.main_lb_http_listener.arn
  # priority     = 3

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.forum_client_tg_http.arn
  }

  condition {
    path_pattern {
      values = ["*"]
    }
  }

  tags = local.tags
}


resource "aws_lb_listener_rule" "forum_client_forward_rule" {
  listener_arn = aws_lb_listener.main_lb_https_listener.arn
  priority     = 3

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.forum_client_tg.arn
  }

  condition {
    path_pattern {
      values = ["*"]
    }
  }

  tags = local.tags
}
