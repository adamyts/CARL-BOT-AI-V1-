// نظام الابلاغ - رقم خاص
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`
📌 *نـظـام الابـلاغ*
استعمل الامر هكذا باش ترسل الابلاغ للمطور:

*مثال:*
${usedPrefix + command} البوت ما كيحملش فيديوهات الانستغرام
`)

  // رقم المطور الخاص
  let developerNumber = '212698498657@s.whatsapp.net'
  
  let user = m.pushName || 'مستخدم مجهول'
  let userId = m.sender.split('@')[0]
  let chatName = m.isGroup ? (await conn.getName(m.chat)) : 'محادثة خاصة'
  
  let reportMsg = `
🚨 *ابـلاغ جـديـد*

👤 *مـن:* ${user}
📱 *الـرقـم:* wa.me/${userId}
💬 *الـمـحـادثـة:* ${chatName}
⏰ *الـوقـت:* ${new Date().toLocaleString('ar-MA')}

📝 *الـمـشـكـل:*
${text}
`.trim()

  try {
    await conn.sendMessage(developerNumber, { text: reportMsg })
    await m.reply(`✅ *تـم ارسـال الابـلاغ بـنـجـاح*\n\nشـكـرا عـلـى الابـلاغ. الـمـطـور غـادي يـسـتـلـم الـرسـالـة ويـتـفـقـد الـمـشـكـل فـاقـرب وقـت مـمـكـن.`)
    console.log(`[Report] تم ارسال ابلاغ من ${userId} للمطور`)
  } catch (e) {
    console.log('[Report Error]', e)
    await m.reply(`⚠️ حـدث خـطـأ: ${e.message}\n\nتـأكـد ان الـبـوت يـقـدر يـرسـل رسـائـل لارقـام خـارجـيـة.`)
  }
}

handler.help = ['report <المشكلة>']
handler.tags = ['معلومات']
handler.command = ['report', 'ابلاغ']
handler.limit = false

export default handler;
