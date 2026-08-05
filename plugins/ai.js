/**
 * This code is provided for educational purposes.
 * Scraping may be against the terms of service of the website.
 * Use it at your own risk.
 * @author wolep
 * plugin by adam.__.98
 */

const gemini = {
    getNewCookie: async function () {
        const r = await fetch("https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids=maGuAc&source-path=%2F&bl=boq_assistant-bard-web-server_20250814.06_p1&f.sid=-7816331052118000090&hl=en-US&_reqid=173780&rt=c", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            "body": "f.req=%5B%5B%5B%22maGuAc%22%2C%22%5B0%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&",
            "method": "POST"
        });
        console.log('Successfully retrieved a new cookie.');
        const cookieHeader = r.headers.get('set-cookie');
        if (!cookieHeader) throw new Error('Could not find "set-cookie" header in the response.');
        return cookieHeader.split(';')[0];
    },

    ask: async function (prompt, previousId = null) {
        if (typeof (prompt) !== "string" || !prompt?.trim()?.length) {
            throw new Error(`Invalid prompt provided.`);
        }

        let resumeArray = null;
        let cookie = null;

        if (previousId) {
            try {
                const s = atob(previousId);
                const j = JSON.parse(s);
                resumeArray = j.newResumeArray;
                cookie = j.cookie;
            } catch (e) {
                console.error("Failed to parse previousId, starting a new conversation.", e);
                previousId = null; 
            }
        }
        
        const headers = {
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
            "x-goog-ext-525001261-jspb": "[1,null,null,null,\"9ec249fc9ad08861\",null,null,null,[4]]",
            "cookie": cookie || await this.getNewCookie()
        };

        const b = [[prompt], ["en-US"], resumeArray];
        const a = [null, JSON.stringify(b)];
        const obj = { "f.req": JSON.stringify(a) };
        const body = new URLSearchParams(obj);
        
        const response = await fetch(`https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20250729.06_p0&f.sid=4206607810970164620&hl=en-US&_reqid=2813378&rt=c`, {
            headers,
            body,
            'method': 'post'
        });

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText} ${await response.text() || `(Empty response body)`}`);
        }
        
        const data = await response.text();
        const match = data.matchAll(/^\d+\n(.+?)\n/gm);
        
      
        const chunks = Array.from(match, m => m[1]);
        let text, newResumeArray;
        let found = false;

      
        for (const chunk of chunks.reverse()) {
            try {
                const realArray = JSON.parse(chunk);
                const parse1 = JSON.parse(realArray[0][2]);
                
                
                if (parse1 && parse1[4] && parse1[4][0] && parse1[4][0][1] && typeof parse1[4][0][1][0] === 'string') {
                    newResumeArray = [...parse1[1], parse1[4][0][0]];
                    text = parse1[4][0][1][0].replace(/\*\*(.+?)\*\*/g, `*$1*`);
                    found = true;
                    break; 
                }
            } catch (e) {
              
            }
        }

        if (!found) {
            throw new Error("Could not parse the response from the API. The response structure may have changed.");
        }
        
        const id = btoa(JSON.stringify({ newResumeArray, cookie: headers.cookie }));
        return { text, id };
    }
};

const geminiSessions = {};
const autoAiChats = new Set();

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const chat = m.chat;
    const input = text?.trim()?.toLowerCase();

    // Toggle Auto AI mode
    if (input === 'on') {
        autoAiChats.add(chat);
        return m.reply('✅ تــم *تفعيل* الـذكـاء التـلقائـي لهـذه المـحـادثـة.');
    }

    if (input === 'off') {
        autoAiChats.delete(chat);
        return m.reply('❌ تــم *تعطيل* الذكــاء التـلقائـي لهـذه المـحادثـة.');
    }

    if (input === '--reset') {
        delete geminiSessions[m.sender];
        return m.reply('🤖 Conversation history has been reset.');
    }

    if (!text) throw `*الـمرجـو كـتابـة الـسـؤال الـذي تـريـده ان يـقـوم بـاجـابـة عـليـه.*\n\n*مــثــل:* ${usedPrefix + command} Hello\n*Options:* ${usedPrefix + command} on | off`;

    try {
        await m.reply('⏳ لحـظة واحـدة، جـاري تحـضير إجابتـك');
        
        const previousId = geminiSessions[m.sender];
        const result = await gemini.ask(text, previousId);
        geminiSessions[m.sender] = result.id;
        await conn.reply(chat, result.text, m);

    } catch (e) {
        console.error(e);
        m.reply(`Sorry, an error occurred while processing your request. Please try again.\n\n*Error:* ${e.message}`);
    }
};


handler.before = async function (m, { conn }) {
    if (m.isBaileys || !m.text || m.fromMe) return;
    if (!autoAiChats.has(m.chat)) return;

    
    if (m.text.startsWith('.') || m.text.startsWith('#') || m.text.startsWith('/')) return;

    try {
        await conn.sendPresenceUpdate('composing', m.chat);
        const previousId = geminiSessions[m.sender];
        const result = await gemini.ask(m.text, previousId);
        geminiSessions[m.sender] = result.id;
        await conn.reply(m.chat, result.text, m);
    } catch (e) {
        console.error('Auto AI Error:', e);
    }
};

handler.help = ['meta', 'ai on', 'ai off'];
handler.tags = ['ai'];
handler.command = /^(meta|ميتا)$/i;
handler.limit = true;

export default handler;
