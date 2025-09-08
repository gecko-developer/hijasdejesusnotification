# RFID Notification Server

A Next.js-based server that handles RFID card scanning and sends real-time push notifications to users via Firebase Cloud Messaging (FCM). Perfect for access control systems, attendance tracking, or any RFID-based notification system.

## 🚀 Features

- **RFID Card Scanning**: Process RFID scan events and notify users
- **User-Specific Notifications**: Link RFID cards to user accounts for personalized notifications
- **Firebase Integration**: Uses Firestore for data storage and FCM for push notifications
- **Rate Limiting**: Built-in protection against API abuse (20 requests/minute)
- **CORS Support**: Configurable cross-origin resource sharing
- **Production Ready**: Optimized for deployment on Vercel
- **TypeScript**: Fully typed for better development experience

## 📋 Prerequisites

- Node.js 18+ 
- Firebase project with Firestore and FCM enabled
- Firebase service account credentials
- Flutter mobile app (for receiving notifications)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abapomon/rfid-server.git
   cd rfid-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` file:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-private-key-here\n-----END PRIVATE KEY-----"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

The server will be available at `http://localhost:3000`

## 📚 API Endpoints

### 🔍 RFID Scan
**POST** `/api/rfid-scan`

Process an RFID card scan and send notification to the linked user.

**Request Body:**
```json
{
  "rfidId": "CARD_123456",
  "location": "Main Entrance",
  "title": "Access Granted",
  "message": "Welcome to the building!"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "projects/your-project/messages/0:1234567890",
  "message": "Notification sent successfully",
  "user": "user@example.com"
}
```


## 📲 App Download

Visit [`/download`](./src/app/download/page.tsx) in your deployed app or locally to download the latest Android APK:

- **RFID_APP_2.1.1.apk** — Android, signed build

### Installation Guide
- **Android:** Enable &quot;Unknown sources&quot; in security settings if needed
- **Windows:** Requires .NET Framework 4.7.2 or later

You can also copy the direct APK link from the download page for sharing.

## 🔄 Contributing & Pushing

To push your changes to both your personal and company repositories:

```powershell
git add .
git commit -m "Your commit message"
git push origin main
git push company main
```

---

### 📝 Register Token
**POST** `/api/register-token`

Register a user's FCM token for receiving notifications.

**Request Body:**
```json
{
  "token": "fcm-token-here",
  "user_id": "user123",
  "email": "user@example.com",
  "deviceInfo": {
    "platform": "Android",
    "appVersion": "1.0.0"
  }
}
```

### 📤 Send FCM Notification
**POST** `/api/send-fcm`

Send notifications to all users or specific devices.

**Request Body:**
```json
{
  "title": "Test Notification",
  "body": "This is a test message",
  "sendToAll": true
}
```

### 📊 Get Tokens
**GET** `/api/get-tokens`

Retrieve all registered FCM tokens (for debugging).

## 🗄️ Database Structure

### Firestore Collections

#### `user_tokens`
```json
{
  "fcm_token": "user-fcm-token",
  "user_id": "user123",
  "email": "user@example.com",
  "rfidCards": ["CARD_123456", "CARD_789012"],
  "device_info": {
    "platform": "Android",
    "appVersion": "1.0.0"
  },
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### `rfid_scans` (Auto-generated)
```json
{
  "rfidId": "CARD_123456",
  "userId": "user123",
  "userEmail": "user@example.com",
  "location": "Main Entrance",
  "timestamp": "2024-01-01T00:00:00Z",
  "notificationSent": true,
  "messageId": "projects/.../messages/..."
}
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set framework preset to **Next.js**

3. **Set Environment Variables**
   
   In Vercel Dashboard → Settings → Environment Variables:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY=your-private-key
   ```

4. **Deploy**
   
   Your API will be available at `https://your-app.vercel.app`

## 🔧 Configuration

### Rate Limiting
Modify rate limits in `src/lib/rateLimiter.ts`:
```typescript
// Allow 50 requests per minute instead of 20
if (!rateLimit(ip as string, 50, 60000)) {
```

### CORS Settings
Update allowed origins in API files:
```typescript
res.setHeader('Access-Control-Allow-Origin', 
  process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : '*'
);
```

## 📱 Flutter App Integration

Your Flutter app should:

1. **Save FCM tokens to Firestore** when users log in
2. **Link RFID cards** to user accounts
3. **Handle incoming notifications** from the server

Example Flutter integration:
```dart
// Save FCM token
await FirebaseFirestore.instance
  .collection('user_tokens')
  .doc(user.uid)
  .set({
    'fcm_token': fcmToken,
    'user_id': user.uid,
    'email': user.email,
    // ... other fields
  }, SetOptions(merge: true));

// Link RFID card
await FirebaseFirestore.instance
  .collection('user_tokens')
  .doc(user.uid)
  .update({
    'rfidCards': FieldValue.arrayUnion([rfidId])
  });
```

## 🧪 Testing

### Test RFID Scan
```bash
curl -X POST https://your-app.vercel.app/api/rfid-scan \
  -H "Content-Type: application/json" \
  -d '{
    "rfidId": "TEST_CARD_123",
    "location": "Main Entrance",
    "title": "Access Granted"
  }'
```

### Test with VS Code REST Client
Create `test.http`:
```http
### Test RFID Scan
POST https://your-app.vercel.app/api/rfid-scan
Content-Type: application/json

{
  "rfidId": "TEST_CARD_123",
  "location": "Main Entrance",
  "title": "Access Granted",
  "message": "Welcome to the building!"
}
```

## 🔒 Security

- **Environment Variables**: Never commit Firebase credentials to Git
- **Rate Limiting**: Protects against API abuse
- **CORS**: Restricts cross-origin requests
- **Input Validation**: Validates all incoming requests
- **Firestore Security Rules**: Implement proper database access controls

## 🐛 Troubleshooting

### Common Issues

1. **"No user found for this RFID card"**
   - Ensure the RFID card is linked to a user in Firestore
   - Check the `rfidCards` array in the user document

2. **"No FCM token found for user"**
   - Verify the user has a valid `fcm_token` in Firestore
   - Ensure the Flutter app is saving tokens correctly

3. **Firebase Admin errors**
   - Check environment variables are set correctly
   - Verify Firebase service account permissions

4. **Rate limiting errors**
   - Wait for the rate limit window to reset
   - Adjust rate limits if needed for your use case

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ using Next.js, Firebase, and Vercel**
