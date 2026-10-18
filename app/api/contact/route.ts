import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { contactSchema, emailSubject, escapeHtml } from '@/lib/contact'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables')
      return NextResponse.json(
        { 
          success: false, 
          message: 'Server configuration error. API key not found.' 
        },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Parse the request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 })
    }

    // Validate the form data
    const validatedData = contactSchema.parse(body)
    
    const name = escapeHtml(validatedData.name)
    const email = escapeHtml(validatedData.email)
    const subject = escapeHtml(validatedData.subject)
    const message = escapeHtml(validatedData.message)

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Change this to your domain later
      to: ['miesieduoveria@gmail.com'],
      replyTo: validatedData.email,
      subject: emailSubject(validatedData.subject),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p style="color: #666; font-size: 14px;">
              This message was sent from your portfolio contact form.
            </p>
            <p style="color: #666; font-size: 12px;">
              Reply directly to: <a href="mailto:${email}">${email}</a>
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error details:', {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode
      })
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send email. Please try again later.' 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully! We\'ll get back to you soon.' 
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Contact form error:', error)
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please check your form inputs',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    // Handle other errors
    return NextResponse.json(
      { 
        success: false, 
        message: 'Something went wrong. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Contact API endpoint is working!' },
    { status: 200 }
  )
}
