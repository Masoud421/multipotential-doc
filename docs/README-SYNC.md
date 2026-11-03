# هماهنگی دقیق کلمه به کلمه (بدون DeepSeek)

این روش فقط با چند دستور روی لپ تاپ انجام می شود و پولی نیست.

## یک بار نصب
1. پایتون ۳.۱۰ یا بالاتر (python.org) را نصب کنید. هنگام نصب گزینه Add to PATH را بزنید.
2. در PowerShell بزنید: `winget install Gyan.FFmpeg` (بعد از نصب PowerShell را ببندید و دوباره باز کنید)
3. `pip install stable-ts`

## قبل از شروع
پوشه پروژه را کپی کنید (Copy و Paste در Explorer) و روی کپی کار کنید. فایل های src/doc با فایل های این بسته جایگزین می شوند.

## مراحل
1. محتوای این zip را داخل پوشه پروژه Extract کنید و اگر پرسید Replace را بزنید.
2. فایل `Generated_Audio_October_28_20.mp3` را کنار پوشه پروژه بگذارید.
3. داخل پوشه پروژه PowerShell را باز کنید و بزنید:
   `python scripts/sync-audio.py "..\Generated_Audio_October_28_20.mp3" --model medium`
   بار اول مدل را دانلود می کند. اگر کارت گرافیک NVIDIA دارید `--device cuda` را اضافه کنید. برای دقت بیشتر `--model large-v3`.
4. فایل `sync-report.json` را باز کنید. اگر `issues` خالی بود همه چیز خوب است.
5. پیش نمایش ۴۰ ثانیه اول:
   `npm install`
   `npx remotion browser ensure`
   `npx remotion render src/index-doc.ts MultipotentialDoc out/preview.mp4 --frames=0-1199`
6. رندر کامل:
   `npx remotion render src/index-doc.ts MultipotentialDoc out/multipotential-doc.mp4 --codec=h264 --crf=18`

اگر دستور 3 خطای ALIGN ERROR داد، یعنی متن با صدا یکی نیست. متن خطا را برای من بفرستید.

## بدون مدل گفتار (سریع، دقت کمتر)
اگر نصب stable-ts مشکل داشت، همین دستور را با `--pauses` بزنید:
`python scripts/sync-audio.py "..\Generated_Audio_October_28_20.mp3" --pauses`
این روش متن را به مکث های واقعی صدا وصل می کند. دقت کلمه ها حدود چند دهم ثانیه است.
در این بسته فایل `src/captions.json` از همین روش ساخته شده و آماده است. فقط کافی است MP3 را به WAV تبدیل کنید:
`ffmpeg -i Generated_Audio_October_28_20.mp3 -ar 48000 -ac 2 public/voice.wav`
