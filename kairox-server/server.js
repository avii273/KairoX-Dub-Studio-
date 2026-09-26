import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execa } from 'execa';
import ffmpegStatic from 'ffmpeg-static';
import { synthesizeLine } from './tts.js';
import { toSRT } from './srt.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TMP = path.join(__dirname, 'tmp');
await fs.mkdir(TMP, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const upload = multer({ dest: TMP });

app.post(
  '/render',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'project', maxCount: 1 },
  ]),
  async (req, res) => {
    const jobId = Date.now().toString();
    const jobDir = path.join(TMP, jobId);
    await fs.mkdir(jobDir, { recursive: true });

    try {
      const videoPath = req.files.video[0].path;
      const project = JSON.parse(
        await fs.readFile(req.files.project[0].path, 'utf8')
      );
      const { lines } = project;

      // 1. Synthesize each line
      const clips = [];
      for (const line of lines) {
        const char = project.characters.find(c => c.id === line.characterId);
        if (!char?.voiceId) throw new Error(`Line ${line.id} has no voice`);

        const clipPath = path.join(jobDir, `line-${line.id}.wav`);
        await synthesizeLine({
          text: line.text,
          voiceId: char.voiceId,
          outPath: clipPath,
        });

        const dur = await getDuration(clipPath);
        const target = Math.max(0.1, line.end - line.start);
        clips.push({
          path: clipPath,
          start: line.start,
          dur,
          target,
          characterId: char.id,
        });
      }

      // 2. Silent base track matching video length
      const videoDur = await getDuration(videoPath);
      const silencePath = path.join(jobDir, 'silence.wav');
      await runFfmpeg([
        '-f', 'lavfi',
        '-i', 'anullsrc=r=48000:cl=stereo',
        '-t', String(videoDur),
        '-q:a', '9',
        '-y', silencePath,
      ]);

      // 3. Mix clips at their timestamps
      const inputs = ['-i', silencePath];
      const filterParts = [];
      clips.forEach((c, i) => {
        inputs.push('-i', c.path);
        const delayMs = Math.round(c.start * 1000);
        const speed = c.dur > c.target ? (c.dur / c.target) : 1;
        filterParts.push(
          `[${i + 1}:a]atempo=${speed.toFixed(3)},adelay=${delayMs}|${delayMs}[a${i}]`
        );
      });
      const mixInputs = clips.map((_, i) => `[a${i}]`).join('');
      filterParts.push(
        `${mixInputs}amix=inputs=${clips.length}:duration=longest:normalize=0[aout]`
      );

      const dubAudio = path.join(jobDir, 'dub.wav');
      await runFfmpeg([
        ...inputs,
        '-filter_complex', filterParts.join(';'),
        '-map', '[aout]',
        '-y', dubAudio,
      ]);

      // 4. Mux into video
      const outVideo = path.join(jobDir, 'output.mp4');
      await runFfmpeg([
        '-i', videoPath,
        '-i', dubAudio,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-shortest',
        '-y', outVideo,
      ]);

      // 5. SRT
      const srtPath = path.join(jobDir, 'output.srt');
      await fs.writeFile(srtPath, toSRT(lines), 'utf8');

      res.json({
        jobId,
        video: `/download/${jobId}/output.mp4`,
        audio: `/download/${jobId}/dub.wav`,
        srt:   `/download/${jobId}/output.srt`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

app.use('/download', express.static(TMP));

app.listen(process.env.PORT || 3001, () => {
  console.log(`KairoX render server on :${process.env.PORT || 3001}`);
});

function getDuration(file) {
  return new Promise((res, rej) => {
    execa(ffmpegStatic, [
      '-i', file,
      '-f', 'null', '-',
    ]).then(({ stderr }) => {
      const m = stderr.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
      if (!m) return rej(new Error('Could not read duration'));
      const [_, h, mm, s] = m;
      res(+h * 3600 + +mm * 60 + +s);
    }).catch(rej);
  });
}

async function runFfmpeg(args) {
  await execa(ffmpegStatic, args, { stdio: 'inherit' });
}