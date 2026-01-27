export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'sandeep@pixelary.io', name: 'Sandeep Chandran' }],
          },
        ],
        from: {
          email: 'noreply@pixelary.io',
          name: 'Pixelary Contact Form',
        },
        reply_to: {
          email: email,
          name: name,
        },
        subject: `New Contact Form Submission from ${name}`,
        content: [
          {
            type: 'text/plain',
            value: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          },
        ],
      }),
    });

    if (response.ok) {
      return Response.redirect('https://pixelary.io/?success=true', 303);
    } else {
      return Response.redirect('https://pixelary.io/?error=true', 303);
    }
  } catch (error) {
    return Response.redirect('https://pixelary.io/?error=true', 303);
  }
}
