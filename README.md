# Multipotential — نسخه مستندگونه (Editorial Documentary)

پروژه Remotion برای ویدیوی ۱۰:۲۹ دقیقه‌ای «چگونه چند علاقه داشته باشیم و از پسش برآییم».
تمام محتوا، زیرنویس، صدا، تصاویر و انیمیشن از فایل `multipotential-doc-overlay-v5.zip` استخراج شده است.

## مشخصات
- ۱۹۲۰×۱۰۸۰، ۳۰ فریم بر ثانیه، ۱۸۸۷۹ فریم (۶۲۹٫۲۸ ثانیه)
- ۴۵ صحنه، ۹ فصل، زیرنویس ۳۱۴ قطعه (زمان‌بندی SRT واقعی)
- فونت فارسی: ZFJahan (در `public/fonts/ZFJahan.ttf`)
- سبک: کاغذی/خاکستری، کات‌اوت سیاه‌سفید، تایپوگرافی حرکتی، گذار عمودی رنگی

## ساختار پروژه
| مسیر | کاربرد |
|---|---|
| `src/index-doc.ts`, `src/RootDoc.tsx` | ورودی و ثبت کامپوزیشن `MultipotentialDoc` |
| `src/doc/timing.ts` | فهرست صحنه‌ها و زمان‌بندی از زیرنویس‌ها |
| `src/doc/theme.ts`, `src/doc/anim.ts` | رنگ، فونت، توابع انیمیشن |
| `src/doc/ui.tsx` | تایپوگرافی حرکتی، دوربین/گذار، زیرنویس، HUD |
| `src/doc/figures.tsx` | تصویرسازی برداری اورجینال (فرانکلین، آیکون‌ها) |
| `src/doc/scenes1..5.tsx` | ۴۵ صحنه |
| `src/doc/DocVideo.tsx` | ترکیب صحنه‌ها + صدا + زیرنویس |
| `public/` | فونت، تصاویر، آیکون‌ها، صداها |

## نیازمندی‌های محیط (برای رندر)
- **Node.js** ۱۴ به بالا
- **Remotion v3** (`npm install` در پوشه پروژه)
- **Chromium/Chrome** برای رندر (Remotion از مرورگر برای رندر فریم استفاده می‌کند)
- **FFmpeg** (برای ترکیب صدا و خروجی MP4)

## اجرا در لپ‌تاپ (پیشنهادی)
```bash
cd multipotential-doc
npm install
npx remotion browser ensure
# پیش‌نمایش ۴۰ ثانیه اول:
npx remotion render src/index-doc.ts MultipotentialDoc out/preview.mp4 --frames=0-1199
# رندر کامل:
npx remotion render src/index-doc.ts MultipotentialDoc out/multipotential-doc.mp4 --codec=h264 --crf=20
```

## صدای narration
فایل `public/voice.wav` در بسته اصلی وجود نداشت. در این پیکربندی یک فایل WAV خاموشی ۱۰:۳۰ دقیقه‌ای ایجاد شده تا پروژه بدون crash اجرا شود.
برای استفاده واقعی، فایل صدای narration خود را (MP3 یا WAV) به جای `public/voice.wav` قرار دهید.
برای تولید voice.wav از MP3:
```bash
ffmpeg -i narration.mp3 -ar 48000 -ac 2 public/voice.wav
```

## تنظیم دستی
- تغییر زمان یا جابه‌جایی صحنه: `src/doc/timing.ts` (فیلد `a` = شماره اولین زیرنویس صحنه)
- متن‌ها از `src/captions.json` می‌آیند (۳۱۴ قطعه، زمان‌بندی SRT واقعی)