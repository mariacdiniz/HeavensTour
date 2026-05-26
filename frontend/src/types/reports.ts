export interface ReportDashboard {
  naoVendidas: number
  porDecada: { decada: number; quantidade: number }[]
  porFabricante: { fabricante: string; quantidade: number }[]
  ultimaSemana: number
}
