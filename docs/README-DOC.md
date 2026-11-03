# نسخه مستندگونه (ادیتوریال) — راهنما

این نسخه فقط فایل جدید اضافه می کند. هیچ فایل قبلی پروژه (Video.tsx، Root.tsx، index.ts، captions.json، SRT، WAV) تغییر نکرده است. کامپوزیشن قبلی `Multipotential` هنوز کار می کند.

## مشخصات
- ۱۹۲۰×۱۰۸۰، ۳۰ فریم بر ثانیه، ۱۸۸۷۹ فریم (۶۲۹٫۲۸ ثانیه)
- صدا: `public/voice.wav` (همان فایل اصلی، تغییر نکرده)
- زیرنویس: `src/captions.json` (۳۱۴ قطعه، همان زمان های SRT، بدون کشیدن یا فشرده کردن)
- شناسه کامپوزیشن: `MultipotentialDoc`، ورودی: `src/index-doc.ts`

## مسیر فایل ها (همه محلی)
| مسیر | کاربرد |
|---|---|
| `src/index-doc.ts`, `src/RootDoc.tsx` | ورودی و ثبت کامپوزیشن |
| `src/doc/timing.ts` | فهرست صحنه ها و زمان آن ها از زیرنویس ها |
| `src/doc/theme.ts`, `src/doc/anim.ts` | رنگ، فونت، توابع انیمیشن |
| `src/doc/ui.tsx` | تایپوگرافی حرکتی، دوربین/گذار، زیرنویس، HUD |
| `src/doc/figures.tsx` | تصویرسازی برداری اورجینال (فرانکلین، آیکون ها) |
| `src/doc/scenes1..5.tsx` | ۴۵ صحنه |
| `src/doc/DocVideo.tsx` | ترکیب صحنه ها + صدا + زیرنویس |
| `public/fonts/ZFJahan.ttf` | فونت فارسی شما |
| `public/assets/doc/grain.png` | بافت کاغذ (تولید شده، بدون مجوز خارجی) |
| `docs/VISUAL_PLAN.md` | برنامه بصری صحنه به صحنه |

هیچ عکس یا فایل اینترنتی استفاده نشده است؛ همه تصویرها کد SVG اورجینال هستند.

## اجرا (در Codespaces)
```bash
npm install
npx remotion browser ensure
bash scripts/doc-studio.sh                 # پیش نمایش زنده
bash scripts/doc-preview.sh 0 1199         # رندر ۴۰ ثانیه اول (فریم ۰ تا ۱۱۹۹)
bash scripts/doc-render-full.sh            # رندر کامل → out/multipotential-doc.mp4
```
معادل دستور مستقیم:
```bash
npx remotion render src/index-doc.ts MultipotentialDoc out/multipotential-doc.mp4 --codec=h264 --crf=20
```
بازه دلخواه: `bash scripts/doc-preview.sh <فریم شروع> <فریم پایان>` (ثانیه × ۳۰ = فریم).

اگر کروم خطای کتابخانه داد:
```bash
sudo apt-get update && sudo apt-get install -y libnss3 libdbus-1-3 libatk1.0-0 libgbm-dev libasound2t64 libxrandr2 libxkbcommon-dev libxfixes3 libxcomposite1 libxdamage1 libatk-bridge2.0-0 libpango-1.0-0 libcairo2 libcups2
```

## تنظیم دستی
- تغییر زمان یا جابه جایی صحنه: `src/doc/timing.ts` (فیلد `a` = شماره اولین زیرنویس صحنه)
- متن ها از زیرنویس ها می آیند؛ متن های درشت روی صفحه جمله های همان روایت هستند.
