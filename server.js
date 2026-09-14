const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

app.use(express.json({limit:"2mb"}));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/apply", async (req, res) => {
  if (!WEBHOOK) return res.status(500).json({ok:false, message:"Discord webhook غير مضبوط."});
  const {name, age, discord, reason, experience, video} = req.body || {};
  if (!name || !age || !discord || !reason || !video) {
    return res.status(400).json({ok:false, message:"كمل كل البيانات المطلوبة."});
  }

  const embed = {
    title: "🏴 THE LOST — طلب انتساب جديد",
    color: 0x9b0000,
    fields: [
      {name:"👤 الاسم", value:String(name).slice(0,1024), inline:true},
      {name:"🎂 العمر", value:String(age).slice(0,1024), inline:true},
      {name:"💬 Discord", value:String(discord).slice(0,1024), inline:true},
      {name:"🎮 الخبرة", value:String(experience || "غير مذكورة").slice(0,1024), inline:false},
      {name:"🔥 سبب التقديم", value:String(reason).slice(0,1024), inline:false},
      {name:"🎥 فيديو لعب", value:String(video).slice(0,1024), inline:false}
    ],
    footer:{text:"NEWPIXEL • THE LOST"},
    timestamp:new Date().toISOString()
  };

  try {
    const r = await fetch(WEBHOOK, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username:"THE LOST Applications", embeds:[embed]})
    });
    if (!r.ok) throw new Error("Discord webhook failed");
    res.json({ok:true});
  } catch(e) {
    res.status(502).json({ok:false, message:"تعذر إرسال الطلب إلى Discord."});
  }
});

app.listen(PORT, () => console.log(`THE LOST running on http://localhost:${PORT}`));
