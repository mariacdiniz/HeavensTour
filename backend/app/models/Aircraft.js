const mongoose = require('mongoose')
const { normalizeManufacturer } = require('../utils/manufacturer')
const { validateIcaoCode } = require('../utils/icao')
const { applyAutonomyFields } = require('../utils/autonomy')

const aircraftSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    marca: { type: String, required: true, trim: true },
    ano: { type: Number, required: true, min: 1950 },
    descricao: { type: String, required: true },
    vendido: { type: Boolean, default: false },
    icaoCode: { type: String, required: true, unique: true, uppercase: true },
    capacidadeCombustivel: { type: Number, required: true, min: 0 },
    consumoMedio: { type: Number, required: true, min: 0 },
    autonomiaKm: { type: Number, required: true },
    categoriaAutonomia: {
      type: String,
      enum: ['Curta', 'Média', 'Longa'],
      required: true,
    },
    imagemUrl: { type: String },
    criadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
  },
  { timestamps: true },
)

aircraftSchema.index({ marca: 1 })
aircraftSchema.index({ ano: 1 })
aircraftSchema.index({ vendido: 1 })
aircraftSchema.index({ createdAt: -1 })

aircraftSchema.pre('validate', function normalize() {
  if (this.marca) {
    this.marca = normalizeManufacturer(this.marca)
  }
  if (this.icaoCode && this.marca) {
    this.icaoCode = validateIcaoCode(this.icaoCode, this.marca)
  }
  if (
    this.capacidadeCombustivel != null &&
    this.consumoMedio != null
  ) {
    applyAutonomyFields(this)
  }
})

module.exports = mongoose.model('Aircraft', aircraftSchema)
