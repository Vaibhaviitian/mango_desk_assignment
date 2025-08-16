import e from "express";
import Groq from "groq-sdk";
import nodemailer from "nodemailer";
const getAiResponse = async (req, res) => {
  try {
    const groq = new Groq({
      apiKey: `${process.env.GROQ_API_KEY}`,
    });
    const { text } = req.body;
    console.log(text);
    if (!text) {
      return res
        .status(400)
        .json({ response: false, message: "Text is required" });
    }
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarise text according to user instructions efficiently. ",
        },
        {
          role: "user",
          content: `Please summarise the following text: ${text}`,
        },
      ],
      max_tokens: 500,
    });

    const summary = response.choices[0].message.content;
    return res.status(200).json({ response: true, summary });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      response: false,
      message: `Failed to get AI response ${error.message}`,
    });
  }
};
const sendEmail = async (req, res) => {
  try {
    const { recipientEmail, summary } = req.body;
    if (!recipientEmail || !summary) {
      return res.status(400).json({
        response: false,
        message: "Recipient email and summary are required",
      });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL ,
        pass: process.env.USER_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"AI Summariser " <${process.env.USER_EMAIL}>`,
      to: recipientEmail,
      subject: `AI powered notes summarizer`,
      text: summary,
      html: `<div>${summary.replace(/\n/g, "<br>")}</div>`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      response: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      response: false,
      message: `Failed to send email ${error.message}`,
    });
  }
};
export { getAiResponse, sendEmail };
