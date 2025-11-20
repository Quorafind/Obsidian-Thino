import { moment, TFile } from 'obsidian';
import { createDailyNote, getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface';
import appStore from '../stores/appStore';

class AudioService {
  /**
   * Save audio recording to vault
   * @param audioBlob Audio blob to save
   * @param transcription Optional text transcription
   * @returns Path to saved audio file
   */
  public async saveAudioRecording(audioBlob: Blob, transcription?: string): Promise<string> {
    const { vault, fileManager } = appStore.getState().dailyNotesState.app;

    const audioArray = await audioBlob.arrayBuffer();
    const ext = 'webm'; // Default audio format from MediaRecorder

    const dailyNotes = getAllDailyNotes();
    const date = moment();
    const existingFile = getDailyNote(date, dailyNotes);
    let dailyFile: TFile;

    // Ensure daily note exists
    if (!existingFile) {
      dailyFile = await createDailyNote(date);
    } else if (existingFile instanceof TFile) {
      dailyFile = existingFile;
    } else {
      throw new Error('Failed to get daily note');
    }

    // Generate unique filename for audio
    const audioFileName = `voice-memo-${moment().format('YYYYMMDDHHmmss')}`;

    // Save audio file
    //@ts-expect-error, private method
    const audioPath = await vault.getAvailablePathForAttachments(audioFileName, ext, dailyFile);
    const audioFile = await vault.createBinary(audioPath, audioArray);

    // If transcription is provided, append it to the daily note
    if (transcription && dailyFile) {
      const fileContent = await vault.read(dailyFile);
      const audioLink = fileManager.generateMarkdownLink(audioFile, audioFile.path, '', '');
      const newContent = `${fileContent}\n\n---\n\n**Voice Memo:** ${transcription}\n\n${audioLink}\n`;
      await vault.modify(dailyFile, newContent);
    }

    return audioFile.path;
  }

  /**
   * Get audio link for embedding in memo
   * @param audioPath Path to audio file
   * @returns Markdown link to audio
   */
  public getAudioLink(audioPath: string): string {
    const { fileManager } = appStore.getState().dailyNotesState.app;
    const audioFile = app.vault.getAbstractFileByPath(audioPath);

    if (audioFile instanceof TFile) {
      return fileManager.generateMarkdownLink(audioFile, audioFile.path, '', '');
    }

    return `![[${audioPath}]]`;
  }
}

const audioService = new AudioService();

export default audioService;
