import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs/promises';

const client = new textToSpeech.TextToSpeechClient();

// Map UI voice IDs → Google Cloud voice names
const GOOGLE_VOICE_MAP = {
  // Sinhala (si-LK)
  'si-1': { languageCode: 'si-LK', name: 'si-LK-Standard-A' },
  'si-2': { languageCode: 'si-LK', name: 'si-LK-Standard-B' },
  'si-3': { languageCode: 'si-LK', name: 'si-LK-Standard-C' },
  'si-4': { languageCode: 'si-LK', name: 'si-LK-Standard-D' },

  // English
  'en-1': { languageCode: 'en-US', name: 'en-US-Neural2-F' },
  'en-2': { languageCode: 'en-US', name: 'en-US-Neural2-D' },
  'en-3': { languageCode: 'en-US', name: 'en-US-Neural2-H' },
  'en-4': { languageCode: 'en-GB', name: 'en-GB-Neural2-B' },

  // Spanish
  'es-1': { languageCode: 'es-ES', name: 'es-ES-Neural2-A' },
  'es-2': { languageCode: 'es-ES', name: 'es-ES-Neural2-B' },
  'es-3': { languageCode: 'es-ES', name: 'es-ES-Neural2-C' },

  // French
  'fr-1': { languageCode: 'fr-FR', name: 'fr-FR-Neural2-A' },
  'fr-2': { languageCode: 'fr-FR', name: 'fr-FR-Neural2-B' },

  // German
  'de-1': { languageCode: 'de-DE', name: 'de-DE-Neural2-A' },
  'de-2': { languageCode: 'de-DE', name: 'de-DE-Neural2-B' },

  // Hindi
  'hi-1': { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A' },
  'hi-2': { languageCode: 'hi-IN', name: 'hi-IN-Neural2-B' },

  // Fallback examples — add the rest as needed
  'it-1': { languageCode: 'it-IT', name: 'it-IT-Neural2-A' },
  'pt-1': { languageCode: 'pt-PT', name: 'pt-PT-Neural2-A' },
  'ja-1': { languageCode: 'ja-JP', name: 'ja-JP-Neural2-B' },
  'ko-1': { languageCode: 'ko-KR', name: 'ko-KR-Neural2-A' },
  'zh-1': { languageCode: 'cmn-CN', name: 'cmn-CN-Wavenet-A' },
  'ar-1': { languageCode: 'ar-XA', name: 'ar-XA-Wavenet-A' },
  'ru-1': { languageCode: 'ru-RU', name: 'ru-RU-Wavenet-A' },
};

export async function synthesizeLine({ text, voiceId, outPath }) {
  const voice = GOOGLE_VOICE_MAP[voiceId];
  if (!voice) throw new Error(`Unknown voice: ${voiceId}`);

  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: voice.languageCode,
      name: voice.name,
    },
    audioConfig: {
      audioEncoding: 'LINEAR16',
      sampleRateHertz: 48000,
      speakingRate: 1.0,
      pitch: 0.0,
    },
  });

  await fs.writeFile(outPath, response.audioContent, 'binary');
  return outPath;
}