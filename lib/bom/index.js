let bom = {
    queryString:{
        get:function(name){
            let getAll = function(searchString){
                let query = searchString.replace(/^\?/,'');
                let queryResult = {};
                query.split('&').filter(f=>f).forEach(string=>{
                    let parts = string.split('=');
                    queryResult[parts[0]] = decodeURIComponent(parts[1])
                })
                return queryResult;
            }
            if(arguments.length){
                return getAll(location.search)[name];
            }else{
                return getAll(location.search);
            }
        },
        set:function(name,value){
            let set = function(search,name,value){
                let regex = new RegExp('('+encodeURIComponent(name)+')=([^&]*)'); 
                if(regex.test(search)){
                    //如果replace的第一个参数是正则，那么久可以拿到matchs
                    return search.replace(regex,(matchs,c1,c2)=>`${c1}=${encodeURIComponent(value)}`)
                }else{
                    return search.replace(/&?$/,'&'+encodeURIComponent(name)+'='+encodeURIComponent(value))
                }
            }
            if(arguments.length===1&&typeof name==='object'&&typeof name!=='null'){
                let search = location.search;
                for(let key in arguments[0]){
                    search = set(search,key,arguments[0][key])
                }
                location.search = search;
            }else{
                location.href = set(location.search,name,value);
            }
        }
    }
}