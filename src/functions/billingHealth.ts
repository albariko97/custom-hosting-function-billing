import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function billingHealth(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';

    return { body: `Hello, ${name} the billing poller is up!` };
};

app.http('billingHealth', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: billingHealth
});
