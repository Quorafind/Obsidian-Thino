import React, { useCallback, useState } from 'react';
import { Notice, Platform } from 'obsidian';
import { t } from '../translations/helper';
import MicrophoneSvg from '../icons/microphone.svg?component';
import StopSvg from '../icons/stop.svg?component';

interface VoiceRecorderProps {
  onTranscription: (text: string, audioBlob?: Blob) => void;
  onAudioRecorded?: (audioBlob: Blob) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscription, onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  // Check for browser support
  React.useEffect(() => {
    // Check for Speech Recognition API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US'; // Default language

      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onTranscription(finalTranscript.trim());
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        new Notice(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
      console.warn('Speech Recognition API not supported');
    }
  }, [onTranscription]);

  const startRecording = useCallback(async () => {
    try {
      // Start audio recording
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          setAudioChunks([]);
          if (onAudioRecorded) {
            onAudioRecorded(audioBlob);
          }
          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        setAudioChunks(chunks);
      }

      // Start speech recognition
      if (recognition) {
        recognition.start();
        setIsRecording(true);
        new Notice(t('Voice recording started...'));
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      new Notice('Failed to start voice recording. Please check microphone permissions.');
      setIsRecording(false);
    }
  }, [recognition, onAudioRecorded]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    new Notice(t('Voice recording stopped'));
  }, [recognition, mediaRecorder]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  if (!isSupported && !Platform.isMobile) {
    return null; // Hide button if not supported on desktop
  }

  return (
    <button
      className={`action-btn voice-recorder ${isRecording ? 'recording' : ''}`}
      onClick={toggleRecording}
      title={isRecording ? t('Stop recording') : t('Start voice recording')}
      aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
    >
      {isRecording ? <StopSvg /> : <MicrophoneSvg />}
    </button>
  );
};

export default VoiceRecorder;
