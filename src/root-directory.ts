import {Directory} from './types/directory-or-file'
import {arrayOfKeysToObject} from './array-to-object'
import {drPlotterVersions, foxyFarmerVersions, foxyGhFarmerVersions, gigahorseVersions} from './versions'

export const rootDirectory: Directory = {
  type: 'directory',
  entries: {
    chia: {
      type: 'directory',
      entries: {
        gigahorse: {
          type: 'directory',
          entries: {
            ...arrayOfKeysToObject(gigahorseVersions, makeDirectoryForGigahorseRelease),
          },
        },
        'foxy-farmer': {
          type: 'directory',
          entries: {
            latest: {
              type: 'link',
              pointsTo: foxyFarmerVersions.at(-1) as string,
            },
            ...arrayOfKeysToObject(foxyFarmerVersions, makeDirectoryForFoxyFarmerRelease),
          },
        },
        'foxy-gh-farmer': {
          type: 'directory',
          entries: {
            latest: {
              type: 'link',
              pointsTo: foxyGhFarmerVersions.at(-1) as string,
            },
            ...arrayOfKeysToObject(foxyGhFarmerVersions, makeDirectoryForFoxyGhFarmerRelease),
          },
        },
        drplotter: {
          type: 'directory',
          entries: {
            '0.9.0': makeDirectoryFromGithubRelease({
              repo: 'foxypool/downloads',
              tag: 'binaries',
              files: [
                'drplotter-0.9.0-x86_64.tar.gz',
              ],
            }),
            ...arrayOfKeysToObject(drPlotterVersions, makeDirectoryForDrPlotterRelease),
          },
        },
      },
    },
  },
}


function makeDirectoryFromGithubRelease({ repo, tag, files }: { repo: string, tag: string, files: string[] }): Directory {
  return {
    type: 'directory',
    entries: arrayOfKeysToObject(files, file => ({
      type: 'file',
      url: `https://github.com/${repo}/releases/download/${tag}/${file}`,
    })),
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

function makeDirectoryForDrPlotterRelease(version: string): Directory {
  return makeDirectoryFromGithubRelease({
    repo: 'drnick23/drplotter',
    tag: version,
    files: [
      `drplotter-${version}-x86_64.tar.gz`,
    ],
  })
}

function makeDirectoryForFoxyFarmerRelease(version: string): Directory {
  return makeDirectoryFromGithubRelease({
    repo: 'foxypool/foxy-farmer',
    tag: version,
    files: [
      'foxy-farmer-macos.zip',
      'foxy-farmer-ubuntu.zip',
      'foxy-farmer-windows.zip',
    ],
  })
}

function makeDirectoryForFoxyGhFarmerRelease(version: string): Directory {
  return makeDirectoryFromGithubRelease({
    repo: 'foxypool/foxy-gh-farmer',
    tag: version,
    files: [
      'foxy-gh-farmer-ubuntu.zip',
      'foxy-gh-farmer-windows.zip',
    ],
  })
}
