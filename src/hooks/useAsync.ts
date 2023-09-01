import { useState } from "react";

export default function useAsync<R, P extends any[] = any[]> (asyncFunction: (...args: P) => Promise<R>): [R|null, boolean, typeof asyncFunction] {
    const [data, setData] = useState<R | null>(null)
    const [loading, setLoading] = useState(false)
    const excute = async (...args: Parameters<typeof asyncFunction>) => {
        setLoading(true)
        const res = await asyncFunction(...args)
        setData(res)
        setLoading(false)
        return res
    }

    return [data, loading, excute]
}