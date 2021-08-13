const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sgMail.send({
    from : 'hello@greentickets.ng',
    to : 'damilolaedwards@gmail.com',
    subject : 'Sent from GreenTickets',
    text : 'Just checking up on you. hope you get my message'
}).then(() => {
    console.log('Email sent!')
}).catch((e) => {
    console.log('something went wrong')
})