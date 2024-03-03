export const otpVerification = (otpTime) => {
    console.log('Milliseconds:', otpTime);
    const cDateTime = new Date();
    let differenceValue = (otpTime - cDateTime.getTime()) / 1000 / 60; // Convert to minutes directly

    console.log('Difference in minutes:', differenceValue);

    // If difference is greater than 5 minutes, OTP has expired
    return differenceValue > 5;
};
