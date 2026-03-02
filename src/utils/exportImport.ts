import { Match, Player } from '../types'

export interface ExportData {
  players: Player[]
  matches: Match[]
  exportedAt: string
  version: string
}

export function exportData(players: Player[], matches: Match[]): string {
  const data: ExportData = {
    players,
    matches,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  }
  return JSON.stringify(data, null, 2)
}

export function downloadJSON(filename: string, data: string) {
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function importData(jsonString: string): ExportData {
  const data = JSON.parse(jsonString) as ExportData
  
  if (!data.players || !data.matches) {
    throw new Error('Неверный формат файла')
  }
  
  return data
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Не удалось прочитать файл'))
      }
    }
    reader.onerror = () => reject(new Error('Ошибка чтения файла'))
    reader.readAsText(file)
  })
}
