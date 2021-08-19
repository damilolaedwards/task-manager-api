const sgMail = require('@sendgrid/mail')
const handlebars = require('handlebars')
const fs = require('fs')
const util = require('util')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const readFile = util.promisify(fs.readFile);

const readHTMLFile = (email_content) => {
  return readFile(__dirname + '/views/' + email_content + '.html');
}



const sendWelcomeEmail = async (user) => {
    const mail_content = await readHTMLFile('welcome')
    const template  = handlebars.compile(mail_content.toString())
    const email = template({
        name: user.name
   })
    sgMail.send({
        from : {
            email : 'hello@greentickets.ng',
            name : 'Green Tickets'
        },
        to : 'damilolaedwards@gmail.com',
        subject : 'Welcome to GreenTickets',
        html : email,
    

    })
}


module.exports = {sendWelcomeEmail}
