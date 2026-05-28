$ErrorActionPreference = 'Stop'

function Invoke-Api {
    param([string]$Uri, [string]$Method, [string]$Body, [string]$Token)
    $headers = @{}
    if ($Token) { $headers.Add("Authorization", "Bearer $Token") }
    
    try {
        if ($Body) {
            $resp = Invoke-RestMethod -Uri $Uri -Method $Method -Headers $headers -Body $Body -ContentType "application/json" -SkipHttpErrorCheck
        } else {
            $resp = Invoke-RestMethod -Uri $Uri -Method $Method -Headers $headers -SkipHttpErrorCheck
        }
        # Wait, SkipHttpErrorCheck is available in PowerShell 7+. 
        # In PowerShell 5.1 (Windows default), we must use try/catch to get status code.
    } catch {
        # ignore
    }
}

function Test-Endpoint {
    param([string]$Name, [string]$Uri, [string]$Method, [string]$Body, [string]$Token, [int]$ExpectedStatus)
    $headers = @{}
    if ($Token) { $headers.Add("Authorization", "Bearer $Token") }
    
    $statusCode = 0
    try {
        if ($Body) {
            $resp = Invoke-WebRequest -Uri $Uri -Method $Method -Headers $headers -Body $Body -ContentType "application/json" -UseBasicParsing
        } else {
            $resp = Invoke-WebRequest -Uri $Uri -Method $Method -Headers $headers -UseBasicParsing
        }
        $statusCode = [int]$resp.StatusCode
    } catch {
        $statusCode = [int]$_.Exception.Response.StatusCode
    }
    
    if ($statusCode -eq $ExpectedStatus) {
        Write-Host "[PASS] $Name -> Expected $ExpectedStatus, Got $statusCode" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] $Name -> Expected $ExpectedStatus, Got $statusCode" -ForegroundColor Red
    }
}

Write-Host "Starting API Tests..."

# 1. Login
$adminBody = @{ username="admin"; password="Password@123" } | ConvertTo-Json
$adminResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $adminBody -ContentType "application/json"
$adminToken = $adminResp.token

$custBody = @{ username="rajesh_k"; password="Password@123" } | ConvertTo-Json
$custResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $custBody -ContentType "application/json"
$custToken = $custResp.token

$smeBody = @{ username="sme1"; password="Password@123" } | ConvertTo-Json
$smeResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $smeBody -ContentType "application/json"
$smeToken = $smeResp.token

Write-Host "Tokens acquired."

# 2. Test Consumers API
Test-Endpoint -Name "Customer accesses /api/consumers" -Uri "http://localhost:8080/api/consumers" -Method Get -Token $custToken -ExpectedStatus 403
Test-Endpoint -Name "Admin accesses /api/consumers" -Uri "http://localhost:8080/api/consumers" -Method Get -Token $adminToken -ExpectedStatus 200

# Rajesh is linked to consumer ID 1.
Test-Endpoint -Name "Customer accesses own consumer data" -Uri "http://localhost:8080/api/consumers/1" -Method Get -Token $custToken -ExpectedStatus 200
Test-Endpoint -Name "Customer accesses other consumer data" -Uri "http://localhost:8080/api/consumers/2" -Method Get -Token $custToken -ExpectedStatus 403

# 3. Test Bills API
Test-Endpoint -Name "Customer accesses all bills" -Uri "http://localhost:8080/api/bills" -Method Get -Token $custToken -ExpectedStatus 403
Test-Endpoint -Name "Admin accesses all bills" -Uri "http://localhost:8080/api/bills" -Method Get -Token $adminToken -ExpectedStatus 200
Test-Endpoint -Name "Customer accesses own bills" -Uri "http://localhost:8080/api/bills/consumer/1" -Method Get -Token $custToken -ExpectedStatus 200

# 4. Test Complaints API
Test-Endpoint -Name "Customer accesses all active complaints" -Uri "http://localhost:8080/api/complaints/active" -Method Get -Token $custToken -ExpectedStatus 403
Test-Endpoint -Name "Admin accesses all active complaints" -Uri "http://localhost:8080/api/complaints/active" -Method Get -Token $adminToken -ExpectedStatus 200

# 5. Test Payments API
Test-Endpoint -Name "Customer process offline payment" -Uri "http://localhost:8080/api/payments/offline" -Method Post -Body "{}" -Token $custToken -ExpectedStatus 403

$validOnlinePayment = @{
    billId = 3
    cardNumber = "1234567812345678"
    cardHolderName = "John Doe"
    cvv = "123"
} | ConvertTo-Json
Test-Endpoint -Name "Customer valid online payment" -Uri "http://localhost:8080/api/payments/online" -Method Post -Body $validOnlinePayment -Token $custToken -ExpectedStatus 201

$invalidOnlinePayment = @{
    billId = 5
    cardNumber = "9999999999999999"
    cardHolderName = "Hacker"
    cvv = "999"
} | ConvertTo-Json
Test-Endpoint -Name "Customer invalid online payment" -Uri "http://localhost:8080/api/payments/online" -Method Post -Body $invalidOnlinePayment -Token $custToken -ExpectedStatus 400

Write-Host "API Tests Completed."
