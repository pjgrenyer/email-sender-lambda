resource "aws_ses_email_identity" "email" {
  email = var.ses_email_identity
}

