
export function formatAmount(amount) {
    if (typeof amount === 'string') {
        amount = parseFloat(amount);
    } else if (typeof amount === 'object') {
        amount = amount.toNumber()
    } else if (typeof amount !== 'number'){
        throw new Error("")
    }

    let formattedNumber = amount.toFixed(2);
    const parts = formattedNumber.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}

export function isDictEmpty(obj) {
  return Object.keys(obj).length === 0;
}