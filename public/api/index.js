export async function handleQuery(pageNum,pageSize,generateTable){
    const res = await fetch("/friendlyOctoCouscous/api/memory?pageNum="+pageNum+"&pageSize="+pageSize,{
        method:"GET",
    });
    const res2 = await res.text();
    const result = JSON.parse(res2);
    console.log(result);
    if(result.code === 200){
        generateTable(pageNum,result.data);
    }else{
        generateTable(pageNum,[]);

    }
}