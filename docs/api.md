# API

The app communicates with a custom FastAPI backend for authentication and map content. This is separate from the ArcGIS Server which serves map tiles directly.

## Base URL

```
http://172.16.65.33:8000/api/v1
```

The base URL is defined in `src/services/api.ts`.

## Endpoints

### POST `/auth/guest-token`

Obtains a guest access token for subsequent API calls.

**Request body**: None (empty POST)

**Response**:
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

**Storage**: The token is cached in `expo-secure-store` under the key `guestToken` to avoid re-authenticating on every request.

---

### GET `/map/public-map/{slug}`

Fetches a public map HTML page by slug.

**Headers**:
```
Authorization: Bearer <guest_token>
```

**Path parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Map identifier (e.g., `"default"`) |

**Response**: HTML content (string) that can be loaded directly into a WebView.

---

## ApiService class

Defined in `src/services/api.ts`.

| Method | HTTP | Endpoint | Description |
|--------|------|----------|-------------|
| `getGuestToken()` | POST | `/auth/guest-token` | Fetches and caches guest token |
| `getPublicMap(slug)` | GET | `/map/public-map/{slug}` | Fetches map HTML using cached token |

Usage in hooks:

- **`useAppInit.ts`**: Calls `apiService.getPublicMap(slug)` on mount. If successful, sets `htmlContent` state for the WebView. Logs errors but does not block the UI (falls back to static HTML).

## Unused endpoints (defined in `src/constants/config.ts`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/map/init` | POST | Map initialization (unused) |
| `/api/v1/map/{slug}/html` | GET | Alternative map HTML endpoint (unused) |

These are defined as constants but not called anywhere in the current codebase.
