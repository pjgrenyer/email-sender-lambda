
variable "access_key" {
  description = "AWS Access Key"
}

variable "access_secret" {
  description = "AWS Access secret"
}

data "aws_region" "current" {}

variable "lambda_timeout" {
  default = "10" # seconds
}

variable "provisioned_concurrent_executions" {
  default = "10"
}

variable "ses_email_identity" {}

variable "ses_iam_policy" {
  default = "ses_iam_policy"
}

variable "ses_iam_user" {
  default = "ses"
}

variable "datadog_api_key" {
  default = ""
}
