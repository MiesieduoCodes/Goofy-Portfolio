# Contact Form Setup Guide

## 🚀 Your Contact Form is Almost Ready!

Your contact form is now fully functional and just needs the Resend API key to start sending emails.

## 📧 Step-by-Step Setup

### 1. Get Your Resend API Key

1. **Sign up for Resend**: Go to [https://resend.com](https://resend.com)
2. **Create an account** (it's free!)
3. **Get your API key**: 
   - Go to Dashboard → API Keys
   - Click "Create API Key"
   - Copy the key (starts with `re_`)

### 2. Add API Key to Your Project

1. **Open `.env.local`** file in your project
2. **Replace the placeholder** with your actual API key:

```bash
# Before
RESEND_API_KEY=your_resend_api_key_here

# After
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Restart Your Development Server

```bash
npm run dev
```

## ✅ What You'll Get

### 📨 Professional Email Templates
- **Beautiful HTML emails** with your contact form submissions
- **Organized information** (name, email, subject, message)
- **Reply-to functionality** - just hit reply to respond to the sender
- **Professional branding** with your portfolio theme

### 🛡️ Security & Validation
- **Server-side validation** with Zod
- **Spam protection** 
- **Error handling** for failed sends
- **Rate limiting** ready (can be added)

### 🎯 User Experience
- **Loading states** during submission
- **Success messages** when email is sent
- **Error messages** if something goes wrong
- **Form clears** after successful submission

## 📧 Email Example

You'll receive emails that look like this:

```
Subject: New Contact: Project Inquiry

From: Portfolio Contact <onboarding@resend.dev>

[Beautiful HTML Email with:]
- Contact Details (Name, Email, Subject)
- Message Content
- Reply-to link to sender
```

## 🔧 Advanced Options (Optional)

### Custom Domain Email
Once you have a custom domain, you can:
1. **Verify your domain** in Resend
2. **Send from** `contact@yourdomain.com` instead of `onboarding@resend.dev`

### Auto-Reply to Users
Add an auto-reply email to the sender:
```typescript
// Add this after the main email send
await resend.emails.send({
  from: 'Portfolio Contact <onboarding@resend.dev>',
  to: [validatedData.email],
  subject: 'Thank you for your message!',
  html: 'Thank you for reaching out. I\'ll get back to you soon!'
})
```

## 🎉 Ready to Test!

1. **Get your Resend API key**
2. **Add it to `.env.local`**
3. **Restart your server**
4. **Test the contact form**

You'll receive your first contact form submission in your inbox! 🚀

## 💡 Pro Tips

- **Check your spam folder** for the first test email
- **Resend free tier**: 3,000 emails/month
- **Monitor usage** in your Resend dashboard
- **Custom domain** looks more professional

---

**Need help?** Check the Resend documentation or let me know!
