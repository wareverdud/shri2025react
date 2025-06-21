const BASE_URL = 'http://localhost:3000'

export const sendFormData = async (
    file: File,
    rows: number,
    onData: (obj: any) => void,
    onComplete: (obj: any) => void,
) => {
    const url = new URL(`${BASE_URL}/aggregate`)
    url.searchParams.set('rows', String(rows))

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(url.toString(), {
        method: 'POST',
        body: formData,
    })

    if (!response.ok || !response.body) {
        throw new Error()
    }

    let lastObj: any | null = null

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
        const { done, value } = await reader.read()
        if (done) {
            break
        }
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
            if (!line.trim()) {
                continue
            }
            const obj = JSON.parse(line)
            lastObj = obj
            onData(obj)
        }
    }

    if (buffer.trim()) {
        const obj = JSON.parse(buffer)
        lastObj = obj
        onData(obj)
    }

    onComplete(lastObj)
}

export const generateFile = async () => {
    const url = new URL(`${BASE_URL}/report`)
    url.searchParams.set('size', String(0.01))

    const response = await fetch(url.toString(), { method: 'GET' })

    if (!response.ok || !response.body) {
        throw new Error()
    }

    const blob = await response.blob()

    const urlBlob = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = urlBlob
    a.download = 'report.csv'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(urlBlob)
    }, 0)
}
