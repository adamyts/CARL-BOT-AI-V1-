// نظام الدعم - للمطور فقط
let handler = async (m, { conn, text, usedPrefix, command }) => {
  // ===== معلومات القناة =====
  const اسم_القناة = '𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏'
  const الانستغرام = 'adam.__.98' // انستا ديالك
  const النشرة = {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
          newsletterJid: '120363410733859643@newsletter', // <<<<<< حط هنا معرف القناة
          newsletterName: اسم_القناة
      }
  }
  // ========================

  let معرف_المجموعة = '120363428683634355@g.us' // معرف الكروب الرسمي
  let رقم_المطور = '212698498657@s.whatsapp.net'

  // ===== حماية: المطور فقط =====
  if (![رقم_المطور].includes(m.sender)) {
    return conn.sendMessage(m.chat, {
      text: `❌ *مـمـنـوع الاسـتـخـدام*\nهـاد الـمـيـزة خـاصـة بـفـريـق الـدعـم فـقـط`,
      contextInfo: النشرة
    }, { quoted: m })
  }
  // =============================

  if(command == 'الدعم'){
    if (!text) return conn.sendMessage(m.chat, {
      text: `📌 *طـريـقـة الاسـتـعـمـال:*
1. مـع طـاغ: ${usedPrefix}الدعم 212698498657 مرحبا بك
2. بـلـا طـاغ: ${usedPrefix}الدعم مرحبا يا الاعضاء

*مـيـزة خـاصـة بـفـريـق الـدعـم*`,
      contextInfo: النشرة
    }, { quoted: m })

    let اجزاء = text.trim().split(' ')
    let الكلمة_الاولى = اجزاء[0]
    let منشن = []
    let الرسالة = text

    // واش اول كلمة رقم؟
    if(/^[0-9]{9,15}$/.test(الكلمة_الاولى)){
      let رقم_الهدف = الكلمة_الاولى
      اجزاء.shift() // نحيدو الرقم من الرسالة
      الرسالة = اجزاء.join(' ')
      let معرف_الهدف = رقم_الهدف + '@s.whatsapp.net'
      منشن.push(معرف_الهدف, رقم_المطور)

      الرسالة = `📢 *رد رسـمـي مـن فـريـق الـدعـم*

👤 *مـوجـه لـ:* @${رقم_الهدف}
📱 *الـرقـم:* wa.me/${رقم_الهدف}

📝 *الـمـضـمـون:*
${الرسالة}

*𝗕𝘆 𝗮𝗱𝗮𝗺.___.𝟵𝟴*`
    } else {
      // الى ما كاينش رقم
      منشن.push(رقم_المطور)
      الرسالة = `📢 *اعـلان عـام مـن فـريـق الـدعـم*

📝 *الـمـضـمـون:*
${الرسالة}

*𝗕𝘆 𝗮𝗱𝗮𝗺.___.𝟵𝟴*`
    }

    try {
      await conn.sendMessage(معرف_المجموعة, {
        text: الرسالة,
        mentions: منشن,
        contextInfo: النشرة
      })

      await conn.sendMessage(m.chat, {
        text: `✅ *تــم ارســال رســالــة الـدعـم بـنـجـاح*`,
        contextInfo: النشرة
      }, { quoted: m })

    } catch(خطأ) {
      console.log(خطأ)
      await conn.sendMessage(m.chat, {
        text: `❌ *فــشــل الارســال*\nتـأكـد ان الـبـوت مـوجـود فـي الـمـجـمـوعـة`,
        contextInfo: النشرة
      }, { quoted: m })
    }
  }
}

handler.help = ['الدعم <الرقم> <الرسالة>', 'الدعم <الرسالة>']
handler.tags = ['مالك']
handler.command = ['الدعم'] // الاسم الجديد
handler.owner = true // حماية اضافية من الفريمورك
export default handler
