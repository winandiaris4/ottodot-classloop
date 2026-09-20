export function renderHomeworkAssignedEmail({
  studentName,
  homeworkTitle,
  className,
  dueDate,
  maxScore,
}: {
  studentName: string
  homeworkTitle: string
  className: string
  dueDate?: string | null
  maxScore: number
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
          .header { background: linear-gradient(135deg, #4338ca 0%, #312e81 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
          .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
          .content { padding: 32px 24px; }
          .badge { display: inline-block; padding: 4px 12px; background: #e0e7ff; color: #4338ca; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-bottom: 12px; }
          .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 8px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0; }
          .meta-item { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
          .meta-label { color: #64748b; }
          .meta-val { font-weight: 600; color: #0f172a; }
          .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ClassLoop 🚀</div>
            <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Ottodot Gamified STEM Learning</p>
          </div>
          <div class="content">
            <span class="badge">NEW ASSIGNMENT</span>
            <h1 class="title">New Homework Assigned!</h1>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Hi <strong>${studentName}</strong>, your instructor has published a new homework assignment.
            </p>
            <div class="card">
              <div class="meta-item">
                <span class="meta-label">Course:</span>
                <span class="meta-val">${className}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Task:</span>
                <span class="meta-val">${homeworkTitle}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Max Score:</span>
                <span class="meta-val">${maxScore} pts</span>
              </div>
              ${
                dueDate
                  ? `<div class="meta-item">
                      <span class="meta-label">Due Date:</span>
                      <span class="meta-val">${new Date(dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}</span>
                    </div>`
                  : ''
              }
            </div>
            <p style="font-size: 13px; color: #64748b;">
              Log in to your student dashboard to read the full prompt and submit your response.
            </p>
          </div>
          <div class="footer">
            &copy; 2026 ClassLoop • Ottodot Edtech Platform
          </div>
        </div>
      </body>
    </html>
  `
}

export function renderHomeworkGradedEmail({
  studentName,
  homeworkTitle,
  className,
  score,
  maxScore,
  feedback,
}: {
  studentName: string
  homeworkTitle: string
  className: string
  score: number
  maxScore: number
  feedback?: string | null
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
          .header { background: linear-gradient(135deg, #059669 0%, #065f46 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
          .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
          .content { padding: 32px 24px; }
          .badge { display: inline-block; padding: 4px 12px; background: #dcfce7; color: #059669; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-bottom: 12px; }
          .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 8px; }
          .score-box { background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
          .score-num { font-size: 36px; font-weight: 800; color: #059669; }
          .feedback-box { background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 0 8px 8px 0; padding: 12px 16px; margin: 16px 0; font-style: italic; font-size: 13px; color: #334155; }
          .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ClassLoop 🌟</div>
            <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Academic Evaluation & Feedback</p>
          </div>
          <div class="content">
            <span class="badge">EVALUATION COMPLETED</span>
            <h1 class="title">Homework Graded!</h1>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Hi <strong>${studentName}</strong>, your instructor has graded your assignment for <strong>${className}</strong>.
            </p>
            <div class="score-box">
              <div style="font-size: 12px; font-weight: 600; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">Your Score</div>
              <div class="score-num">${score} <span style="font-size: 18px; color: #64748b; font-weight: 500;">/ ${maxScore} pts</span></div>
            </div>
            ${
              feedback
                ? `<div>
                    <div style="font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Teacher's Feedback:</div>
                    <div class="feedback-box">&ldquo;${feedback}&rdquo;</div>
                  </div>`
                : ''
            }
          </div>
          <div class="footer">
            &copy; 2026 ClassLoop • Ottodot Edtech Platform
          </div>
        </div>
      </body>
    </html>
  `
}
