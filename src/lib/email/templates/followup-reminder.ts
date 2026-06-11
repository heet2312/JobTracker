export interface FollowUpReminderData {
  firstName: string
  jobTitle: string
  company: string
  followUpType: string
  subject: string
  content: string
  appUrl: string
}

export function followUpReminderHtml(data: FollowUpReminderData): string {
  const typeLabel: Record<string, string> = {
    '3-day': '3-Day',
    '7-day': '7-Day',
    '14-day': '14-Day',
    'post-interview': 'Post-Interview',
    'custom': 'Custom',
  }
  const label = typeLabel[data.followUpType] ?? data.followUpType

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Follow-up Reminder</title>
  <style>
    body { margin: 0; padding: 0; background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #e5e5e5; }
    .wrapper { max-width: 560px; margin: 40px auto; padding: 0 20px; }
    .card { background: #111111; border: 1px solid #2e2e2e; border-radius: 12px; overflow: hidden; }
    .header { background: #111111; border-bottom: 1px solid #2e2e2e; padding: 24px 28px; }
    .logo { font-size: 14px; font-weight: 600; color: #3b82f6; letter-spacing: -0.3px; }
    .body { padding: 28px; }
    .badge { display: inline-block; background: #1e3a5f; color: #60a5fa; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
    h1 { margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #f0f0f0; line-height: 1.3; }
    .meta { font-size: 13px; color: #71717a; margin-bottom: 24px; }
    .message-box { background: #1a1a1a; border: 1px solid #2e2e2e; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .message-subject { font-size: 13px; font-weight: 600; color: #a1a1aa; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.4px; }
    .message-content { font-size: 14px; color: #d4d4d8; line-height: 1.6; white-space: pre-wrap; }
    .cta { display: inline-block; background: #3b82f6; color: #fff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px; }
    .footer { padding: 20px 28px; border-top: 1px solid #1e1e1e; font-size: 12px; color: #52525b; }
    .footer a { color: #3b82f6; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo">AI Job Tracker</div>
      </div>
      <div class="body">
        <div class="badge">${label} Follow-Up Due</div>
        <h1>Time to follow up on ${data.company}</h1>
        <p class="meta">Hi ${data.firstName} — your ${label.toLowerCase()} follow-up for <strong style="color:#e5e5e5">${data.jobTitle}</strong> at <strong style="color:#e5e5e5">${data.company}</strong> is ready to send.</p>
        <div class="message-box">
          <div class="message-subject">Subject: ${data.subject}</div>
          <div class="message-content">${data.content}</div>
        </div>
        <a href="${data.appUrl}" class="cta">Open in AI Job Tracker →</a>
      </div>
      <div class="footer">
        <p>You're receiving this because follow-up reminders are enabled. <a href="${data.appUrl}/settings">Manage preferences</a></p>
      </div>
    </div>
  </div>
</body>
</html>`
}

export function followUpReminderText(data: FollowUpReminderData): string {
  return `Hi ${data.firstName},

Your follow-up for ${data.jobTitle} at ${data.company} is due today.

Subject: ${data.subject}

${data.content}

Open in AI Job Tracker: ${data.appUrl}

---
Manage preferences: ${data.appUrl}/settings
`
}
