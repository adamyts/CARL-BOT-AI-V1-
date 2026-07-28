//تـرجـمـة وتـعـديـل: نـورديـن
//بـلـوغـيـن: Izuku-mi | بـدون مـكـتـبـات + مـتـعـدد API + قـنـاة

const handler = async (m, { text, conn }) => {
    try {
        // ===== مـعـلـومـات الـقـنـاة =====
        const channelName = 'GI : adam.__.89'
        const newsletter = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363410733859643@newsletter', // بـدلـهـا بـ ID ديـال الـقـنـاة ديـالـك
                newsletterName: channelName
            }
        }
        // ========================

        if (!text) return m.reply("📥*الـرجـاء إدخـال اســم الأغـنـية وسـأقـوم بـتحـمله لـك فــوراً*\n\n*📌 مـثـال :* `.play alan walker faded`", m.chat, { contextInfo: newsletter })

        await m.react('🔍')

        let res, data
        const apis = [
            `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(text)}`,
            `https://api.nexray.web.id/downloader/ytplay?q=${encodeURIComponent(text)}`,
            `https://api.siputzx.my.id/api/d/ytmp3?url=https://youtube.com/search?q=${encodeURIComponent(text)}`
        ]

        for(let url of apis){
            try{
                const api = await fetch(url, { timeout: 15000 })
                data = await api.json()
                
                if(url.includes('vreden') && data.status && data.result?.download?.url){
                    res = { title: data.result.title, thumbnail: data.result.thumbnail, duration: data.result.duration, author: data.result.author, download: data.result.download.url, url: data.result.url }
                    break
                }
                if(url.includes('nexray') && data.status && data.result?.download_url){
                    res = { title: data.result.title, thumbnail: data.result.thumbnail, duration: data.result.duration, author: {name: 'غـيـر مـعـروف'}, download: data.result.download_url, url: data.result.url }
                    break
                }
                if(url.includes('siputzx') && data.status && data.data?.dl){
                    res = { title: data.data.title, thumbnail: data.data.thumbnail, duration: data.data.duration, author: {name: data.data.author}, download: data.data.dl, url: data.data.url }
                    break
                }
            }catch(e){}
        }

        if (!res) return m.reply("❌ كـل الـ APIs طـايـحـيـن أو الأغـنـيـة مـاتـلـقـاتـش. جـرب مـرة خـرى", m.chat, { contextInfo: newsletter })

        await m.react('🎵')

        const { title, thumbnail, duration, author, download, url } = res

        const caption = `🎵 *تــــم الـتـحـمـيـل بـنـجـاح*:
        
*📌 الـعـنـوان :* ${title || ""}
*🔍 الـرابـط :* ${url || ""}
*⏰ الـمــدة :* ${duration || ""}`
      
        await conn.sendMessage(m.chat, { 
            image: { url: thumbnail }, 
            caption,
            contextInfo: newsletter
        }, { quoted: m })

        await m.react('⏳')
        await conn.sendMessage(m.chat, { 
            audio: { url: download }, 
            mimetype: "audio/mpeg", 
            fileName: `${title}.mp3`, 
            ptt: false,
            contextInfo: newsletter
        }, { quoted: m })

        await m.reply("✅ *تـم الـتـحـمـيـل بـنـجـاح! تـهـنـى بـالـمـوسـيـقـى 🎵*", m.chat, { contextInfo: newsletter })
        await m.react('✅')

    } catch (e) {
        console.error("PLAY ERROR:", e)
        m.reply(`❌ خـطـأ: ${e.message}\nجـرب مـرة خـرى أو بـدل الأغـنـيـة`)
    }
}

handler.command = ["play", "song",]
handler.help = ["play <الـبـحـث>"]
handler.tags = ["تـحـمـيـل"]
export default handler
