function accountVerification(name, token) { 
  return (`
    <html>
        <head>
        <style>
            /* Add CSS styles for better email formatting */
            body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            }
            .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1 {
            color: #333;
            }
            p {
            font-size: 16px;
            }
            a {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #007BFF;
            color: #fff !important;
            text-decoration: none;
            border-radius: 5px;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <h1>Hello ${name},</h1>
            <p>Thank you for signing up with AnimeHub! To get started, please verify your email by clicking the button below:</p>
            <a href="${process.env.BACKEND}/verify/${token}">Verify Your Email</a>
            <p>If the button above doesn't work, you can also copy and paste the following link into your web browser:</p>
            <p><a href="${process.env.BACKEND}/verify/${token}">${process.env.BACKEND}/verify/${token}</a></p>
            <p>If you didn't sign up for an AnimeHub account, please disregard this email.</p>
        </div>
        </body>
  </html>`)
};

module.exports = {
  accountVerification
}