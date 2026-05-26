const net = require('net')

function wait(host, port, label, max = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0
    const tryConnect = () => {
      const socket = net.connect(port, host, () => {
        socket.end()
        console.log(`${label} disponível`)
        resolve()
      })
      socket.on('error', () => {
        attempts += 1
        if (attempts >= max) {
          reject(new Error(`${label} indisponível após ${max} tentativas`))
          return
        }
        setTimeout(tryConnect, 1000)
      })
    }
    tryConnect()
  })
}

async function main() {
  await wait('mongo', 27017, 'MongoDB')
  await wait('localstack', 4566, 'LocalStack')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
