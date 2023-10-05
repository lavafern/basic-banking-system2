const generateaAccNumber = () => {
    let result = ''
    for (let index = 0; index < 11; index++) {
        const num = Math.floor(Math.random() * 10) +1
        result += String(num)
    }

    return result
}

module.exports = {generateaAccNumber}