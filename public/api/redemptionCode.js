export async function asyncQuery(pageNum,pageSize,handleTbody){
    try {
        const res = await fetch("/friendlyOctoCouscous/api/redemptionCode?pageNum="+pageNum+"&pageSize="+pageSize,{
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
        await fetch("/friendlyOctoCouscous/api/redemptionCode",{
            method:"POST",
            body:new FormData(addForm)
        })
    } catch (error) {
        console.error(error)
    }
}
export function asyncDeleteOne(addForm,pageNum,pageSize,){

}
export function asyncEdit(addForm,pageNum,pageSize,){

}
