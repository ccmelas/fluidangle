const pug = require('pug');
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

/**
 * Handles mails
 */
class MailHandler {
  /**
   * Genertes html from a pug file
   * @param {string} fileName
   * @param {object} options
   * @returns { string } [HTML String representation]
   */
  static generateHTML(fileName, options = {}) {
    const html = pug.renderFile(`${__dirname}/../views/${fileName}.pug`, options);
    return html;
  }

  /**
   * Returns nodemailer transport
   * @returns {object} [Nodemailer transport object]
   */
  static createTransort() {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
  }

  /**
   * Sends a mail
   * @param {object} options
   * @return {object} [Mail Promise Object]
   */
  static async send(options) {
    const html = MailHandler.generateHTML(options.fileName, options);
    const text = htmlToText.fromString(html);
    const mailOptions = {
      from: 'FluidAngle <no-reply@fluidangle.com',
      to: options.user.email,
      subject: options.subject,
      html,
      text
    };
    const transport = MailHandler.createTransort();
    return transport.sendMail(mailOptions);
  }
}

module.exports = MailHandler;
