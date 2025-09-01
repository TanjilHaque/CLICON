exports.registrationTemplate = (
  firstName,
  verificationUrl,
  otpGenerator,
  expireTime
) => {
  return `
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header {
      background: #2563eb; /* Tailwind blue-600 */
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .content h2 {
      margin-top: 0;
      color: #2563eb;
    }
    .button {
      display: inline-block;
      margin: 20px 0;
      padding: 12px 24px;
      background: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      background: #f4f4f4;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #777777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Email</h1>
    </div>
    <div class="content">
      <h2>Hello ${firstName},</h2>
      <h2>Your OTP number is: ${otpGenerator},</h2>
      <p>
        Thank you for registering with <strong>CLICON</strong>.  
        To complete your registration, please verify your email address.
      </p>
      <p>
       Your Validation expire time is: ${expireTime}
      </p>
      <a href=${verificationUrl} class="button">Verify Email</a>
      <p>
        This link will expire in <strong>24 hours</strong> for security reasons.  
        If you didn’t sign up for this account, you can safely ignore this email.
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2025 MernShop. All rights reserved.</p>
      <p>CLICON Inc, Dhaka, Bangladesh</p>
    </div>
  </div>
</body>
</html>

    
    `;
};
