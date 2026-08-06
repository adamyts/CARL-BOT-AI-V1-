//تـرجـمـة وتـعـديـل: نـورديـن
//بـلـوغـيـن: Izuku-mi | تـحـسـيـن جـودة الـصـورة HD

// ===== مـعـلـومـات الـقـنـاة =====
const channelName = '𝙄𝙎𝘼𝙂𝙄 𝙔𝙊𝙄𝘾𝙃𝙄 𝘽𝙊𝙏 - 𝟭𝟭 ⚽⚡'
const channelJid = '120363410733859643@newsletter' // حـط مـعـرف الـقـنـاة ديـالـك هـنـا

const newsletter = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: channelJid,
    newsletterName: channelName
  }
}
// ========================

// Convert bytes to readable size - مـا بـقـيـنـاش مـحـتـاجـيـنـهـا ولـكـن خـلـيـنـاهـا
function formatSize(bytes) {
  if (!bytes) return "0 B"
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

// Upload image to uguu
async function uguuUpload(buffer) {
  const form = new FormData()
  form.append("files[]", new Blob([buffer]), "file.jpg")

  const res = await fetch("https://uguu.se/upload.php", {
    method: "POST",
    body: form
  })

  const json = await res.json()
  if (!json.success) return { success: false, error: json }

  const file = json.files[0]
  return {
    success: true,
    url: file.url,
    size: file.size
  }
}

// Send image to jpghd
async function jpghdScrape(imageUrl) {
  const fakeIP = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 256)
  ).join(".")

  const baseHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    Origin: "https://jpghd.com",
    Referer: "https://jpghd.com/en",
    Cookie: "jpghd_lng=en",
    "User-Agent": "CT Android/1.1.0",
    "X-Forwarded-For": fakeIP,
    "X-Real-IP": fakeIP
  }

  const create = await fetch("https://jpghd.com/api/task/", {
    method: "POST",
    headers: baseHeaders,
    body: `conf=${JSON.stringify({
      filename: imageUrl.split("/").pop(),
      livephoto: "",
      color: "",
      scratch: "",
      style: "art",
      input: imageUrl
    })}`
  })

  const createJson = await create.json()

  if (createJson.status!== "ok") {
    return {
      status: false,
      message: "*❌ فـشـل انـشـاء الـمـهـمـة*"
    }
  }

  const tid = createJson.tid

  for (let i = 0; i < 20; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const check = await fetch(
      `https://jpghd.com/api/task/${tid}`,
      { headers: baseHeaders }
    )

    const checkJson = await check.json()
    const data = checkJson[tid]

    if (data?.status === "success") {
      return {
        status: true,
        result: data.output.jpghd,
        size: data.output.size
      }
    }
  }

  return {
    status: false,
    message: "*❌ انـتـهـت الـمـهـلـة، لـم تـكـتـمـل الـمـهـمـة*"
  }
}

// Main Handler
let handler = async (m, { conn }) => {
  try {
    const q = m.quoted? m.quoted : m
    const mime = (q.msg || q).mimetype || ""

    if (!/image/.test(mime)) {
      return conn.sendMessage(
        m.chat,
        {
          text: "*⚠️ الـرجـاء الـرد عـلـى صـورة بـ *.hd*",
          contextInfo: newsletter
        },
        { quoted: m }
      )
    }

    await conn.sendMessage(m.chat, {
      react: {
        text: "⏳",
        key: m.key
      }
    })

    const buffer = await q.download()

    const upload = await uguuUpload(buffer)
    if (!upload.success) throw new Error("*❌ فـشـل الـرفـع*")

    const result = await jpghdScrape(upload.url)
    if (!result.status) throw new Error(result.message)

    // حـيـدنـا الـحـجـم مـن هـنـا
    await conn.sendMessage(
      m.chat,
      {
        image: { url: result.result },
        caption: `*🚀 تـم تـحـسـيـن جـودة الـصـورة بـنـجـاح!*`,
        contextInfo: newsletter
      },
      { quoted: m }
    )

    await conn.sendMessage(m.chat, {
      react: {
        text: "✅",
        key: m.key
      }
    })

  } catch (err) {
    console.error(err)

    await conn.sendMessage(
      m.chat,
      {
        text: `*❌ خـطـأ:*\n${err.message || err}`,
        contextInfo: newsletter
      },
      { quoted: m }
    )
  }
}

handler.help = ["hd"];
handler.tags = ["تـحـريـر"];
handler.command = /^(hd|تحسين_جودة)$/i;

export default handler;
