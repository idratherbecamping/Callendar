import { SquareAuthToken } from '@/types/square';

export async function getSquareClient() {
  const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
  if (!SQUARE_ACCESS_TOKEN) {
    throw new Error('Square access token is not configured');
  }
  return SQUARE_ACCESS_TOKEN;
}

export async function handleSquareCallback(code: string): Promise<SquareAuthToken> {
  const response = await fetch('/api/square/exchange-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to exchange Square token');
  }

  return response.json();
}

export async function refreshSquareToken(token: SquareAuthToken): Promise<SquareAuthToken> {
  const response = await fetch('/api/square/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: token.refresh_token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to refresh Square token');
  }

  return response.json();
}

export async function getSquareMerchantInfo(token: SquareAuthToken) {
  const response = await fetch('/api/square/merchant-info', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get Square merchant info');
  }

  return response.json();
} 