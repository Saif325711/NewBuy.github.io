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

        async function generateIdentity(serviceName) {
            const url = `https://serviceusage.googleapis.com/v1beta1/projects/${projectId}/services/${serviceName}:generateServiceIdentity`;
            console.log(`Calling generateServiceIdentity for ${serviceName} at ${url}...`);

            for (let i = 0; i < 3; i++) {
                try {
                    console.log(`Attempt ${i + 1}...`);
                    const res = await client.request({
                        url,
                        method: 'POST',
                    });
                    console.log(`Success for ${serviceName}!`, JSON.stringify(res.data, null, 2));
                    return;
                } catch (error) {
                    console.error(`Attempt ${i + 1} failed for ${serviceName}:`, error.message);
                    if (error.code === 'ECONNRESET' || error.message.includes('socket hang up')) {
                        await new Promise(r => setTimeout(r, 2000));
                        continue;
                    }
                    if (error.response) {
                        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
                        // If already exists or permission issue, might not work to retry, but let's see.
                        if (error.response.status === 403) break;
                    }
                }
            }
            throw new Error(`Failed to generate identity for ${serviceName}`);
        }

        // Generate for Pub/Sub (Just in case)
        try {
            await generateIdentity('pubsub.googleapis.com');
        } catch (e) {
            console.error('Pub/Sub identity generation failed (might already exist or other error):', e.message);
        }

        // Generate for Eventarc
        try {
            await generateIdentity('eventarc.googleapis.com');
        } catch (e) {
            console.error('Eventarc identity generation failed:', e.message);
        }

        console.log('Finished identity generation attempts.');
        process.exit(0);

    } catch (error) {
        console.error('Fatal script error:', error);
        process.exit(1);
    }
}

main();
