// Intercepts nodemailer.createTransport so mailSender can run in tests
// without touching SMTP. Use in controller integration tests that exercise
// endpoints which send email (allocateLocker, renewLocker, cancelLocker,
// editLockerDetails, issue emails in C8 later).
//
// Usage:
//   const { installMailMock } = require('../helpers/mockMailer.js');
//   let mail;
//   beforeEach(() => { mail = installMailMock(); });
//   afterEach(() => { mail.restore(); });
//   // assert: expect(mail.sendMail).toHaveBeenCalledWith(...)

const nodemailer = require('nodemailer');

function installMailMock() {
    const sendMail = vi.fn().mockResolvedValue({ messageId: 'mock-message-id' });
    const spy = vi
        .spyOn(nodemailer, 'createTransport')
        .mockReturnValue({ sendMail });
    return {
        sendMail,
        restore: () => spy.mockRestore(),
    };
}

module.exports = { installMailMock };
