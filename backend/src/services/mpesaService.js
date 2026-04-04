const axios = require('axios');

class MPesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY || 'testkey';
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET || 'testsecret';
    this.shortcode = process.env.MPESA_SHORTCODE || '174379';
    this.passkey = process.env.MPESA_PASSKEY || 'testpasskey';
  }

  async getOAuthToken() {
    // Note: Simulated for development. In production, connect to Daraja API OAuth.
    return 'simulated_oauth_token';
  }

  async triggerSTKPush(phone, amount, reference) {
    console.log(`[STK Push Simulated] Sending STK push to ${phone} for KES ${amount} - Ref: ${reference}`);
    // Simulate successful STK push acceptance
    return {
      CheckoutRequestID: `ws_CO_${Date.now()}`,
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CustomerMessage: 'Success. Request accepted for processing'
    };
  }
}

module.exports = new MPesaService();
