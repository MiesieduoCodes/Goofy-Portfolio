import { Resend } from 'resend'

// Test your Resend API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_6Afeoyet_CfJpu2mJJci2aJzEDNwbiazB')

async function testResend() {
  console.log('Testing Resend API...')
  
  if (!process.env.RESEND_API_KEY) {
    console.log('Using hardcoded API key for testing...')
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['miesieduoveria@gmail.com'],
      subject: 'Test: Resend API Working!',
      html: '<p>This is a test email to verify your Resend API is working correctly.</p>',
    })

    if (error) {
      console.error('❌ Resend Error:', {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode
      })
    } else {
      console.log('✅ Email sent successfully!', data)
    }
  } catch (err) {
    console.error('❌ Test failed:', err)
  }
}

testResend()
