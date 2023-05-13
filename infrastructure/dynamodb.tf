resource "aws_dynamodb_table" "send_email_lambda" {
  name         = "SendEmailLambda"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "UniqueId"
  range_key    = "RecordType"

  attribute {
    name = "UniqueId"
    type = "S"
  }

  attribute {
    name = "RecordType"
    type = "S"
  }

  # ttl {
  #   attribute_name = "TimeToExist"
  #   enabled        = false
  # }
}