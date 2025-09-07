export const useDifference = <T>(objectToInspect: T, objectToCompare: T) : Partial<T> => {
    const result : Partial<T> = {};

    for(const k in objectToInspect) {
       const key = k as keyof T;

       if(objectToInspect[key] !== objectToCompare[key]) {
        result[key] = objectToInspect[key]
       }
    }
    
    return result;
}