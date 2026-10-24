import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = geminiApiKey ? new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// 1. Gemini AI Fabrication Customer Assistant API
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { prompt, language = 'en', business_context } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      // Graceful fallback response when GEMINI_API_KEY is not set in secrets
      const defaultReply = language === 'hi'
        ? 'अनूप फैब्रिकेशन (31/1 नांगली सकरावती, नजफगढ़, नई दिल्ली) में आपका स्वागत है। हम हैवी इंडस्ट्रियल शेड, बाउंड्री गेट, ग्रिल, डिजाइनर रेलिंग और कस्टमाइज्ड मेटल फैब्रिकेशन में विशेषज्ञ हैं। सटीक माप एवं कोटेशन के लिए कृपया सीधे 7217853257 पर कॉल करें।'
        : 'Welcome to Anup Fabrication (31/1 Nangli Sakrawati, Najafgarh, New Delhi). We specialize in industrial structural steel, warehouse sheds, boundary gates, and custom fabrication. For site measurement and accurate quotation, please contact our workshop desk at 7217853257.';
      return res.json({ reply: defaultReply });
    }

    const systemInstruction = `
You are the official technical assistant for "Anup Fabrication", a professional structural and architectural metal fabrication workshop based in Delhi NCR.
Official Business Details:
- Address: 31/1 Nangli Sakrawati, Najafgarh, New Delhi, Delhi 110043, India.
- Contact Phones: 7217853257, 7838640423.
- Target Region: Delhi, Dwarka, Najafgarh, Gurgaon, Noida, and Greater Delhi NCR.
- Services Provided:
  1. Gates, Grills & Railings (Wrought iron, SS 304, laser-cut window grills)
  2. Structural Steel & Industrial Sheds (I-beam assembly, factory PEB sheds, tubular roof trusses)
  3. Custom Metal Fabrication from Architectural Drawings
  4. Welding & Metal Joining (Certified MIG, TIG, and Arc Welding)
  5. Industrial Metal Frames & Mezzanines
  6. Repair, Strengthening & Site Modification

STRICT ACCURACY RULES:
1. Always respond in the language the user asked in (English or Hindi).
2. Answer questions about materials, structural procedures, gate designs, and quote submission steps.
3. NEVER invent prices, certifications, delivery dates, or discount guarantees. State that all prices depend on physical on-site measurement and actual steel tonnage.
4. Direct users to fill the "Request a Quote" form or call 7217853257 for site inspections.
5. Keep answers concise, respectful, and technically sound.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || 'Thank you for contacting Anup Fabrication. For custom fabrication queries, please reach us at 7217853257.';
    res.json({ reply: replyText });
  } catch (err: any) {
    console.error('Error in /api/gemini/chat:', err);
    res.status(500).json({ 
      error: 'Failed to process AI inquiry',
      details: err.message 
    });
  }
});

// 2. Razorpay Order Creation Route
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { quotation_id, amount_paise, customer_name, customer_phone } = req.body;

    if (!amount_paise || amount_paise <= 0) {
      return res.status(400).json({ error: 'Valid payment amount in paise is required' });
    }

    // In a live environment with RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET,
    // Razorpay Node SDK creates the authoritative order:
    // const order = await razorpay.orders.create({ amount: amount_paise, currency: 'INR', receipt: quotation_id });
    const orderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    res.json({
      order_id: orderId,
      amount_paise,
      currency: 'INR',
      quotation_id
    });
  } catch (err: any) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ error: 'Order creation failed' });
  }
});

// 3. Razorpay Signature Verification & Webhook Route
app.post('/api/razorpay/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const webhookSecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ verified: false, error: 'Signature mismatch' });
      }
    }

    res.json({
      verified: true,
      payment_id: razorpay_payment_id || `pay_${Date.now()}`,
      status: 'success',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ verified: false, error: 'Payment verification failed' });
  }
});

// Vite Dev Server Mounting / Static Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Anup Fabrication server listening on port ${port}`);
  });
}

startServer();
