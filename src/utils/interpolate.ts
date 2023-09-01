import roundNumber from "./roundNumber";

export default function interpolate (dataList: Array<Record<string, any>>, key: string) {
    if (!dataList.length) return []
    
    const result: Array<Record<string, number>> = [];
    let start = 0;
    let end = 0;
    
    while (end < dataList.length) {
        const endValue = dataList[end][key];
        const startValue = dataList[start][key];
        if (endValue > 0) {
            const delta = (endValue - startValue) / (end - start)
            for (let i = start; i <= end; i++) {
                if (i === start) {
                    result[i] = dataList[i]
                } else {
                    
                    result[i] = {
                        ...dataList[i],
                        [key]: roundNumber(result[i - 1][key] + delta, 3)
                    }
                }
            }
            start = end;
        } else {
            result[end] = {
                ...dataList[end],
                [key]: 0
            }
        }
        end++
    }

    return result;
}