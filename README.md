# Introduction 
This repository contains an Azure function project in Node.js and its objective is to show the implementation of functions that extract an App Service Plan information and publish it to different sources like Otel collector and Azure monitor.

# Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/en)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Azure Storage Emulator](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-emulator)
- [Azure Functions vscode extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)

# Getting Started

# Running the Function Locally
for local deployment please create the json file: "local.settings.json"  in the main folder ./

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
    "AzureWebJobs.httpTrigger1.Disabled": "false",
    "TENANT_ID": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
    "CLIENT_ID": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
    "CLIENT_SECRET": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
    "SUBSCRIPTION_ID": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
    "RESOURCE_GROUP_NAME": "your-rg",
    "APP_SERVICE_PLAN_NAME": "your-appserviceplan",
    "IKEY": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
    "OTLP_URL": "http://localhost:4318/v1/metrics"
  }
```

# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)