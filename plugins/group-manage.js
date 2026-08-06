// تـعـديـل : نـورديـن - ستيل عادي

// ===== Channel Info + Instagram =====
const channelName = '𝘾𝘼𝙍𝙇-𝘽𝙊𝗧'
const CHANNEL_ID = '120363410733859643@newsletter'
const instagram = '𝘾𝘼𝙍𝙇-𝘽𝙊𝗧'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}
// =====================================

const handler = async (m, { conn, text, participants, groupMetadata, command, usedPrefix }) => {
	const target = m.quoted
		? m.quoted.sender
		: m.mentionedJid && m.mentionedJid[0]
		? m.mentionedJid[0]
		: text
		? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
		: null

	const cmd = ['اضافة', 'طرد', 'ترقية', 'انزال', 'add', 'kick', 'promote', 'demote']

	if (cmd.includes(command) &&!target)
		return conn.sendMessage(m.chat, {
			text: `*🫯 الـرجـاء مـنـشـن الـعـضـو او الـرد عـلـى رسـالـتـه*\n\n*📌 مـثـل :* \`${usedPrefix}طرد @tag\``,
			contextInfo: newsletter
		}, { quoted: m })

	const inGc = participants.some(
	(v) => v.jid == target || v.id === target || v.phoneNumber === target
	)

	await m.react('⏳')

	switch (command) {
		case 'add':
		case 'اضافة':
			{
				if (inGc) {
					await m.react('❌')
					return m.reply(`*❌ الـعـضـو مـوجـود فـي الـمـجـمـوعـة*`)
				}
				const response = await conn.groupParticipantsUpdate(m.chat, [target], 'add')
				const jpegThumbnail = await conn.profilePictureUrl(m.chat, 'image', 'buffer')

				for (const participant of response) {
					const jid = participant.content.attrs.phone_number || participant.content.attrs.jid
					const status = participant.status

					if (status === '408') {
						await m.reply(`*❌ مـا يـمـكـنـش تـضـيـف @${jid.split('@')[0]}*\n*الـسـبـب:* خـرج مـؤخـرا او تـطـرد`)
					} else if (status === '403') {
						const inviteCode = participant.content[0].attrs.code
						const inviteExp = participant.content.content[0].attrs.expiration
						await m.reply(`*⏳ جـاري ارسـال دعـوة ل @${jid.split('@')[0]}*`)
						await conn.sendGroupV4Invite(m.chat, jid, inviteCode, inviteExp, groupMetadata.subject, 'دعـوة لـلانـضـمـام', jpegThumbnail)
					} else {
						await m.reply(`*✅ تـمـت اضـافـة @${jid.split('@')[0]}*`)
						await m.react('✅')
					}
				}
			}
			break

		case 'kick':
		case 'طرد':
			if (!inGc) {
				await m.react('❌')
				return m.reply(`*❌ الـعـضـو مـاشـي فـي الـمـجـمـوعـة*`)
			}
			await conn.groupParticipantsUpdate(m.chat, [target], 'remove')
			await m.reply(`*✅ تـم طـرد @${target.split('@')[0]}*`)
			await m.react('✅')
			break

		case 'promote':
		case 'ترقية':
			if (!inGc) {
				await m.react('❌')
				return m.reply(`*❌ الـعـضـو مـاشـي فـي الـمـجـمـوعـة*`)
			}
			await conn.groupParticipantsUpdate(m.chat, [target], 'promote')
			await m.reply(`*✅ تـم تـرقـيـة @${target.split('@')[0]} لادمـيـن*`)
			await m.react('✅')
			break

		case 'demote':
		case 'انزال':
			if (!inGc) {
				await m.react('❌')
				return m.reply(`*❌ الـعـضـو مـاشـي فـي الـمـجـمـوعـة*`)
			}
			await conn.groupParticipantsUpdate(m.chat, [target], 'demote')
			await m.reply(`*✅ تـم انـزال @${target.split('@')[0]} مـن الادارة*`)
			await m.react('✅')
			break

		case 'closegc':
		case 'اغلاق':
			await conn.groupSettingUpdate(m.chat, 'announcement')
			await m.reply(`*✅ تـم اغـلاق الـمـجـمـوعـة*\n*الان فـقـط الادمـيـن يـقـدر يـرسـل*`)
			await m.react('✅')
			break

		case 'opengc':
		case 'فتح':
			await conn.groupSettingUpdate(m.chat, 'not_announcement')
			await m.reply(`*✅ تـم فـتـح الـمـجـمـوعـة*\n*الان كـلـشـي يـقـدر يـرسـل*`)
			await m.react('✅')
			break

		default:
			return m.reply(`*❌ امـر غـيـر مـعـروف*`)
	}
}

handler.help = ['اضافة @tag', 'طرد @tag', 'ترقية @tag', 'انزال @tag', 'فتح', 'اغلاق']
handler.tags = ['owner']
handler.command = /^(اضافة|طرد|ترقية|انزال|add|kick|promote|demote|فتح|اغلاق|opengc|closegc)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true
handler.owner = true
export default handler
