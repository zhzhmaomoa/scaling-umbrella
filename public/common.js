let timer = null;
export function throttle(func){
    if(timer){
        return;
    }else{
        func();
        timer = setTimeout(()=>{
            clearTimeout(timer)
            timer = null;
        },1000)
    }
}