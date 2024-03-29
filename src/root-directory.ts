import {Directory} from './types/directory-or-file'
import {arrayOfKeysToObject} from './array-to-object'
import {
  drPlotterVersions,
  foxyFarmerVersions,
  gigahorseVersions,
} from './versions'

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
            ...arrayOfKeysToObject(['0.9.2'], makeDrPlotterReleaseFactory(version => [
              `drplotter-${version}-x86_64.tar.gz`,
            ])),
            ...arrayOfKeysToObject(['0.10.0', '0.11.0'], makeDrPlotterReleaseFactory(version => [
              `drplotter-${version}-x86-64.tar.gz`,
            ])),
            ...arrayOfKeysToObject(drPlotterVersions, makeDrPlotterReleaseFactory(version => [
              `drplotter-${version}-x86_64.tar.gz`,
            ])),
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

function makeDrPlotterReleaseFactory(filesFactory: (version: string) => string[]): (version: string) => Directory {
  return (version: string) => {
    return makeDirectoryFromGithubRelease({
      repo: 'drnick23/drplotter',
      tag: version,
      files: filesFactory(version),
    })
  }
}

function makeDirectoryForFoxyFarmerRelease(version: string): Directory {
  return makeDirectoryFromGithubRelease({
    repo: 'foxypool/foxy-farmer',
    tag: version,
    files: [
      'foxy-farmer-macos.zip',
      'foxy-farmer-macos-arm64.zip',
      'foxy-farmer-ubuntu.zip',
      'foxy-farmer-ubuntu-20.04.zip',
      'foxy-farmer-windows.zip',
    ],
  })
}
