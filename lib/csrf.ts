// This file now only contains types and constants related to CSRF
// The actual token generation and verification happens in route handlers

export type CsrfToken = string

export const CSRF_HEADER = "x-csrf-token"
