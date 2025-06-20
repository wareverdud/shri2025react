export const getCurrentDate = () => {
    const today = new Date()

    const dd = today.getDate().toString().padStart(2, '0')
    const mm = (today.getMonth() + 1).toString().padStart(2, '0')
    const yy = (today.getFullYear() % 100).toString().padStart(2, '0')

    return `${dd}.${mm}.${yy}`
}
