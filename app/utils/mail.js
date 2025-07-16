import nodemailer from 'nodemailer'
import { EMAIL_USER, EMAIL_PASSWORD } from '../config/config.js'
import { text } from 'express'
const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    }
})

export const sendMail = (to, subject, html)=>{
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject,
        text,
        html
    };

    return transport.sendMail(mailOptions)
}