
resource "aws_s3_object" "email_sender_lambda" {
  bucket = aws_s3_bucket.email_sender_lambda.id
  key    = "email-sender-lambda.zip"
  source = "lambdas/email-sender-lambda.zip"
}

resource "aws_lambda_function" "email_sender_lambda" {
  s3_bucket     = aws_s3_bucket.email_sender_lambda.id
  s3_key        = aws_s3_object.email_sender_lambda.key
  function_name = "email-sender-lambda"
  role          = aws_iam_role.lambda.arn
  handler       = "index.handler"
  timeout       = var.lambda_timeout
  publish       = true

  runtime = "nodejs16.x"
  layers  = []

  environment {
    variables = {
      NODE_ENV            = "production",
      LOG_LEVEL           = "debug",
      SMTP_FROM           = var.ses_email_identity
      DATADOG_API_KEY     = var.datadog_api_key,
      DATADOG_API_HOST    = "example.com"
      DATADOG_SERVICE     = "email-sender-lambda",
      DATADOG_SOURCE      = "email-sender-lambda",
      DATADOG_TAGS        = "email-sender-lambda",
      SUMO_ENDPOINT       = var.sumo_endpoint
      SUMO_SERVICE_NAME   = "email-sender-lambda",
      DYNAMODB_TABLE_NAME = var.dynamodb_table_name,
    }
  }
}

resource "aws_lambda_function_url" "email_sender_lambda" {
  function_name      = aws_lambda_function.email_sender_lambda.function_name
  authorization_type = "AWS_IAM"
}

# resource "aws_lambda_provisioned_concurrency_config" "email_sender_lambda" {
#   function_name                     = aws_lambda_function.email_sender_lambda.function_name
#   provisioned_concurrent_executions = var.provisioned_concurrent_executions
#   qualifier                         = aws_lambda_function.email_sender_lambda.version
# }

resource "aws_lambda_event_source_mapping" "email_sender_lambda" {
  event_source_arn = aws_sqs_queue.email_sender_lambda.arn
  function_name    = aws_lambda_function.email_sender_lambda.arn
  batch_size       = "1"
}

output "email_sender_lambda_arn" {
  value = aws_lambda_function_url.email_sender_lambda.function_arn
}

output "email_sender_lambda_url" {
  value = aws_lambda_function_url.email_sender_lambda.function_url
}
