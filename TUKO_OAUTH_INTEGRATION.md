# Tuko OAuth Integration - Star.Tuko.lk (Beauty 2026)

## ✅ Integration Status: READY

The OAuth integration is fully implemented and ready. We just need OAuth client credentials from Tuko admin.

---

## 📋 What We Need From Tuko Admin

Please register our application with the following details:

| Field | Value |
|-------|-------|
| **Application Name** | Beauty 2026 / Star.Tuko.lk |
| **Description** | Sri Lanka's Biggest Online Beauty Contest |
| **Logo URL** | https://star.tuko.lk/logo.png |
| **Redirect URI (Production)** | `https://star.tuko.lk/api/auth/tuko/callback` |
| **Redirect URI (Development)** | `http://localhost:3000/api/auth/tuko/callback` |
| **Required Scopes** | `profile`, `phone` |

### After Registration, We Need:
- [ ] `client_id` - Application identifier
- [ ] `client_secret` - Application secret (keep secure)

---

## 🔧 Configuration

Once we receive the credentials, add them to `.env.local`:

```env
# Tuko OAuth (Production URLs)
NEXT_PUBLIC_TUKO_AUTH_URL="https://tuko.senific.com/routes/oauth/authorize"
TUKO_TOKEN_URL="https://tuko.senific.com/routes/oauth/token"
TUKO_USERINFO_URL="https://tuko.senific.com/routes/oauth/userinfo"
TUKO_REVOKE_URL="https://tuko.senific.com/routes/oauth/revoke"

# Credentials from Tuko admin
NEXT_PUBLIC_TUKO_CLIENT_ID="<your_client_id>"
TUKO_CLIENT_SECRET="<your_client_secret>"

# Redirect URI (must match what's registered)
NEXT_PUBLIC_TUKO_REDIRECT_URI="https://star.tuko.lk/api/auth/tuko/callback"
```

---

## 📁 Implementation Files

```
src/
├── lib/auth/
│   ├── index.ts              # Export module
│   └── tuko-oauth.ts         # OAuth utility functions
├── app/api/auth/tuko/
│   ├── login/route.ts        # GET: Initiates OAuth flow
│   ├── callback/route.ts     # GET: Handles OAuth callback
│   ├── logout/route.ts       # POST/GET: Logout & revoke token
│   └── session/route.ts      # GET: Check/refresh session
├── app/login/
│   └── page.tsx              # Login page UI
└── context/
    └── AuthContext.tsx       # React auth context & hooks
```

---

## 🔄 OAuth Flow

```
User clicks "Login with Tuko"
        ↓
Redirect to: /api/auth/tuko/login
        ↓
Redirect to: https://tuko.senific.com/routes/oauth/authorize
        ↓
User authenticates on Tuko
        ↓
Tuko redirects to: /api/auth/tuko/callback?code=...
        ↓
Exchange code for tokens (server-side)
        ↓
Fetch user profile from /oauth/userinfo
        ↓
Create session cookie & redirect to app
```

---

## 👤 User Data We Receive

From Tuko's `/oauth/userinfo` endpoint:

```json
{
  "sub": "507f1f77bcf86cd799439011",
  "id": "507f1f77bcf86cd799439011",
  "name": "Nimali Perera",
  "username": "nimali_p",
  "picture": "https://tuko.senific.com/uploads/.../avatar.jpg",
  "phone_number": "+94771234567",
  "phone_number_verified": true,
  "updated_at": 1703318400
}
```

---

## 🚀 Usage in Components

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <button onClick={() => login()}>Login with Tuko</button>;
  }
  
  return (
    <div>
      <img src={user.profilePic} alt={user.name} />
      <span>Welcome, {user.name} (@{user.username})</span>
      <button onClick={() => logout('/')}>Logout</button>
    </div>
  );
}
```

---

## 📞 Contact

For OAuth registration:
- Contact Tuko development team / admin
- Reference: Tuko OAuth Integration Guide (oauth_integration_guide.md)

---

*Document Version: 2.0*  
*Updated: December 23, 2025*  
*Based on: Tuko OAuth 2.0 Integration Guide v1.0.0*
