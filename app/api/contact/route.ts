import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_6Afeoyet_CfJpu2mJJci2aJzEDNwbiazB')

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(request: NextRequest) {
  try {
    // Debug: Check if API key is loaded
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

    console.log('API Key found:', process.env.RESEND_API_KEY.substring(0, 10) + '...')
    
    // Parse the request body
    const body = await request.json()
    
    // Validate the form data
    const validatedData = contactSchema.parse(body)
    
    console.log('Sending email with data:', validatedData)
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Change this to your domain later
      to: ['miesieduoveria@gmail.com'],
      subject: `New Contact: ${validatedData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${validatedData.message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p style="color: #666; font-size: 14px;">
              This message was sent from your portfolio contact form.
            </p>
            <p style="color: #666; font-size: 12px;">
              Reply directly to: <a href="mailto:${validatedData.email}">${validatedData.email}</a>
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
    
    console.log('Email sent successfully:', data)
    
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
