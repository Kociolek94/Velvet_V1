import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    const payload = await req.json()
    console.log('--- NOTIFICATION PAYLOAD ---', JSON.stringify(payload, null, 2))
    
    const { record, type } = payload

    if (!record || type !== 'INSERT') {
      console.log('Ignoring non-insert event:', type)
      return new Response(JSON.stringify({ message: 'Ignore non-insert event' }), { status: 200 })
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Pobieramy email adresata
    const { data: emailData, error: emailError } = await supabase.rpc('get_user_email', {
      user_id: record.user_id
    })

    if (emailError || !emailData) {
      console.error('Error fetching receiver email for user_id:', record.user_id, emailError)
      return new Response(JSON.stringify({ error: 'Could not fetch receiver email' }), { status: 500 })
    }

    console.log('Sending email to:', emailData)

    // 2. Pobieramy couple_id odbiorcy, aby znaleźć partnera (nadawcę)
    const { data: receiverProfile } = await supabase
      .from('profiles')
      .select('couple_id')
      .eq('id', record.user_id)
      .single()

    const coupleId = receiverProfile?.couple_id

    // 3. Pobieramy nazwę nadawcy (partnera)
    let senderName = 'Twój Partner'
    if (coupleId) {
      const { data: senderProfile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('couple_id', coupleId)
        .neq('id', record.user_id)
        .maybeSingle()
      
      if (senderProfile?.display_name) {
        senderName = senderProfile.display_name
      }
    }

    // 4. Dynamiczny temat wiadomości oparty na typie
    let subject = `[Velvet] ${record.title}`
    let emoji = '🔔'

    switch (record.type) {
      case 'spark':
        subject = `✨ Ktoś o Tobie myśli... Spark od ${senderName}`
        emoji = '✨'
        break
      case 'check_in':
        subject = `📈 Jak minął Twój dzień? ${senderName} już sprawdził!`
        emoji = '📈'
        break
      case 'diary':
        subject = `📖 Wspólne wspomnienie: Nowy wpis od ${senderName}`
        emoji = '📖'
        break
      case 'analysis':
        subject = `🧠 Velvet Engine: Nowy wgląd w Waszą relację`
        emoji = '🧠'
        break
      case 'bucket':
        subject = `🌟 Nowe marzenie na liście od ${senderName}!`
        emoji = '🌟'
        break
      case 'wish':
        subject = `🎁 Małe życzenie... Sprawdź w Velvet`
        emoji = '🎁'
        break
      case 'issue':
        subject = `💬 Safe Space: Ważna wiadomość od ${senderName}`
        emoji = '💬'
        break
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
          <meta charset="UTF-8">
          <title>Powiadomienie Velvet</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0A0E14; font-family: sans-serif; color: #FFFFFF;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 40px auto; background-color: #0A0E14; border: 1px solid #4A0E0E; border-radius: 16px; overflow: hidden;">
              <tr>
                  <td style="background-color: #4A0E0E; padding: 40px; text-align: center;">
                      <h1 style="margin: 0; color: #D4AF37; font-size: 28px; letter-spacing: 6px; text-transform: uppercase; font-weight: 300;">VELVET</h1>
                      <p style="color: #D4AF37; font-size: 10px; letter-spacing: 2px; margin-top: 10px; opacity: 0.8;">PREMIUM RELATIONSHIP SPACE</p>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 50px 40px;">
                      <div style="text-align: center; margin-bottom: 30px;">
                        <span style="font-size: 40px;">${emoji}</span>
                      </div>
                      <h2 style="color: #D4AF37; margin-bottom: 25px; text-align: center; font-weight: 400;">Witaj w Velvet,</h2>
                      <p style="font-size: 16px; line-height: 1.8; color: #E5E7EB; text-align: center; margin-bottom: 30px;">
                          ${senderName} przesłał Ci nową wiadomość w Waszej intymnej przestrzeni.
                      </p>
                      <div style="background-color: rgba(74, 14, 14, 0.4); border-top: 1px solid rgba(212, 175, 55, 0.2); border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding: 30px; margin: 30px 0; text-align: center;">
                          <p style="margin: 0; font-weight: bold; color: #D4AF37; font-size: 18px; margin-bottom: 10px;">${record.title}</p>
                          <p style="margin: 0; font-style: italic; color: #E5E7EB; line-height: 1.6;">"${record.content || 'Zobacz szczegóły w aplikacji.'}"</p>
                      </div>
                      <div style="text-align: center; margin-top: 45px;">
                          <a href="${record.link || 'https://velvet-app.com/dashboard'}" style="background-color: #D4AF37; color: #0A0E14; padding: 16px 45px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; letter-spacing: 1px; text-transform: uppercase; font-size: 12px;">OTWÓRZ APLIKACJĘ</a>
                      </div>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 30px; text-align: center; font-size: 11px; color: #6B7280; border-top: 1px solid rgba(74, 14, 14, 0.5); background-color: rgba(0,0,0,0.2);">
                      <p style="margin-bottom: 10px;">Wiadomość wysłana bezpiecznie z Twojej intymnej przestrzeni relacji.</p>
                      <p>&copy; 2026 Velvet. Projekt klasy Premium.</p>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `

    // 5. Wysyłamy maila przez Brevo
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Velvet', email: 'kociol1994@gmail.com' },
        to: [{ email: emailData }],
        subject: subject,
        htmlContent: htmlContent
      })
    })

    const resData = await res.json()
    console.log('--- BREVO RESPONSE ---', JSON.stringify(resData, null, 2))

    return new Response(JSON.stringify(resData), { 
      status: res.status, 
      headers: { 'Content-Type': 'application/json' } 
    })

  } catch (err) {
    console.error('Edge Function Error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
