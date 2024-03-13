export const $ = q => document.querySelector(q);
export const $$ = q => Array.from(document.querySelectorAll(q));

export function cycle(min, max , n){
    if(n<min) return max;
    if(n>max) return min;
    return n;
}

export  const wait = (n=0) => new Promise(res => setTimeout(res, n));

/**
 * Copy the Key and values from source to target , usefull when target is const
 * @param {object} source 
 * @param {object} target 
 */
export function copyObject(source,target){
    for(let key in source){
        target[key] = source[key];
    }
}

export function argMin(arr){
    let i=0;
    let min = arr[0];
    for(let a=1; a<arr.length ; a++){
        if(arr[a] < min){
            i=a;
            min = arr[a];
        }
    }
    return i;
}

export function argsMin(arr){
    let mi = [];
    let min = arr[0];
    
    for(let i=1; i < arr.length ; i++){
        if(arr[i]<min) min = arr[i];
    }

    for(let i=0; i<arr.length ; i++){
        if(arr[i] == min){
            mi.push(i);
        }
    }

    return mi;
}