$ErrorActionPreference = 'SilentlyContinue'

function Test-Validation {
    param([string]$Name, [string]$Uri, [string]$Method, [string]$Body, [string]$Token)
    $headers = @{}
    if ($Token) { $headers.Add("Authorization", "Bearer $Token") }
    
    $statusCode = 0
    $responseBody = ""
    try {
        if ($Body) {
            $resp = Invoke-WebRequest -Uri $Uri -Method $Method -Headers $headers -Body $Body -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
        } else {
            $resp = Invoke-WebRequest -Uri $Uri -Method $Method -Headers $headers -UseBasicParsing -ErrorAction Stop
        }
        $statusCode = [int]$resp.StatusCode
        $responseBody = $resp.Content
    } catch {
        $statusCode = [int]$_.Exception.Response.StatusCode
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $responseBody = $reader.ReadToEnd()
        }
    }
    
    if ($statusCode -eq 400) {
        Write-Host "[PASS] $Name -> Returned 400. Details: $responseBody" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] $Name -> Expected 400, Got $statusCode. Details: $responseBody" -ForegroundColor Red
    }
}

Write-Host "Starting Validation Tests..."

# Login as Admin to test AddConsumer validation
$adminBody = @{ username="admin"; password="Password@123" } | ConvertTo-Json
$adminResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $adminBody -ContentType "application/json"
$adminToken = $adminResp.token

# Login as Customer to test OnlinePayment validation
$custBody = @{ username="rajesh_k"; password="Password@123" } | ConvertTo-Json
$custResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $custBody -ContentType "application/json"
$custToken = $custResp.token

Write-Host "--- Testing Registration Validations ---"
$badEmail = @{ username="test1"; email="invalid-email"; phone="1234567890"; password="Password@123" } | ConvertTo-Json
Test-Validation -Name "Invalid Email Format" -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $badEmail

$badPhone = @{ username="test2"; email="test@test.com"; phone="12345"; password="Password@123" } | ConvertTo-Json
Test-Validation -Name "Invalid Phone Length" -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $badPhone

$badPassword = @{ username="test3"; email="test@test.com"; phone="1234567890"; password="weak" } | ConvertTo-Json
Test-Validation -Name "Weak Password" -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $badPassword

Write-Host "`n--- Testing AddConsumer Validations ---"
$badName = @{ name="A"; address="Valid Address 123"; meterNumber="MTR-123"; consumerNumber="1234567890123"; tariffType="DOMESTIC" } | ConvertTo-Json
Test-Validation -Name "Name too short" -Uri "http://localhost:8080/api/consumers" -Method Post -Body $badName -Token $adminToken

$badMeter = @{ name="Valid Name"; address="Valid Address 123"; meterNumber="INVALIDMTR"; consumerNumber="1234567890123"; tariffType="DOMESTIC" } | ConvertTo-Json
Test-Validation -Name "Invalid Meter Number Pattern" -Uri "http://localhost:8080/api/consumers" -Method Post -Body $badMeter -Token $adminToken

$badConsumerNo = @{ name="Valid Name"; address="Valid Address 123"; meterNumber="MTR-123"; consumerNumber="123"; tariffType="DOMESTIC" } | ConvertTo-Json
Test-Validation -Name "Invalid Consumer Number Length" -Uri "http://localhost:8080/api/consumers" -Method Post -Body $badConsumerNo -Token $adminToken

Write-Host "`n--- Testing Online Payment Validations ---"
$badCardName = @{ billId=1; cardNumber="1234567812345678"; cvv="123"; cardHolderName="John 123" } | ConvertTo-Json
Test-Validation -Name "Card Name with numbers" -Uri "http://localhost:8080/api/payments/online" -Method Post -Body $badCardName -Token $custToken

$badCardNo = @{ billId=1; cardNumber="123"; cvv="123"; cardHolderName="John Doe" } | ConvertTo-Json
Test-Validation -Name "Card Number too short" -Uri "http://localhost:8080/api/payments/online" -Method Post -Body $badCardNo -Token $custToken

$badCvv = @{ billId=1; cardNumber="1234567812345678"; cvv="1"; cardHolderName="John Doe" } | ConvertTo-Json
Test-Validation -Name "CVV too short" -Uri "http://localhost:8080/api/payments/online" -Method Post -Body $badCvv -Token $custToken

Write-Host "`nValidation Tests Completed."
