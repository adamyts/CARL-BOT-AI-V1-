import { useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import * as ws from 'ws'
import { exec } from 'child_process'
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

// ===== تعريفات عامة =====
const jadi = 'jadi'
const channelLink = 'https://whatsapp.com/channel/0029Vb8OLjc9MF8vdLAHev2C'

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"

let rtx = `
┏━━━━━『 ⚡️طريقة الربط السريعة 』━━━━━┓

📲 ‹ 1 › قم بفتح *واتساب* على جهازك الآخر
🔐 ‹ 2 › انتقل إلى "📁 الأجهزة المرتبطة"
📸 ‹ 3 › امسح رمز الـ QR الظاهر هنا
⏳ ‹ 4 › انتظر قليلاً حتى يتم الاتصال
💌 ‹ 5 › لا تنسى *دعوة لطيفة* منك تخلينا نكمل التطوير 💖

┗━━『 🤖 ⫍ ⃢𝙄𝙏𝘼𝘾𝙃𝙄 𝘽𝙊𝙏シ︎ 𖤍⫎ 』━━┛
> 𝙾𝚆𝙽𝙴𝚁 : 💀Walid
`.trim()

let rtx2 = `
┏━〔 🔗 ربط بوت فرعي جديد 〕━┓

🤖 البوت: ⫍ ⃢𝙄𝙏𝘼𝘾𝙃𝙄 𝘽𝙊𝙏シ︎ 𖤍⫎

➊ ﹝افتح الأجهزة المرتبطة في واتساب﹞
➋ ﹝اختر "الربط بكود تحقق" من البوت الأساسي﹞
➌ ﹝ادخل الكود الذي سيصلك من بوت ⫍ ⃢𝙄𝙏𝘼𝘾𝙃𝙄 𝘽𝙊𝙏シ︎ 𖤍⫎﹞
➍ ﹝انتظر حتى يتم الربط بنجاح وتأكيده﹞

⚠️ *تنبيه مهم:*
✦ ✦ لينك قناه لا تنسا المتابعه
${channelLink}

┗━〔 👨‍💻 تم التطوير بواسطة 💀WALID 〕━┛
> 𝙾𝚆𝙽𝙴𝚁 : 💀WALID
`.trim()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const yukiJBOptions = {}

if (!global.conns) global.conns = []

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState!== ws.CLOSED).map((conn) => conn)])]
    if (subBots.length >= 30) return m.reply(`❌ معتش اماكن، العدد وصل للحد الأقصى 30 بوت`)

    let who = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : m.fromMe? conn.user.jid : m.sender
    let id = `${who.split`@`[0]}`
    let pathYukiJadiBot = path.join(`./${jadi}/`, id)

    if (!fs.existsSync(pathYukiJadiBot)) fs.mkdirSync(pathYukiJadiBot, { recursive: true })

    yukiJBOptions.pathYukiJadiBot = pathYukiJadiBot
    yukiJBOptions.m = m
    yukiJBOptions.conn = conn
    yukiJBOptions.args = args
    yukiJBOptions.usedPrefix = usedPrefix
    yukiJBOptions.command = command
    yukiJBOptions.fromCommand = true
    yukiJadiBot(yukiJBOptions)

    if(global.db?.data?.users[m.sender]) global.db.data.users[m.sender].Subs = new Date * 1
}

handler.help = ['jadibotcode']
handler.tags = ['serbot']
handler.command = ["jadibotcode"]
export default handler

export async function yukiJadiBot(options) {
    let { pathYukiJadiBot, m, conn, args, usedPrefix, command } = options
    const mcode = true // دايمن كود بلا QR

    const pathCreds = path.join(pathYukiJadiBot, "creds.json")
    if (!fs.existsSync(pathYukiJadiBot)) fs.mkdirSync(pathYukiJadiBot, { recursive: true })

    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
    exec(comb.toString("utf-8"), async (err, stdout, stderr) => {

        let { version } = await fetchLatestBaileysVersion()
        const msgRetryCache = new NodeCache()
        const { state, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot)

        const connectionOptions = {
            logger: pino({ level: "fatal" }),
            printQRInTerminal: false,
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
            msgRetryCache,
            browser: ['Ubuntu', 'Chrome', '110.0.5585.95'],
            version: version,
            generateHighQualityLinkPreview: true
        };

        let sock = makeWASocket(connectionOptions)
        sock.isInit = false
        let isInit = true

        async function connectionUpdate(update) {
            const { connection, lastDisconnect, qr } = update
            if (qr && mcode) {
                let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
                // بلا شرطة
                await conn.sendMessage(m.chat, {
                    text: `${rtx2}\n\n*الكود:* ${secret}`, // 2926KUUJ
                    buttons: [
                        { buttonId: `copy_${secret}`, buttonText: { displayText: '📋 نسخ الكود' }, type: 1 }
                    ],
                    headerType: 1
                }, { quoted: m })
                console.log('CODE:', secret)
            }

            const reason = lastDisconnect?.error?.output?.statusCode
            if (connection === 'close') {
                if ([428,408,515].includes(reason)) await creloadHandler(true).catch(console.error)
                if ([405,401,403].includes(reason)) fs.rmdirSync(pathYukiJadiBot, { recursive: true })
                if (reason === 500) return creloadHandler(true).catch(console.error)
            }
            if (connection == `open`) {
                let userName = sock.authState.creds.me.name || 'Anónimo'
                console.log(chalk.bold.cyanBright(`\n✅ ${userName} (+${path.basename(pathYukiJadiBot)}) متصل بنجاح.`))
                sock.isInit = true
                global.conns.push(sock)
                await joinChannels(sock)
            }
        }

        setInterval(async () => {
            if (!sock.user) {
                try { sock.ws.close() } catch (e) { }
                sock.ev.removeAllListeners()
                let i = global.conns.indexOf(sock)
                if (i < 0) return
                delete global.conns[i]
                global.conns.splice(i, 1)
            }
        }, 60000)

        let handler = await import('../handler.js')
        let creloadHandler = async function (restatConn) {
            try {
                const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
                if (Object.keys(Handler || {}).length) handler = Handler
            } catch (e) { console.error('خطأ: ', e) }
            if (restatConn) {
                const oldChats = sock.chats
                try { sock.ws.close() } catch { }
                sock.ev.removeAllListeners()
                sock = makeWASocket(connectionOptions, { chats: oldChats })
                isInit = true
            }
            if (!isInit) {
                sock.ev.off("messages.upsert", sock.handler)
                sock.ev.off("connection.update", sock.connectionUpdate)
                sock.ev.off('creds.update', sock.credsUpdate)
            }
            sock.handler = handler.handler.bind(sock)
            sock.connectionUpdate = connectionUpdate.bind(sock)
            sock.credsUpdate = saveCreds.bind(sock, true)
            sock.ev.on("messages.upsert", sock.handler)
            sock.ev.on("connection.update", sock.connectionUpdate)
            sock.ev.on("creds.update", sock.credsUpdate)
            isInit = false
            return true
        }
        creloadHandler(false)
    })
}

async function joinChannels(conn) {
  const MAIN_CHANNEL = '120363388068937709@newsletter';
  await conn.newsletterFollow(MAIN_CHANNEL).catch(() => {});
}
