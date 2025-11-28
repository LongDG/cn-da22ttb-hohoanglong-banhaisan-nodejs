#!/usr/bin/env pwsh

# Test Auth API Endpoints

$API_URL = "http://localhost:3000/api/auth"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Testing Auth Endpoints" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Test 1: Register
Write-Host "`n[TEST 1] Register New User" -ForegroundColor Yellow
$registerData = @{
    name = "Test User $(Get-Random)"
    email = "testuser$(Get-Random)@example.com"
    password = "password123"
    role = "customer"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Method Post `
        -Uri "$API_URL/register" `
        -Body $registerData `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    $token = $response.data.token
    $userId = $response.data.user.user_id
    $email = $response.data.user.email
    
    Write-Host "✓ Register Success!" -ForegroundColor Green
    Write-Host "  User ID: $userId" -ForegroundColor Gray
    Write-Host "  Email: $email" -ForegroundColor Gray
    Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Register Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Login with registered account
Write-Host "`n[TEST 2] Login with Registered Account" -ForegroundColor Yellow
$loginData = @{
    email = $email
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Method Post `
        -Uri "$API_URL/login" `
        -Body $loginData `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    $loginToken = $response.data.token
    
    Write-Host "✓ Login Success!" -ForegroundColor Green
    Write-Host "  Email: $($response.data.user.email)" -ForegroundColor Gray
    Write-Host "  Role: $($response.data.user.role)" -ForegroundColor Gray
    Write-Host "  Token: $($loginToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Login Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Login with wrong password
Write-Host "`n[TEST 3] Login with Wrong Password (should fail)" -ForegroundColor Yellow
$wrongLoginData = @{
    email = $email
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Method Post `
        -Uri "$API_URL/login" `
        -Body $wrongLoginData `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "✗ Expected to fail but succeeded!" -ForegroundColor Red
    exit 1
} catch {
    $errorMsg = $_.Exception.Response.Content | ConvertFrom-Json
    Write-Host "✓ Correctly rejected!" -ForegroundColor Green
    Write-Host "  Error: $($errorMsg.error)" -ForegroundColor Gray
}

# Test 4: Register with duplicate email (should fail)
Write-Host "`n[TEST 4] Register with Duplicate Email (should fail)" -ForegroundColor Yellow
$duplicateData = @{
    name = "Duplicate User"
    email = $email
    password = "password123"
    role = "customer"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Method Post `
        -Uri "$API_URL/register" `
        -Body $duplicateData `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "✗ Expected to fail but succeeded!" -ForegroundColor Red
    exit 1
} catch {
    $errorMsg = $_.Exception.Response.Content | ConvertFrom-Json
    Write-Host "✓ Correctly rejected!" -ForegroundColor Green
    Write-Host "  Error: $($errorMsg.error)" -ForegroundColor Gray
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "All Tests Passed! `u{2713}" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
