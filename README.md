# email-sender-lambda
A lambda which sends emails

### Invoke Lambda

aws lambda invoke --function-name email-sender-lambda --payload file://infrastructure/lambdas/payload.json --cli-binary-format raw-in-base64-out response.json && more response.json
