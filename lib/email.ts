import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailReminder(to: string, subject: string, message: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY missing. Email not sent.');
        return;
    }

    try {
        const data = await resend.emails.send({
            from: 'AURA Assistant <aura@updates.antigravity.ai>',
            to: [to],
            subject: `[AURA] ${subject}`,
            html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #09090B; color: #ffffff; border-radius: 20px;">
          <h1 style="color: #B4DBC0; font-style: italic;">AURA REMINDER</h1>
          <p style="font-size: 16px; line-height: 1.6;">${message}</p>
          <hr style="border: 0; border-top: 1px solid #ffffff10; margin: 20px 0;" />
          <p style="font-size: 10px; color: #ffffff40; text-transform: uppercase; letter-spacing: 2px;">System Status: Secure // Neural Link Active</p>
        </div>
      `,
        });

        return data;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}
