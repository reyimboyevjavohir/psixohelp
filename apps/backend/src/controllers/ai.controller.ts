import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { ok, fail } from '../utils/response.js';

export async function getAiAdvice(req: Request, res: Response) {
  try {
    const { message, history } = req.body as {
      message: string;
      history?: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
    };

    if (!message || message.trim().length === 0) {
      res.status(400).json(fail("Xabar bo'sh bo'lishi mumkin emas"));
      return;
    }

    if (message.trim().length > 1000) {
      res.status(400).json(fail('Xabar 1000 belgidan oshmasin'));
      return;
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      res.status(503).json(fail('AI xizmati hozircha mavjud emas'));
      return;
    }

    const crisisWords = [
      "o'zini o'ldirmoq", "o'limni o'ylamoq", 'hayotdan charchab', "tiriklikdan to'yib",
      'yashashni xohlamayman', "o'lmoqchi", 'suitsid', 'inqiroz', "o'ziga zarar"
    ];
    const isCrisis = crisisWords.some(w => message.toLowerCase().includes(w));

    if (isCrisis) {
      res.json(ok({
        reply: "Sizning his-tuyg'ularingiz menga juda muhim. Bu qiyin vaziyatda ekanligingizni tushunaman.\n\n🆘 **Iltimos, hoziroq yordam oling:**\n- Telefon: **1050** (Ishonch telefoni)\n- Yaqinlaringizdan biriga murojaat qiling\n- Platformamizdagi psixolog bilan tezda seans band qiling\n\nSiz yolg'iz emassiz. Professional yordam olish — kuchlilik belgisi.",
        isCrisis: true,
      }, 'Krizis aniqlandi'));
      return;
    }

    const systemPrompt = `Siz "PsixoHelp" platformasining psixologik yordam assistentiSiz.
Kognitiv-xulq-atvor terapiyasi (CBT) tamoyillariga asoslanib, foydalanuvchilarga O'zbek tilida yordam berasiz.

QOIDALAR:
1. Faqat o'zbek tilida javob bering
2. Ishlatiladigan uslub: iliq, empatik, professional
3. Tashxis qo'ymang — faqat tavsiyalar bering
4. Har bir javob 3-5 jumladan iborat bo'lsin
5. Zarur bo'lsa professional psixologga murojaat qilishni tavsiya eting
6. Javobni hech qachon "AI sifatida" yoki "dastur sifatida" boshlamang
7. Foydalanuvchini ism bilan chaqirmang

Siz faqat psixologik sohadagi savollariga javob berasiz. Boshqa mavzularda: "Bu savolga javob bera olmayman, lekin ruhiy salomatlik haqida savollaringiz bo'lsa yordam berishga tayyorman" deya xush muomala bilan rad eting.`;

    const chatHistory = Array.isArray(history) ? history.slice(-10) : [];
    const messages = [
      ...chatHistory.map((h: { role: string; parts: Array<{ text: string }> }) => ({
        role: h.role === 'model' ? 'assistant' : 'user',
        content: h.parts[0]?.text || '',
      })),
      { role: 'user', content: message },
    ];

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 512,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('[AI advice Groq error]:', errText);
      res.status(502).json(fail("AI javob bera olmadi. Qaytadan urinib ko'ring."));
      return;
    }

    const groqData = await groqRes.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const reply = groqData?.choices?.[0]?.message?.content;
    if (!reply) {
      res.status(502).json(fail('AI hozircha javob bera olmadi.'));
      return;
    }

    if (req.auth?.userId) {
      prisma.user.findUnique({ where: { id: req.auth.userId }, select: { id: true } })
        .catch(() => {});
    }

    res.json(ok({ reply, isCrisis: false }, 'AI javobi'));
  } catch (e) {
    console.error('[getAiAdvice]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}
