import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailer: MailerService) {}

  // Welcome email with services info and optional PDF attachment
  async sendWelcomeEmail(to: string, name?: string, pdfPath?: string) {
    const subject = 'Welcome to Our Laundry!';
    const text =
      `Hi${name ? ' ' + name : ''},\n` +
      `Thanks for joining our laundry service. We’re happy to have you as a member!\n\n` +
      `Here’s what we offer:\n` +
      `- Laundry by Kg: Bulk laundry handled efficiently.\n` +
      `- Premium Laundry: Special care for delicate garments.\n` +
      `- Steam Ironing: Wrinkle-free finishing for all clothes.\n` +
      `- Dry-Cleaning Services\n` +
      `- Home & Upholstery Cleaning (Sofa & Carpet)\n` +
      `- Footwear & Accessories Care (Shoes & Bags)\n\n` +
      `— Team`;

    const html =
      `<h2>Hi${name ? ' ' + name : ''}, 👋</h2>` +
      `<p>Thanks for joining our laundry service. We’re happy to have you as a member!</p>` +
      `<h3>Our Services:</h3>` +
      `<ul>` +
      `<li><strong>Laundry by Kg:</strong> Bulk laundry handled efficiently.</li>` +
      `<li><strong>Premium Laundry:</strong> Special care for delicate garments.</li>` +
      `<li><strong>Steam Ironing:</strong> Wrinkle-free finishing for all clothes.</li>` +
      `<li><strong>Dry-Cleaning Services</strong></li>` +
      `<li><strong>Home & Upholstery Cleaning:</strong> Sofa & Carpet deep cleaning.</li>` +
      `<li><strong>Footwear & Accessories Care:</strong> Shoes & Bags professional cleaning.</li>` +
      `</ul>` +
      `<p>— Team</p>`;

    const mailOptions: any = { to, subject, text, html };

    // Attach PDF if path is provided
    if (pdfPath) {
      mailOptions.attachments = [
        {
          filename: 'Laundry_Services.pdf',
          path: pdfPath,
          contentType: 'application/pdf',
        },
      ];
    }

    await this.mailer.sendMail(mailOptions);
  }

  // (অপশনাল) লগইন নোটিফিকেশন
  async sendLoginNotice(to: string, name?: string) {
    await this.mailer.sendMail({
      to,
      subject: 'Login Successful',
      text: `Hello${name ? ' ' + name : ''}, you’ve just logged in to your laundry account.`,
    });
  }
}
