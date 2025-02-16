import {Directory, DirectoryOrFile} from './types/directory-or-file'
import {rootDirectory} from './root-directory'
import {Format} from './types/format'

function getDirectoryOrFile(uri: string): DirectoryOrFile|undefined {
  const components = uri.split('/').filter(component => component !== '')
  let current: DirectoryOrFile = rootDirectory
  for (const component of components) {
    if (current.type === 'file') {
      return
    }
    let child = current.entries[component]
    if (child?.type === 'link') {
      child = current.entries[child.pointsTo] as DirectoryOrFile
    }
    if (child === undefined) {
      return
    }

    current = child
  }

  return current
}

function trim(src: string): string {
  return src
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join('\n')
}

function formatName(name: string): string {
  if (name.length > 50) {
    return name.slice(0, 47) + '..>'
  }

  return name
}

function makeDirectoryHtml(uri: string, directory: Directory): string {
  const prev = `<a href="../">../</a>`
  const entries = Object.entries(directory.entries).map(([name, directoryOrFile]) => {
    const nameForHtml = encodeURI(name) + (directoryOrFile.type === 'directory' || directoryOrFile.type === 'link' ? '/' : '')

    return `<a href="${nameForHtml}" title="${nameForHtml}">${formatName(nameForHtml)}</a>`
  })
  const listing = [prev, ...entries].join('\n')

  return trim(`
    <html lang="en">
    <head><title>Index of ${uri}</title></head>
    <body style="background-color: white"><h1>Index of ${uri}</h1><hr><pre>${listing}</pre><hr>
    </body>
    </html>
  `)
}

export default {
  async fetch(request: Request, env: object, ctx: ExecutionContext) {
    if (request.method !== 'GET') {
      return new Response(null, { status: 400 })
    }

    const url = new URL(request.url)
    const format: Format = url.searchParams.get('format') as Format|null ?? Format.html
    const uri = url.pathname
    const directoryOrFile = getDirectoryOrFile(uri)
    if (directoryOrFile === undefined) {
      if (format === Format.json) {
        return Response.json('404 Not found', { status: 404 })
      }

      return new Response('404 Not found', { status: 404 })
    }
    if (directoryOrFile.type === 'file') {
      const { headers, body: stream } = await fetch(directoryOrFile.url, {
        headers: request.headers,
        cf: {
          cacheTtl: 10 * 60,
          cacheEverything: true,
        },
      })
      const response = new Response(stream, { headers })
      response.headers.set('Cache-Control', 'public, max-age=600')

      return response
    }
    if (format === Format.json) {
      return Response.json(directoryOrFile)
    }

    return new Response(makeDirectoryHtml(uri, directoryOrFile), { headers: { 'content-type': 'text/html; charset=utf-8'}})
  }
}
