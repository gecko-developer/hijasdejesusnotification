import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

// Define proper types for the service account
interface ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

const serviceAccountPath = path.join(process.cwd(), 'service-account.json');

// Add error handling for file reading with proper typing
let serviceAccount: ServiceAccount;
try {
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error('Service account file not found at: ' + serviceAccountPath);
  }
  const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(fileContent) as ServiceAccount;
} catch (error) {
  console.error('Failed to load service account:', error);
  throw error;
}

const jwtClient = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
});

export async function sendFCMNotification(deviceToken: string, title: string, body: string) {
  try {
    await jwtClient.authorize();
    const accessToken = jwtClient.credentials.access_token;

    if (!accessToken) {
      throw new Error('Failed to obtain access token');
    }

    const message = {
      message: {
        token: deviceToken,
        notification: { title, body },
      },
    };

    const res = await fetch(
      `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('FCM API Error:', errorText);
      throw new Error(`FCM request failed (${res.status}): ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error sending FCM notification:', error);
    throw error;
  }
}