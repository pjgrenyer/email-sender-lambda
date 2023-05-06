resource "aws_sqs_queue" "email_sender_lambda" {
  name                       = "email-sender-wk"
  redrive_policy             = "{\"deadLetterTargetArn\":\"${aws_sqs_queue.email_sender_lambda_dlq.arn}\",\"maxReceiveCount\":2}"
  visibility_timeout_seconds = 300
}

resource "aws_sqs_queue" "email_sender_lambda_dlq" {
  name = "email-sender-dlq"
}

