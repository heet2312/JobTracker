export interface WeeklyDigestData {
  firstName: string
  weekStart: string
  weekEnd: string
  totalApplications: number
  newThisWeek: number
  activeApplications: number
  pendingFollowUps: number
  stageChanges: number
  topStages: Array<{ stage: string; count: number }>
  appUrl: string
}

const stageLabel: Record<string, string> = {
  saved: 'Saved',
  interested: 'Interested',
  applied: 'Applied',
  assessment: 'Assessment',
  screening: 'Screening',
  interview_1: 'Interview Round 1',
  interview_2: 'Interview Round 2',
  final: 'Final Interview',
  offer: 'Offer',
  accepted: 'Accepted',
  rejected: 'Rejected',
  ghosted: 'Ghosted',
  withdrawn: 'Withdrawn',
}

function statBlock(value: number | string, label: string): string {
  return `<td style="text-align:center;padding:16px 12px;">
    <div style="font-size:28px;font-weight:700;color:#f0f0f0;font-variant-numeric:tabular-nums;">${value}</div>
    <div style="font-size:11px;color:#71717a;margin-top:4px;text-transform:uppercase;letter-spacing:0.5px;">${label}</div>
  </td>`
}

export function weeklyDigestHtml(data: WeeklyDigestData): string {
  const stageRows = data.topStages
    .map(
      ({ stage, count }) =>
        `<tr>
          <td style="padding:8px 0;font-size:13px;color:#d4d4d8;">${stageLabel[stage] ?? stage}</td>
          <td style="padding:8px 0;font-size:13px;color:#f0f0f0;font-weight:600;text-align:right;">${count}</td>
        </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Weekly Job Search Digest</title>
  <style>
    body { margin: 0; padding: 0; background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #e5e5e5; }
    .wrapper { max-width: 560px; margin: 40px auto; padding: 0 20px; }
    .card { background: #111111; border: 1px solid #2e2e2e; border-radius: 12px; overflow: hidden; }
    .header { background: #111111; border-bottom: 1px solid #2e2e2e; padding: 24px 28px; display: flex; align-items: center; justify-content: space-between; }
    .logo { font-size: 14px; font-weight: 600; color: #3b82f6; }
    .week-label { font-size: 12px; color: #52525b; }
    .body { padding: 28px; }
    h1 { margin: 0 0 4px; font-size: 22px; font-weight: 700; color: #f0f0f0; }
    .subtitle { font-size: 13px; color: #71717a; margin-bottom: 28px; }
    .stats-table { width: 100%; background: #161616; border: 1px solid #2e2e2e; border-radius: 10px; border-collapse: collapse; overflow: hidden; margin-bottom: 24px; }
    .section-title { font-size: 11px; font-weight: 600; color: #52525b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px; }
    .pipeline-table { width: 100%; border-collapse: collapse; }
    .cta { display: inline-block; background: #3b82f6; color: #fff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px; margin-top: 8px; }
    .divider { border: none; border-top: 1px solid #1e1e1e; margin: 24px 0; }
    .footer { padding: 20px 28px; border-top: 1px solid #1e1e1e; font-size: 12px; color: #52525b; }
    .footer a { color: #3b82f6; text-decoration: none; }
    .followup-alert { background: #1c1410; border: 1px solid #78350f40; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px; font-size: 13px; color: #fbbf24; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo">AI Job Tracker</div>
        <div class="week-label">${data.weekStart} – ${data.weekEnd}</div>
      </div>
      <div class="body">
        <h1>Your weekly digest, ${data.firstName}</h1>
        <p class="subtitle">Here's a snapshot of your job search this week.</p>

        <table class="stats-table">
          <tr>
            ${statBlock(data.totalApplications, 'Total')}
            ${statBlock(data.newThisWeek, 'New this week')}
            ${statBlock(data.activeApplications, 'Active')}
            ${statBlock(data.stageChanges, 'Stage changes')}
          </tr>
        </table>

        ${
          data.pendingFollowUps > 0
            ? `<div class="followup-alert">
            ⏰ You have <strong>${data.pendingFollowUps} pending follow-up${data.pendingFollowUps !== 1 ? 's' : ''}</strong> waiting to be sent.
          </div>`
            : ''
        }

        ${
          data.topStages.length > 0
            ? `<div class="section-title">Applications by stage</div>
          <table class="pipeline-table">
            ${stageRows}
          </table>
          <hr class="divider" />`
            : ''
        }

        <a href="${data.appUrl}/dashboard" class="cta">View your dashboard →</a>
      </div>
      <div class="footer">
        <p>You're receiving this weekly digest because it's enabled in your settings. <a href="${data.appUrl}/settings">Manage preferences</a></p>
      </div>
    </div>
  </div>
</body>
</html>`
}

export function weeklyDigestText(data: WeeklyDigestData): string {
  const stageLines = data.topStages
    .map(({ stage, count }) => `  ${stageLabel[stage] ?? stage}: ${count}`)
    .join('\n')

  return `Weekly Job Search Digest (${data.weekStart} – ${data.weekEnd})

Hi ${data.firstName},

THIS WEEK AT A GLANCE
─────────────────────
Total applications: ${data.totalApplications}
New this week:      ${data.newThisWeek}
Active:             ${data.activeApplications}
Stage changes:      ${data.stageChanges}
${data.pendingFollowUps > 0 ? `\n⏰ Pending follow-ups: ${data.pendingFollowUps}` : ''}

APPLICATIONS BY STAGE
─────────────────────
${stageLines || '  No active applications'}

View your dashboard: ${data.appUrl}/dashboard

---
Manage preferences: ${data.appUrl}/settings
`
}
