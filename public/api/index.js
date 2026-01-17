export async function asyncQuery(pageNum,pageSize){
    try {
        const res = await fetch("/api/memory?"+new URLSearchParams({pageNum,pageSize}).toString(),{
            method:"GET",
        });
        const result = await res.json();
        if(result.isSuccess){
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
        const res = await fetch("/api/memory",{
            method:"POST",
            body:new FormData(addForm)
        })
        const result = await res.json();
        if(!result.isSuccess){
            throw "请求失败"
        }
    } catch (error) {
        console.error(error)
    }
}
export async function asyncDeleteOne(rowData){
    try {
        const res = await fetch("/api/memory",{
            method:'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: new URLSearchParams({id:rowData.id,src:rowData.src}).toString()
        })
        const result = await res.json();
        if(!result.isSuccess){
            throw "请求失败"
        }
    } catch (error) {
        console.error(error)
    }
}
export async function asyncEdit(editForm){
    try {
        const res = await fetch("/api/memory",{
            method:'PUT',
            body:new FormData(editForm)
        })
        const result = await res.json();
        if(!result.isSuccess){
            throw "请求失败"
        }
    } catch (error) {
        console.error(error)
    }

}
