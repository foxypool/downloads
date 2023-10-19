export interface Directory {
  type: 'directory'
  entries: Record<string, DirectoryOrFileOrLink>
}

export interface File {
  type: 'file'
  url: string
}

export interface Link {
  type: 'link'
  pointsTo: string
}

export type DirectoryOrFile = Directory | File

export type DirectoryOrFileOrLink = DirectoryOrFile | Link
