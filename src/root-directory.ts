import {Directory, File} from './types/directory-or-file'

export const rootDirectory: Directory = {
  type: 'directory',
  entries: {
    chia: {
      type: 'directory',
      entries: {
        gigahorse: {
          type: 'directory',
          entries: {
            '1.8.2.giga14': makeDirectoryFromGithubRelease({
              repo: 'madMAx43v3r/chia-gigahorse',
              tag: 'v1.8.2.giga14',
              files: [
                'chia-gigahorse-farmer-1.8.2.giga14-aarch64.tar.gz',
                'chia-gigahorse-farmer-1.8.2.giga14-windows.zip',
                'chia-gigahorse-farmer-1.8.2.giga14-x86_64.tar.gz',
              ],
            }),
          },
        },
        'foxy-farmer': {
          type: 'directory',
          entries: {
            '1.9.1': makeDirectoryFromGithubRelease({
              repo: 'foxypool/foxy-farmer',
              tag: '1.9.1',
              files: [
                'foxy-farmer-macos-latest.zip',
                'foxy-farmer-ubuntu-latest.zip',
                'foxy-farmer-windows-latest.zip',
              ],
            }),
            latest: {
              type: 'link',
              pointsTo: '1.9.1',
            },
          },
        },
        'foxy-gh-farmer': {
          type: 'directory',
          entries: {
            '1.1.1': makeDirectoryFromGithubRelease({
              repo: 'foxypool/foxy-gh-farmer',
              tag: '1.1.1',
              files: [
                'foxy-gh-farmer-ubuntu-latest.zip',
                'foxy-gh-farmer-windows-latest.zip',
              ],
            }),
            latest: {
              type: 'link',
              pointsTo: '1.1.1',
            },
          },
        },
      },
    },
  },
}


function makeDirectoryFromGithubRelease({ repo, tag, files }: { repo: string, tag: string, files: string[] }): Directory {
  return {
    type: 'directory',
    entries: files.reduce((entries: Record<string, File>, file: string) => {
      entries[file] = {
        type: 'file',
        url: `https://github.com/${repo}/releases/download/${tag}/${file}`,
      }

      return entries
    }, {}),
  }
}
