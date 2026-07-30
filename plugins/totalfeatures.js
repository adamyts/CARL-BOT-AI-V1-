let handler = async (m, { conn }) => {
	let total = Object.values(global.plugins).filter((v) => v.help && v.tags).length;
	
	await conn.adReply(m.chat, `*📊 عـدد ميـزات البـوت الـحـاليـة: ${total}*`, './media/thumbnail.jpg', m, { title: 'مـعلومـات الـبــوت' });
};

handler.help = ['totalfeatures'];
handler.tags = ['infobot'];
handler.command = ['totalfeatures','feature'];

export default handler;
