
variable "access_key" {
  description = "AWS Access Key"
}

variable "access_secret" {
  description = "AWS Access secret"
}

variable "lambda_timeout" {
  default = "10" # seconds
}

variable "provisioned_concurrent_executions" {
  default = "10"
}
