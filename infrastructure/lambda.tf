
resource "aws_s3_object" "email_sender_lambda" {
  bucket = aws_s3_bucket.email_sender_lambda.id
  key    = "email-sender-lambda.zip"
  source = "lambdas/email-sender-lambda.zip"
}

resource "aws_iam_role" "lambda" {
  name = "lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
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
      NODE_ENV  = "production",
      LOG_LEVEL = "info",
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

output "email_sender_lambda_arn" {
  value = aws_lambda_function_url.email_sender_lambda.function_arn
}

output "email_sender_lambda_url" {
  value = aws_lambda_function_url.email_sender_lambda.function_url
}
