import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, subject, origin, destination, message, type } = req.body;

      console.log("Transmission Received:");
      console.log(`Type: ${type}`);
      console.log(`From: ${name} <${email}>`);
      if (phone) console.log(`Phone: ${phone}`);
      if (subject) console.log(`Subject: ${subject}`);
      if (origin) console.log(`Origin: ${origin}`);
      if (destination) console.log(`Destination: ${destination}`);
      console.log(`Message: ${message}`);
      
      console.log(`Action: Forwarding to info@oceanmasters.com.gh`);

      // NOTE: To actually send emails, you would integrate a service like SendGrid, Mailgun, or Formspree here.
      // Example with SendGrid:
      // await sgMail.send({ to: 'info@oceanmasters.com.gh', from: 'noreply@yourdomain.com', subject: `Contact: ${subject || type}`, text: message });

      res.status(200).json({ 
        status: "success", 
        message: "Transmission received and forwarded to command center." 
      });
    } catch (error) {
      console.error("Transmission Error:", error);
      res.status(500).json({ 
        status: "error", 
        message: "Internal frequency interference. Transmission failed." 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
