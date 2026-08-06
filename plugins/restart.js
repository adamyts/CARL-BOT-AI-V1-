import { parentPort } from 'worker_threads';

// ===== Channel Info + Instagram =====
const channelName = '𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏 - 𝟭𝟭 ⚽⚡'
const CHANNEL_ID = '120363410733859643@newsletter'
const instagram = '𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏 - 𝟭𝟭 ⚽⚡'
const newsletter = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: CHANNEL_ID,
    newsletterName: channelName
  }
}
// ========================

let handler = async (m, { conn }) => {
	
	const sendWithChannel = async (txt) => {
        await conn.sendMessage(m.chat, { 
            text: txt,
            contextInfo: newsletter
        }, { quoted: m })
    }

	if (!parentPort) throw '*❌ خـطـأ:* شـغـل الـبـوت بـ `node index.js` مـاشـي `node main.js`'
	
	if (global.conn.user.jid == conn.user.jid) {
		await m.react('🔄')
		await sendWithChannel(`
*جـاري اعـادة الـتـشـغـيـل ✨*

*⚡ الـحـالـة:* \`CARL-BOT . .\`
*⏳ يتـم إعــادة تشـغـيــل مـن جـديــد*`)
		
		parentPort.postMessage('restart');
	} else throw '*⚠️ مـمـنـوع:* هـاد الامـر غـيـر لـلـمـالـك'
};

handler.help = ['اعادة_تشغيل']
handler.tags = ['owner']
handler.command = /^(اعادة_تشغيل(tart)?)$/i
handler.owner = true
export default handler
