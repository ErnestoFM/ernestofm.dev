import { sendContactEmail } from '@/services/mail-service';

const mockSendMail = jest.fn();

jest.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(() => ({
      sendMail: mockSendMail,
    })),
  },
}));

describe('mail-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMail.mockResolvedValue({ messageId: 'test-123' });
    process.env.MAIL_FROM = 'contact@ernestofm.dev';
    process.env.MAIL_TO = 'hello@ernestofm.dev';
  });

  describe('sendContactEmail', () => {
    it('sends an email with correct fields', async () => {
      await sendContactEmail({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Hello',
        message: 'This is a test message',
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'hello@ernestofm.dev',
          replyTo: 'test@example.com',
          subject: '[Portfolio] Hello',
        })
      );
    });

    it('throws when transporter fails', async () => {
      mockSendMail.mockRejectedValueOnce(new Error('SMTP error'));

      await expect(
        sendContactEmail({
          name: 'User',
          email: 'user@test.com',
          subject: 'Sub',
          message: 'Msg',
        })
      ).rejects.toThrow('SMTP error');
    });
  });
});
