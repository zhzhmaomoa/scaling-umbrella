export async function handleQuery(){
    const res = await fetch("/friendlyOctoCouscous/api/memory",{
        method:"GET",
    });
    const res2 = await res.text();
    const result = JSON.parse(res2);
    console.log(result);
    if(result.code === 200){
        return result.data;
    }else{
        return [];
    }
}