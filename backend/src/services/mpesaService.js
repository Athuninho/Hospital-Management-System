const axios = require('axios');

class MPesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY || '';
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET || '';
    this.shortcode = process.env.MPESA_SHORTCODE || '174379'; // Till or Paybill Number
    this.passkey = process.env.MPESA_PASSKEY || '';
    this.environment = process.env.MPESA_ENV || 'sandbox'; // set to 'live' for production
    this.baseURL = this.environment === 'live' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';
  }

  async getOAuthToken() {
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    try {
      const response = await axios.get(`${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: { Authorization: `Basic ${auth}` }
      });
      return response.data.access_token;
    } catch (error) {
      console.error('M-Pesa auth error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with M-Pesa Daraja API');
    }
  }

  async triggerSTKPush(phone, amount, reference) {
    const token = await this.getOAuthToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3); // Format: YYYYMMDDHHmmss
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    
    // Safaricom expects phone numbers to start with 254 (e.g. 254700000000)
    let formattedPhone = phone.replace(/^0/, '254').replace(/^\+/, '');

    console.log(`[STK Push] Sending STK push to ${formattedPhone} for KES ${amount} - Ref: ${reference}`);
    
    try {
      const response = await axios.post(`${this.baseURL}/mpesa/stkpush/v1/processrequest`, {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline', // Or CustomerBuyGoodsOnline for Till numbers
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL || 'https://your-live-domain.com/api/billing/mpesa-callback', // YOUR LIVE WEBHOOK
        AccountReference: reference.substring(0, 12),
        TransactionDesc: 'Hospital Bill Payment'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('M-Pesa STK Push error:', error.response?.data || error.message);
      throw new Error(`STK Push failed: ${error.response?.data?.errorMessage || error.message}`);
    }
  }
}

module.exports = new MPesaService();
