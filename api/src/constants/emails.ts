/**
 * Class to hold templates for custom emails.
 */
export class CustomEmails {
  /**
   * Subject line for confirmation code emails
   */
  public static CONFIRMATION_CODE_SUBJECT = 'Hour Logger | Confirmation Code';

  /**
   * Create a custom confirmation code email for users when they sign up.
   *
   * @param name The users name.
   * @param code The confirmation code.
   * @returns The styled HTML document for the email.
   */
  public static createConfirmationCodeEmail = (name, code) => `<html>
    <body style="background-color:#333; font-family: PT Sans,Trebuchet MS,sans-serif; ">
      <div style="margin: 0 auto; width: 600px; background-color: #fff; font-size: 1.2rem; font-style: normal;font-weight: normal;line-height: 19px; padding: 20" align="center">
        <div style="text-align: left; padding: 20; Margin-left: 20px;">
          <p style="Margin-top: 20px;Margin-bottom: 0;">&nbsp;</p>
          <p style="Margin-top: 20px;">
              Hi ${name},
          </p>

          <p style="Margin-top: 20px;Margin-bottom: 0;font-size: 16px;line-height: 24px; color: #000">
              Thank you for registering for the Sci' Formal Hour Logger! 
          </p>
          <p>Your Confirmation Code is: </p>
          <h2 style="text-align: center;">${code}</h2>
          <p style="Margin-top: 20px;Margin-bottom: 0;">&nbsp;</p>
        </div>
      </div>
    </body>
    </html>`;
}
