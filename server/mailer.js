import nodemailer from 'nodemailer';


// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'amnyamfitnessstore@gmail.com',
    pass: 'vspt zwip pbkr smhi', // Not your Gmail password, use an app-specific password
  },
});

export default transporter