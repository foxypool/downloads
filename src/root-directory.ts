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
            '1.8.2.giga14': makeDirectoryForGigahorseRelease('1.8.2.giga14'),
            '1.8.2.giga20': makeDirectoryForGigahorseRelease('1.8.2.giga20'),
            '1.8.2.giga21': makeDirectoryForGigahorseRelease('1.8.2.giga21'),
            '1.8.2.giga22': makeDirectoryForGigahorseRelease('1.8.2.giga22'),
            '2.1.1.giga22': makeDirectoryForGigahorseRelease('2.1.1.giga22'),
          },
        },
        'foxy-farmer': {
          type: 'directory',
          entries: {
            latest: {
              type: 'link',
              pointsTo: '1.10.0',
            },
            '1.9.1': makeDirectoryForFoxyFarmerRelease('1.9.1'),
            '1.10.0': makeDirectoryForFoxyFarmerRelease('1.10.0'),
          },
        },
        'foxy-gh-farmer': {
          type: 'directory',
          entries: {
            latest: {
              type: 'link',
              pointsTo: '1.4.0',
            },
            '1.1.1': makeDirectoryForFoxyGhFarmerRelease('1.1.1'),
            '1.2.0': makeDirectoryForFoxyGhFarmerRelease('1.2.0'),
            '1.2.1': makeDirectoryForFoxyGhFarmerRelease('1.2.1'),
            '1.2.2': makeDirectoryForFoxyGhFarmerRelease('1.2.2'),
            '1.2.3': makeDirectoryForFoxyGhFarmerRelease('1.2.3'),
            '1.3.0': makeDirectoryForFoxyGhFarmerRelease('1.3.0'),
            '1.4.0': makeDirectoryForFoxyGhFarmerRelease('1.4.0'),
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

function makeDirectoryForGigahorseRelease(version: string): Directory {
  return makeDirectoryFromGithubRelease({
    repo: 'madMAx43v3r/chia-gigahorse',
    tag: `v${version}`,
    files: [
      `chia-gigahorse-farmer-${version}-aarch64.tar.gz`,
      `chia-gigahorse-farmer-${version}-windows.zip`,
      `chia-gigahorse-farmer-${version}-x86_64.tar.gz`,
    ],
  })
}

function makeDirectoryForFoxyFarmerRelease(version: string): Directory {
  return makeDirectoryFromGithubRelease({
    repo: 'foxypool/foxy-farmer',
    tag: version,
    files: [
      'foxy-farmer-macos-latest.zip',
      'foxy-farmer-ubuntu-latest.zip',
      'foxy-farmer-windows-latest.zip',
    ],
  })
}

function makeDirectoryForFoxyGhFarmerRelease(version: string): Directory {
  return makeDirectoryFromGithubRelease({
    repo: 'foxypool/foxy-gh-farmer',
    tag: version,
    files: [
      'foxy-gh-farmer-ubuntu-latest.zip',
      'foxy-gh-farmer-windows-latest.zip',
    ],
  })
}
