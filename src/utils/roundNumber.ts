export default function roundNumber (n: number, digit = 2) {
    return Math.round(n * (10**digit)) / (10**digit)
}