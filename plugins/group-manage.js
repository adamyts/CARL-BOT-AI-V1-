// تـعـديـل : نـورديـن - ستيل عادي

// ===== Channel Info + Instagram =====
const channelName = 'GI : adam.__.98'
const CHANNEL_ID = '120363410733859643@newsletter' // <-- معرف قناة daily
const instagram = 'adam.__.98'
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

	const cmd = ['add', 'kick', 'promote', 'demote']

	if (cmd.includes(command) &&!target)
		return conn.sendMessage(m.chat, {
			text: `*📌 الـطـريـقـة:* ${usedPrefix + command} @tag\n*او* رد على رسالة العضو`,
			contextInfo: newsletter
		}, { quoted: m })

	const inGc = participants.some(
	(v) => v.jid == target || v.id === target || v.phoneNumber === target
	)

	await m.react('⏳')

	switch (command) {
		case 'add':
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
			if (!inGc) {
				await m.react('❌')
				return m.reply(`*❌ الـعـضـو مـاشـي فـي الـمـجـمـوعـة*`)
			}
			await conn.groupParticipantsUpdate(m.chat, [target], 'remove')
			await m.reply(`*✅ تـم طـرد @${target.split('@')[0]}*`)
			await m.react('✅')
			break

		case 'promote':
			if (!inGc) {
				await m.react('❌')
				return m.reply(`*❌ الـعـضـو مـاشـي فـي الـمـجـمـوعـة*`)
			}
			await conn.groupParticipantsUpdate(m.chat, [target], 'promote')
			await m.reply(`*✅ تـم تـرقـيـة @${target.split('@')[0]} لادمـيـن*`)
			await m.react('✅')
			break

		case 'demote':
			if (!inGc) {
				await m.react('❌')
				return m.reply(`*❌ الـعـضـو مـاشـي فـي الـمـجـمـوعـة*`)
			}
			await conn.groupParticipantsUpdate(m.chat, [target], 'demote')
			await m.reply(`*✅ تـم انـزال @${target.split('@')[0]} مـن الادارة*`)
			await m.react('✅')
			break

		case 'closegc':
		case 'mute':
			await conn.groupSettingUpdate(m.chat, 'announcement')
			await m.reply(`*✅ تـم اغـلاق الـمـجـمـوعـة*\n*الان فـقـط الادمـيـن يـقـدر يـرسـل*`)
			await m.react('✅')
			break

		case 'opengc':
		case 'unmute':
			await conn.groupSettingUpdate(m.chat, 'not_announcement')
			await m.reply(`*✅ تـم فـتـح الـمـجـمـوعـة*\n*الان كـلـشـي يـقـدر يـرسـل*`)
			await m.react('✅')
			break

		default:
			return m.reply(`*❌ امـر غـيـر مـعـروف*`)
	}
}

handler.help = ['add @tag', 'kick @tag', 'promote @tag', 'demote @tag', 'opengc', 'closegc']
handler.tags = ['owner']
handler.command = /^(add|kick|promote|demote|mute|unmute|opengc|closegc)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true
handler.owner = true
export default handler
