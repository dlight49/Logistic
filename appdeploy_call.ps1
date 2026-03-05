$headers = @{
    "Content-Type"  = "application/json"
    "Accept"        = "application/json, text/event-stream"
    "Authorization" = "Bearer ak_514488d041fd616523f540206a731fe73ed17dfffe2b038431f8df288f489130"
}

$body = @{
    jsonrpc = "2.0"
    id      = 1
    method  = "tools/call"
    params  = @{
        name      = "get_deploy_instructions"
        arguments = @{}
    }
} | ConvertTo-Json -Depth 5

$response = Invoke-RestMethod -Uri "https://api-v2.appdeploy.ai/mcp" -Method Post -Body $body -Headers $headers
$response | ConvertTo-Json -Depth 10
