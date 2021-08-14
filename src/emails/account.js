const sgMail = require('@sendgrid/mail')
var handlebars = require('handlebars')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const readHTMLFile = async (email_content) => {
    try {
        const path = './views' + email_content + '.html'
        const file = await fs.readFile(path, {encoding: 'utf-8'}) 
        return file
    } catch (error) {
        return  console.log(error)
    }
   
}

const emailToSend = async (content, variables = {}) => {
    const html = await readHTMLFile(content)
    const template = await handlebars.compile(html)
    const replacements = variables
    const emailContent = template(replacements)
    return emailContent
}



const sendWelcomeEmail = (user) => {
    const email = await emailToSend('welcome', user)
    sgMail.send({
        from : 'hello@greentickets.ng',
        to : 'damilolaedwards@gmail.com',
        subject : 'Sent from GreenTickets',
        html : email
    })
}
