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

resource "aws_lb_listener_rule" "forum_client_forward_rule" {
  listener_arn = aws_lb_listener.main_lb_https_listener.arn
  priority     = 3

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

resource "aws_route53_record" "main_lb_dns" {
  name    = "zzzyx.click"
  zone_id = "Z0424378XVXHOFVZNJ5G"
  type    = "A"
  # ttl     = 60
  # records = [data.aws_lb.main_lb.dns_name]

  alias {
    name                   = data.aws_lb.main_lb.dns_name
    zone_id                = data.aws_lb.main_lb.zone_id
    evaluate_target_health = true
  }
}

import {
  to = aws_route53_record.main_lb_dns
  id = "Z0424378XVXHOFVZNJ5G_zzzyx.click_A"
}
