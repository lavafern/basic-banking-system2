const generateaAccNumber = () => {
    let result = ''
    for (let index = 0; index < 11; index++) {
        const num = Math.floor(Math.random() * 10) +1
        result += String(num)
    }

    return result
}

const validAccNumber = async (prismaq) => {
    while (true) {
        let bank_account_number = generateaAccNumber()
        const check = await prismaq({ 
            where: {
                bank_account_number : bank_account_number
            }
        })
        if (check.length === 0) return bank_account_number;
        }
    }


module.exports = {validAccNumber}