import { Audio } from 'expo-av';

import { BACKEND_URL, CLIENT_ID } from '@/constants/api';

export async function startRecording(): Promise<Audio.Recording> {
  const { granted } = await Audio.requestPermissionsAsync();
  if (!granted) throw new Error('Microphone permission not granted');

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  return recording;
}

export async function stopAndTranscribe(recording: Audio.Recording): Promise<string | null> {
  await recording.stopAndUnloadAsync();
  await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

  const uri = recording.getURI();
  if (!uri) return null;

  try {
    const formData = new FormData();
    formData.append('audio', {
      uri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    } as unknown as Blob);

    const response = await fetch(`${BACKEND_URL}/openai/mobile-transcribe`, {
      method: 'POST',
      headers: { x_client_id: CLIENT_ID },
      body: formData,
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { userTranscript?: string };
    return typeof data.userTranscript === 'string' && data.userTranscript.trim()
      ? data.userTranscript.trim()
      : null;
  } catch {
    return null;
  }
}

export async function speakText(text: string): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/openai/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        x_client_id: CLIENT_ID,
      },
      body: JSON.stringify({ voice: 'alloy', text }),
    });

    if (!response.ok) return;
    const data = (await response.json()) as {
      audioUrl?: string;
      audioBase64?: string;
      audioMimeType?: string;
    };

    // Prefer base64 data URI (no second network hop); fall back to served URL
    let audioUri: string | undefined;
    if (typeof data.audioBase64 === 'string' && data.audioBase64) {
      audioUri = `data:audio/mpeg;base64,${data.audioBase64}`;
    } else if (typeof data.audioUrl === 'string' && data.audioUrl) {
      audioUri = data.audioUrl;
    }
    if (!audioUri) return;

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
    });

    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    await sound.playAsync();

    await new Promise<void>((resolve) => {
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          void sound.unloadAsync();
          resolve();
        }
      });
    });
  } catch {
    // Non-fatal — simulation continues without audio
  }
}
