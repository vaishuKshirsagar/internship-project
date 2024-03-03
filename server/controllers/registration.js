// Import the User model
import bcrypt from 'bcrypt';
import registeredUser from '../models/registeredUser.js';

export const registerController = async (req, res) => {
  const { fullname, email, password, phone_number} = req.body;

  // console.log('Received phone number:', phone_number);
  try {
    // Check if the email or phone number already exists in the database
    const existingUser = await registeredUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Check if the phone number already exists in the database
    const existingPhoneUser = await registeredUser.findOne({ phone_number });
    if (existingPhoneUser) {
        return res.status(400).json({ message: 'User with this phone number already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new registeredUser({
      fullname,
      email,
      password: hashedPassword,
      phone_number
    });

    // Save the new user to the database
    await newUser.save();

    // Generate an access token
    const accessToken = newUser.generateAccessToken();
    
    // Return a success message
    res.status(201).json({ message: 'Registration successful.', user: newUser, accessToken });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
