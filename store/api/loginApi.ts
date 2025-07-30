// src/services/authService.ts
export interface AuthResponse {
    access_token: string
    expires_in: number
    token_type: string
    scope: string
  }
  
  export const login = async (): Promise<AuthResponse> => {
    const body = new URLSearchParams()
    body.append("grant_type", "password")
    body.append("scope", "password")
    body.append("client_id", "password")
    body.append("client_secret", "083c426a-a3f7-f4ea-a70a-290c401b558f")
    body.append("username", "user3d")
    body.append("password", "123456a@A")
  
    const res = await fetch("https://u2502-dev-sso.dttt.vn/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    })
  
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error?.error || "Unknown error")
    }
  
    const data: AuthResponse = await res.json()
    return data
  }
  