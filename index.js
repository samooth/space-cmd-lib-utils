const path = require('path')
const fs = require('fs')

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

function resolveToKey(name) {
  let found = null

  ['./', '~/', '/etc'].forEach(d => {
    const path = path.join(d, '.hyper-hosts')

    if (!fs.existsSync(path)) {
      return
    }

    let data = fs.readFileSync(path)

    found = data.split("\n")
  })

  return data.filter(l => {
    return l.startsWith(name)
  })[0] || name
}

module.exports = {
  readConf: readConf,
  resolveToKey: resolveToKey
}
