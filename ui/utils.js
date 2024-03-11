export const $ = q => document.querySelector(q);
export const $$ = q => Array.from(document.querySelectorAll(q));

export function cycle(min, max , n){
    if(n<min) return max;
    if(n>max) return min;
    return n;
}

export  const wait = (n=0) => new Promise(res => setTimeout(res, n));

