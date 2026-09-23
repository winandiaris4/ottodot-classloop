import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY

export const resend = resendApiKey ? new Resend(resendApiKey) : null

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.RESEND_FROM_EMAIL || 'ClassLoop <notifications@ottodot.winamus.com>',
}: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!resend) {
    console.log(`[Resend Mock Email] To: ${Array.isArray(to) ? to.join(', ') : to} | Subject: ${subject}`)
    return { success: true, id: `mock-${Date.now()}` }
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('[Resend Error]', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err: any) {
    console.error('[Resend Exception]', err)
    return { success: false, error: err.message || 'Failed to dispatch email' }
  }
}

