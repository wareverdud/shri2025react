export function convertDate(dayOfYear: string) {
    if (isNaN(Number(dayOfYear))) {
        return ''
    }

    const months = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
    ]

    const date = new Date(new Date().getFullYear(), 0)
    date.setDate(Number(dayOfYear))

    const day = date.getDate()
    const month = months[date.getMonth()]

    return `${day} ${month}`
}
