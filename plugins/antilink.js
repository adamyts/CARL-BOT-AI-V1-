// instagram
let before = async function (m, { conn, isAdmin, isBotAdmin }) {
  // التحقق من روابط واتساب للقنوات والمجموعات
  const regex = /https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+|https:\/\/whatsapp\.com\/channel\/[A-Za-z0-9]{22}/

  if (regex.test(m.text)) {
    if (isAdmin) return // تجاهل إذا كان المرسل مشرف
    if (!isBotAdmin) return // يجب أن يكون البوت مشرف للحذف والطرد

    // إرسال رسالة تحذير - بخط عريض
    await conn.sendMessage(
      m.chat,
      {
        text: `⚠️ *تـحذيـر : تـم رصــد رابـط مـجـمـوعـة او قـنـاة!!* ⚠️

*👤 العـضـو* @${m.sender.split('@')[0]}

*تـمـت إزالـتـه*
*لمـخالفـته قـوانـين المـجـموعة بإرسـال روابـط.*

*🚫 هـذا التـصرف ممـنوع هـنا 🚫*`,
        mentions: [m.sender]
      },
      { quoted: m }
    )

    // حذف الرسالة التي تحتوي على الرابط
    await conn.sendMessage(m.chat, { delete: m.key })

    // طرد العضو الذي أرسل الرابط
    await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove")
  }
}

export default { before }
