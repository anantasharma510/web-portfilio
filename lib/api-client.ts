"use client"

// Utility for making secure API requests with CSRF protection
export async function secureApiRequest(url: string, options: RequestInit = {}) {
  // Get CSRF token from localStorage or fetch a new one if needed
  let csrfToken = localStorage.getItem("csrfToken")

  // If no token exists, fetch a new one
  if (!csrfToken) {
    try {
      const response = await fetch("/api/csrf")
      if (response.ok) {
        const data = await response.json()
        csrfToken = data.csrfToken
        localStorage.setItem("csrfToken", csrfToken)
      }
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error)
    }
  }

  // Set default headers
  const headers = {
    "Content-Type": "application/json",
    ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
    ...options.headers,
  }

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle session expiration
  if (response.status === 401) {
    // Redirect to login page
    window.location.href = "/api/auth/signin?error=SessionExpired"
    return null
  }

  return response
}
