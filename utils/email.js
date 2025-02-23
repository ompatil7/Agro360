// const nodemailer = require("nodemailer");
// const pug = require("pug");
// // const htmlToText = require('html-to-text');
// const { convert } = require("html-to-text");

// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(" ")[0];
//     //the url is ooming from the authcontroller
//     this.url = url;
//     this.from = `PRUTHVIJ DESAI <${process.env.EMAIL_FROM}>`;
//   }

//   newTransport() {
//     return nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.GMAIL_ADDRESS,
//         pass: process.env.GMAIL_APP_PASSWORD,
//       },
//     });
//   }

//   // Send the actual email
//   async send(template, subject, booking, user) {
//     console.log("First Name:", this.firstName); // Log the firstName
//     const html = pug.renderFile(`${__dirname}/../email/${template}.pug`, {
//       firstName: this.firstName,
//       url: this.url,
//       subject,
//       user,
//     });

//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text: convert(html),
//     };

//     await this.newTransport().sendMail(mailOptions);
//   }
//   async sendBookingReceipt(booking) {
//     await this.send("receipt", "Booking Receipt", booking);
//   }

//   async sendWelcome() {
//     await this.send("welcome", "Welcome to the  Family!");
//   }

//   async sendPasswordReset() {
//     await this.send(
//       "passwordReset",
//       "Your password reset token (valid for only 10 minutes)"
//     );
//   }
// };
const nodemailer = require("nodemailer");
const pug = require("pug");
const { convert } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;

    this.from = `PRUTHVIJ DESAI <${process.env.GMAIL_ADDRESS}>`;
  }

  newTransport() {
    if (!process.env.GMAIL_ADDRESS || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error("Gmail credentials are missing in environment variables");
    }

    return nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Send the actual email
  async send(template, subject, booking, user) {
    try {
      console.log("Attempting to send email to:", this.to);
      console.log("Using Gmail address:", process.env.GMAIL_ADDRESS);

      const html = pug.renderFile(`${__dirname}/../email/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        subject,
        user,
        booking,
      });

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: convert(html),
        headers: {
          Priority: "High",
          "X-MS-Exchange-Organization-BypassFocusedInbox": "true",
          "X-Priority": "1",
          Importance: "high",
        },
      };

      const result = await this.newTransport().sendMail(mailOptions);
      console.log("Email sent successfully:", result);
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to CropGuard Assurance! 🌾");
  }
  async sendBookingReceipt(booking) {
    await this.send("receipt", "Insurance Premium Payment Receipt", booking);
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};
