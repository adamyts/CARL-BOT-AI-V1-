// نظام الابلاغ - رقم خاص + معرف القناة
let handler = async (m, { conn, text, usedPrefix, command }) => {
  // ===== معلومات القناة =====
  const اسم_القناة = '𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏  ⚽⚡'
  const النشرة = {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
          newsletterJid: '120363410733859643@newsletter', // <<<<<< حط هنا معرف القناة
          newsletterName: اسم_القناة
      }
  }
  // ========================

  if (!text) return m.reply(`
📌 *نـظـام الابـلاغ*
استعمل الامر هكذا باش ترسل الابلاغ للمطور:

*مثال:*
${usedPrefix + command} البوت ما كيحملش فيديوهات الانستغرام
`, null, { contextInfo: النشرة })

  // رقم المطور الخاص
  let رقم_المطور = '212666774170@s.whatsapp.net'
  
  let المستخدم = m.pushName || 'مستخدم مجهول'
  let معرف_المستخدم = m.sender.split('@')[0]
  let اسم_المحادثة = m.isGroup ? (await conn.getName(m.chat)) : 'محادثة خاصة'
  
  let رسالة_الابلاغ = `
🚨 *ابـلاغ جـديـد*

👤 *مـن:* ${المستخدم}
📱 *الـرقـم:* wa.me/${معرف_المستخدم}
💬 *الـمـحـادثـة:* ${اسم_المحادثة}
⏰ *الـوقـت:* ${new Date().toLocaleString('ar-MA')}

📝 *الـمـشـكـل:*
${text}

𝗕𝘆 𝗮𝗱𝗮𝗺.___.𝟵𝟴
`.trim()

  try {
    // 1. نرسلو الابلاغ للمطور بلا contextInfo باش ما يخرجش خطأ
    await conn.sendMessage(رقم_المطور, { text: رسالة_الابلاغ })

    // 2. نرسلو تأكيد للمستخدم بالنشرة
    await m.reply(`✅ *تـم ارسـال الابـلاغ بـنـجـاح*\n\nشـكـرا عـلـى الابـلاغ. الـمـطـور غـادي يـسـتـلـم الـرسـالـة ويـتـفـقـد الـمـشـكـل فـاقـرب وقـت مـمـكـن.`, {
      contextInfo: النشرة
    })
    console.log(`[Report] تم ارسال ابلاغ من ${معرف_المستخدم} للمطور`)
  } catch (خطأ) {
    console.log('[Report Error]', خطأ)
    await m.reply(`⚠️ حـدث خـطـأ: ${خطأ.message}\n\nتـأكـد ان الـبـوت يـقـدر يـرسـل رسـائـل لارقـام خـارجـيـة.`, {
      contextInfo: النشرة
    })
  }
}

handler.help = ['ابلاغ <المشكلة>', 'report <المشكلة>']
handler.tags = ['معلومات']
handler.command = ['report', 'ابلاغ']
handler.limit = false

export default handler
