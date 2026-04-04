const axios = require('axios');

class SMSService {
  constructor() {
    this.apiKey = process.env.AT_API_KEY || 'test_api_key';
    this.username = process.env.AT_USERNAME || 'sandbox'; // Typical Africa's Talking setup
    this.senderId = process.env.AT_SENDER_ID || 'MOMBASA_HMS';
  }

  async sendSMS(phoneNumber, message) {
    console.log(`[SMS_SIMULATION] To: ${phoneNumber} | Sender: ${this.senderId}`);
    console.log(`[SMS_SIMULATION] Message: ${message}`);

    // In production, you would call the Africa's Talking API here.
    /*
    const url = 'https://api.sandbox.africastalking.com/version1/messaging';
    try {
      await axios.post(url, new URLSearchParams({
        username: this.username,
        to: phoneNumber,
        message: message,
        from: this.senderId
      }), {
        headers: {
          'apiKey': this.apiKey,
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    } catch (err) {
      console.error('Failed to send SMS:', err.message);
    }
    */
    return true;
  }

  async sendPaymentConfirmation(phoneNumber, invoiceId, amount) {
    const msg = `Confirmed. KES ${amount} has been received for Invoice ${invoiceId} at Mombasa County Hospital. Thank you.`;
    return this.sendSMS(phoneNumber, msg);
  }

  async sendRegistrationWelcome(phoneNumber, patientName, patientId) {
    const msg = `Welcome ${patientName} to Mombasa County Hospital. Your Patient ID is ${patientId}. We are dedicated to your health.`;
    return this.sendSMS(phoneNumber, msg);
  }

  async sendAppointmentReminder(phoneNumber, date, doctorName) {
    const msg = `Reminder: You have an appointment at Mombasa County Hospital on ${date} with Dr. ${doctorName}.`;
    return this.sendSMS(phoneNumber, msg);
  }
}

module.exports = new SMSService();
