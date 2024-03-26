import {Directory} from './types/directory-or-file'
import {arrayOfKeysToObject} from './array-to-object'
import {
  allFoxyFarmerVersions,
  drPlotterVersions,
  foxyFarmerVersions,
  oldFoxyFarmerVersions,
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
              pointsTo: allFoxyFarmerVersions.at(-1) as string,
            },
            ...arrayOfKeysToObject(oldFoxyFarmerVersions, makeFoxyFarmerReleaseFactory({ haveMacOsArmRelease: false })),
            ...arrayOfKeysToObject(foxyFarmerVersions, makeFoxyFarmerReleaseFactory({ haveMacOsArmRelease: true })),
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
            '0.9.2': makeDirectoryFromGithubRelease({
              repo: 'drnick23/drplotter',
              tag: '0.9.2',
              files: [
                `drplotter-0.9.2-x86_64.tar.gz`,
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
      `drplotter-${version}-x86-64.tar.gz`,
    ],
  })
}

interface MakeFoxyFarmerReleaseFactoryOptions {
  haveMacOsArmRelease: boolean
}

function makeFoxyFarmerReleaseFactory(options: MakeFoxyFarmerReleaseFactoryOptions): (version: string) => Directory {
  const files: string[] = [
    'foxy-farmer-macos.zip',
    'foxy-farmer-ubuntu.zip',
    'foxy-farmer-ubuntu-20.04.zip',
    'foxy-farmer-windows.zip',
  ]
  if (options.haveMacOsArmRelease) {
    files.unshift('foxy-farmer-macos-arm64.zip')
  }

  return (version: string): Directory => {
    return makeDirectoryFromGithubRelease({
      repo: 'foxypool/foxy-farmer',
      tag: version,
      files,
    })
  }
}
