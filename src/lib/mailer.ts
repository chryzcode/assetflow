import axios, { AxiosError } from "axios";

export const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  const API_KEY = process.env.BREVO_API_KEY as string; // Set your Brevo API Key in .env
  const senderEmail = process.env.SENDER_EMAIL as string; // Must be a verified Brevo sender

  const payload = {
    sender: { name: "The Product Conclave - AssetFlow", email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent,
  };

  try {
    await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        "api-key": API_KEY,
        "Content-Type": "application/json",
      },
    });
    console.log("Email sent successfully via Brevo");
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error sending email:", error.response?.data || error);
    }
    throw new Error("Error sending email");
  }
};
