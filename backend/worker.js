/**
 * Worker placeholder — filas (Bull/BullMQ) podem ser plugadas aqui.
 * Por ora apenas confirma que o processo sobe (desafio estrutural).
 */
const logger = require('./app/observability/logger')

logger.info('HeavensTour worker — nenhum job configurado (stub)')

setInterval(() => {
  logger.debug('worker heartbeat')
}, 60_000)
