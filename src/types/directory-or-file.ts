export interface Directory {
  type: 'directory'
  entries: Record<string, DirectoryOrFile>
}

export interface File {
  type: 'file'
  url: string
}

export type DirectoryOrFile = Directory | File
