import mongoose from 'mongoose';
import twilio from 'twilio';
import dotenv from "dotenv";
import OtpModel from '../models/otp.js'
import { otpVerification } from '../Helpers/otpValidate.js'
import registeredUser from '../models/registeredUser.js';

dotenv.config();
// const accountSid = 'AC508bd9d736ea7e34c29b5824d1beea7c'
// const authToken = '0f2d8fab5acedee643262329cf422122'
// const twilioPhoneNumber = '+12244125439'

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// console.log(accountSid);
// console.log(authToken);

const client = twilio(accountSid, authToken);

export const sendOtpController = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const cDate = new Date();
    await OtpModel.findOneAndUpdate(
      {phoneNumber },
      {otp, otpExpiration: new Date(cDate.getTime())},
      {upsert: true, new: true, setDefaultsOnInsert: true}
    );

     // Set expiration time to 5 minutes from now
     const otpExpiration = new Date();
     otpExpiration.setMinutes(otpExpiration.getMinutes() + 5);

    // Send the OTP via SMS
    const message = await client.messages.create({
      body: `Your OTP for login is: ${otp}`,
      from: twilioPhoneNumber, // Use the configured Twilio phone number
      to: phoneNumber,
    });

    // Log success message
    console.log('OTP sent successfully to:', phoneNumber);

    // Respond with success message
    res.status(200).json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    // Log error
    console.error('Error sending OTP:', error);

    // Respond with error message
    res.status(500).json({ success: false, error: 'Failed to send OTP.' });
  }
};

export const verifyOtpController = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // Log received data
    console.log('Received data for OTP verification:', req.body);
    
    // Verify the received OTP
    const otpData = await OtpModel.findOne({
      phoneNumber,
      otp
    });

    // Log found OTP data
    console.log('Found OTP data:', otpData);

    if(!otpData){
      return res.status(400).json({ 
        success: false,
        msg: 'You entered wrong otp !'
       });
    }

    const isOtpExpired = await otpVerification(otpData.otpEpiration);
    
    if(isOtpExpired){
      return res.status(400).json({
        success: false,
        msg: 'Your OTP has been expired!'
      });
    }

    const user = await registeredUser.findOne({ phone_number: phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found for the provided phone number!'
      });
    }

    // Generate JWT token for the user using their email
    const accessToken = user.generateAccessToken();

    return res.status(200).json({
      success: true,
      msg: 'OTP verified successfully.',
      email: user.email, // Send the user's email to the frontend
      accessToken: accessToken // Also send the generated access token if needed
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};