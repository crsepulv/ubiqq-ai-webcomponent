export interface StorageLocationResponse {
  response: StorageData;
  container: string;
  blobName: string;
}

interface StorageData {
  container: string;
  token: string;
  uri: string;
}

export type FilesTranscriptedList = FilesResults[];

interface Alias {
  alias: string
}

export interface FilesResults {
  name: string;
  url: string;
  metadata?: Alias,
  date: Date
}
