const nodemailer = require("nodemailer");

const sendMail = async (
  senderName,
  senderEmail,
  receiverEmail,
  hostingName,
  renewalDate,
  client_name,
  smtpHost,
  smtpPort,
  smtpUsername,
  smtpPassword
) => {
  try {
    // connect with the smtp
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    const subject = `Welcome Aboard`;

    await transporter.sendMail({
      from: `"Techies Infotech" <${senderEmail}>`,
      to: receiverEmail,
      subject: subject,
      html: `<div><h1>Hello</h1></div>`,
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendMail;
