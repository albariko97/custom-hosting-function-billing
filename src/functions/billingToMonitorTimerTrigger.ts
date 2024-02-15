import { app, InvocationContext, Timer } from "@azure/functions";
import { WebSiteManagementClient } from "@azure/arm-appservice";
import { ClientSecretCredential } from "@azure/identity";
import { TelemetryClient } from 'applicationinsights';

// map of SKU to vCPU
const skuToVCpuMap = {
    'B1': 1,
    'B2': 2,
    'B3': 4,
    'S1': 1,
    'S2': 2,
    'S3': 4,
    'P1v2': 1,
    'P2v2': 2,
    'P3v2': 4,
    'A1': 1,
    'A2': 2,
    'A3': 4,
    'A4': 8,
    'A5': 2,
    'A6': 4,
    'A7': 8,
    'A8': 8,
    'A9': 16,
    'A10': 8,
    'A11': 16,
    'D1': 1,
    'D2': 2,
    'D3': 4,
    'D4': 8,
    'D5': 16,
    'D11': 2,
    'D12': 4,
    'D13': 8,
    'D14': 16,
    'F1': 1,
    'F2': 2,
    'F4': 4,
    'F8': 8,
    'F16': 16,
    'G1': 2,
    'G2': 4,
    'G3': 8,
    'G4': 16,
    'G5': 32
};

const config = {
    tenantId: process.env["TENANT_ID"],
    clientId: process.env["CLIENT_ID"],
    clientSecret: process.env["CLIENT_SECRET"],
    subscriptionId: process.env["SUBSCRIPTION_ID"],
    resourceGroupName: process.env["RESOURCE_GROUP_NAME"],
    appServicePlanName: process.env["APP_SERVICE_PLAN_NAME"],
    otlpUrl: process.env["OTLP_URL"],
    // Instrumentation key for the Application Insights resource
    iKey: process.env["IKEY"]
};

/**
 * This function will be triggered based on a timer and will send the billing metrics to Azure Monitor
 * @param myTimer 
 * @param context 
 */
export async function billingToMonitorTimerTrigger(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request.');

    const credential = new ClientSecretCredential(config.tenantId, config.clientId, config.clientSecret);
    const appServicePlan = await getAppServicePlan(credential, config.subscriptionId, config.resourceGroupName, config.appServicePlanName);

    try {
        // Initialize the Application Insights client
        const teleclient = new TelemetryClient(config.iKey);

        const vCpusPerInstance = skuToVCpuMap[appServicePlan.sku?.name || ''];
        const totalVCpus = (vCpusPerInstance || 0) * (appServicePlan.numberOfWorkers || 0);

        console.log(`Number of instances running: ${appServicePlan.numberOfWorkers}`);
        console.log(`SKU of the app service plan: ${appServicePlan.sku?.name}`);
        console.log(`Total vCPUs being used: ${totalVCpus}`);

        // Get the necessary information
        const numberOfInstancesRunning = appServicePlan.numberOfWorkers;
        const skuOfAppServicePlan = appServicePlan.sku?.name; 
        const numberOfVCPUsBeingUsed = totalVCpus;
        
        // Send the metrics to Azure Monitor
        teleclient.trackMetric({ name: 'numberOfInstancesRunning', value: numberOfInstancesRunning, namespace: 'microsoft.insights/components'});
        teleclient.trackMetric({ name: 'numberOfVCPUsBeingUsed', value: numberOfVCPUsBeingUsed, namespace: 'microsoft.insights/components'});

        context.log(`metrics were sent to Azure monitor
        Number of instances running: ${numberOfInstancesRunning}
        SKU of the app service plan: ${skuOfAppServicePlan}
        Number of vCPUs being used: ${numberOfVCPUsBeingUsed}`);

    } catch (error) {
        console.error(error);
    }
}

async function getAppServicePlan(credential, subscriptionId, resourceGroupName, appServicePlanName) {
    const client = new WebSiteManagementClient(credential, subscriptionId);
    return await client.appServicePlans.get(resourceGroupName, appServicePlanName);
}

app.timer('billingToMonitorTimerTrigger', {
    schedule: '0 * * * * *',
    handler: billingToMonitorTimerTrigger
});
