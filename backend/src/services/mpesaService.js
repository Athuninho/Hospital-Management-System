const axios = require('axios');
require('dotenv').config();

async function getToken() {
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) throw new Error('MPESA credentials missing');
  const resp = await axios.get(url, { auth: { username: key, password: secret } });
  return resp.data.access_token;
}

async function stkPush(phone, amount, invoiceId) {
  // STK push stub - returns request result or throws
  const token = await getToken();
  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: 'GENERATED_PASSWORD',
    Timestamp: new Date().toISOString().replace(/[^0-9]/g, '').slice(0,14),
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: `${process.env.PUBLIC_URL}/api/integrations/mpesa/callback`,
    AccountReference: invoiceId,
    TransactionDesc: `Payment for invoice ${invoiceId}`
  };
  const resp = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, { headers: { Authorization: `Bearer ${token}` } });
  return resp.data;
}

module.exports = { getToken, stkPush };
