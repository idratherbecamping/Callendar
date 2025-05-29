export type SquareAuthToken = {
  access_token: string;
  token_type: string;
  expires_at: string;
  merchant_id: string;
  created_at: string;
  refresh_token?: string;
};

export type SquareMerchantInfo = {
  merchant: {
    id: string;
    business_name: string;
    country: string;
    language_code: string;
    currency: string;
    status: string;
    main_location_id: string;
  };
}; 