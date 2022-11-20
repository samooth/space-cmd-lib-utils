const path = require('path')
const fs = require('fs')

const PATHS_SEARCH = ['./', '~/', '/etc']

function readConf (_conf, fp) {
  let conf = _conf || {}

  let cf = null

  try {
    cf = JSON.parse(fs.readFileSync(fp))
  } catch (e) {
    console.error('Error: conf file invalid', e)
    process.exit(-1)
  }

  for (const k in cf) {
    conf[k] = cf[k]
  }

  return conf
}

function findFileInPath (paths_aux, sfx) {
  let found = null

  let paths = PATHS_SEARCH

  if (paths_aux) {
    paths = paths.concat(paths_aux)
  }

  paths.forEach(d => {
    if (found) {
      return
    }

    const fn = path.join(d, '.hyper-hosts')

    if (!fs.existsSync(fn)) {
      return
    }

    try {
      found = fs.readFileSync(fn, 'utf8')
    } catch (e) {}
  })

  return found
}

function resolveHostToKey(paths_aux, name) {
  let found = findFileInPath(paths_aux, '.hyper-hosts')

  if (!found) {
    return name
  }

  try {
    found = (found || '').split("\n")
  } catch (e) {
    return name
  }

  if (!Array.isArray(found)) {
    return name
  }

  return found.filter(l => {
    return l.startsWith(name)
  })[0] || name
}

function resolveIdentity(paths_aux) {
  return findFileInPath(paths_aux, '.hyper-id')
}

module.exports = {
  readConf: readConf,
  resolveToKey: resolveToKey
}
