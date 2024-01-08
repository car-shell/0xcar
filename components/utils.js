
export function formatAmount(amount) {
    if (amount === undefined || amount === null) {
        return '--'
    }
    if (typeof amount === 'string') {
        if (amount.indexOf(",") != -1) {
            amount = amount.replaceAll(",", "")
        }
        amount = parseFloat(amount);
    } else if (typeof amount === 'bigint') {
        amount = Number(amount)
    } else if (typeof amount == 'number'){
       
    } else {
        console.log(`${amount} ${typeof amount}`);
    }

    let formattedNumber = amount.toFixed(2);
    const parts = formattedNumber.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}

export const n1e18 = 1000000000000000000n

export function isDictEmpty(obj) {
  return Object.keys(obj).length === 0;
}


const padStart = (x) => {
    return new Intl.NumberFormat(undefined, {
        minimumIntegerDigits: 2,
        useGrouping: false
    }).format(x)
} 
export const formatTime = (timestamp, needYear=false, onlyTime=false) => {
    let d = new Date(timestamp)
    if (onlyTime) {
        return `${padStart(d.getHours())}:${padStart(d.getMinutes())}:${padStart(d.getSeconds())}`
    }
    return `${needYear?padStart(d.getFullYear())+"-":""}${padStart(d.getMonth()+1)}-${padStart(d.getDate())} ${padStart(d.getHours())}:${padStart(d.getMinutes())}:${padStart(d.getSeconds())}`
}