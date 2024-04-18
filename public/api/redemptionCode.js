export async function asyncQuery(pageNum,pageSize){
    try {
        const res = await fetch("/platform/api/redemptionCode?pageNum="+pageNum+"&pageSize="+pageSize,{
            method:"GET",
        });
        const res2 = await res.text();
        const result = JSON.parse(res2);
        console.log(result);
        if(result.code === 200){
            return result.data;
        }else{
            return []
        }
    } catch (error) {
        console.error(error)
        return [];
    }
}
export async function asyncAdd(addForm){
    try {
        await fetch("/platform/api/redemptionCode",{
            method:"POST",
            body:new FormData(addForm)
        })
    } catch (error) {
        console.error(error)
    }
}
export async function asyncDeleteOne(rowData){
    try {
        await fetch("/platform/api/redemptionCode",{
            method:'DELETE',
            headers:{ "Content-Type": "application/json"},
            body:JSON.stringify({id:rowData.id})
        })
    } catch (error) {
        console.error(error)
    }
}
export async function asyncEdit(editForm){
    try {
        await fetch("/platform/api/redemptionCode",{
            method:'PUT',
            body:new FormData(editForm)
        })
    } catch (error) {
        console.error(error)
    }

}
