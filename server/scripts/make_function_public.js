const { GoogleAuth } = require('google-auth-library');
const path = require('path');
const fs = require('fs');

async function main() {
    try {
        const keyPath = path.join(__dirname, '../serviceAccountKey.json');
        console.log(`Using key file: ${keyPath}`);

        if (!fs.existsSync(keyPath)) {
            throw new Error(`Key file not found at ${keyPath}`);
        }

        const auth = new GoogleAuth({
            keyFile: keyPath,
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });

        const client = await auth.getClient();
        const projectId = await auth.getProjectId();

        console.log(`Authenticated as project: ${projectId}`);

        const functionName = `projects/${projectId}/locations/us-central1/functions/api`;
        const url = `https://cloudfunctions.googleapis.com/v1/${functionName}:getIamPolicy`;

        console.log(`Getting IAM policy for ${functionName}...`);

        const res = await client.request({ url });
        const policy = res.data;

        console.log('Current Policy bindings:', JSON.stringify(policy.bindings, null, 2));

        // Check if allUsers is already there
        const invokerBinding = policy.bindings.find(b => b.role === 'roles/cloudfunctions.invoker');
        if (invokerBinding && invokerBinding.members.includes('allUsers')) {
            console.log('Function is already public.');
            return;
        }

        // Add allUsers
        if (invokerBinding) {
            invokerBinding.members.push('allUsers');
        } else {
            policy.bindings.push({
                role: 'roles/cloudfunctions.invoker',
                members: ['allUsers']
            });
        }

        console.log('Setting new IAM policy...');
        const setUrl = `https://cloudfunctions.googleapis.com/v1/${functionName}:setIamPolicy`;

        await client.request({
            url: setUrl,
            method: 'POST',
            data: {
                policy: policy,
                updateMask: 'bindings'
            }
        });

        console.log('Successfully made function public.');

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
        process.exit(1);
    }
}

main();
