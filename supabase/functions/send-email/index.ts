import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import ResetPasswordEmail from './_templates/reset-password.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 })
  }

  if (!hookSecret) {
    console.error('SEND_EMAIL_HOOK_SECRET is not set')
    return new Response(JSON.stringify({ error: 'Missing hook secret' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    // Extract the actual secret part if it's in the format "v1,whsec_..."
    const cleanSecret = hookSecret.startsWith('v1,whsec_') 
      ? hookSecret.split(',')[1].replace('whsec_', '')
      : hookSecret
    
    const wh = new Webhook(cleanSecret)

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: { email: string }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
      }
    }

    // Only handle password recovery emails here
    if (email_action_type !== 'recovery') {
      return new Response(JSON.stringify({ status: 'ignored' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const html = await renderAsync(
      React.createElement(ResetPasswordEmail, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
        token,
        token_hash,
        redirect_to,
        email_action_type,
      })
    )

    const { error } = await resend.emails.send({
      from: 'Lovable <noreply@contact.rolinko.com>',
      to: [user.email],
      subject: 'Reset your password',
      html,
    })

    if (error) throw error

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.log(error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code,
          message: error.message,
        },
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
