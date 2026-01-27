export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    const mailRequest = {
      personalizations: [
        {
          to: [{ email: 'sandeep@pixelary.io', name: 'Sandeep' }],
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
    };

    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailRequest),
    });

    const responseText = await response.text();
    console.log('MailChannels response status:', response.status);
    console.log('MailChannels response:', responseText);

    if (response.status === 202 || response.ok) {
      return Response.redirect('https://pixelary.io/?success=true', 303);
    } else {
      // Return error details for debugging
      return new Response(`Error: ${response.status} - ${responseText}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  } catch (error) {
    return new Response(`Exception: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
