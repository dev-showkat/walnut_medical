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

    const subject = `Hello ${receiverEmail}, Your ${hostingName} Is Expire on ${renewalDate}`;

    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: receiverEmail,
      subject: subject,
      text: `your ${hostingName} will expire on ${renewalDate}.`,
      html: `<b>Hello,</b><br><p>${client_name} your ${hostingName} hosting will expire on ${renewalDate}.</p>`,
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendMail;
