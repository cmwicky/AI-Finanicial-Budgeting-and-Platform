#!/usr/bin/env python3
"""
Generate a secure secret key for production use.
"""

import secrets

def generate_secret_key():
    """Generate a cryptographically secure random key."""
    return secrets.token_urlsafe(32)

if __name__ == "__main__":
    key = generate_secret_key()
    print("🔑 Your production SECRET_KEY:")
    print(f"SECRET_KEY={key}")
    print()
    print("Copy this to your deployment platform's environment variables.")