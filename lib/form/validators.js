//获取字符串length(中文字符占2)
function getCharLength(str){
    return String(str).trim().split('').map(str=>str.charCodeAt).map(n=>(n<0||n>255)?'aa':'a').join('').length;
}
const Validators = {
    required:(str='',{message=''}={})=>{
        return{
            status:!(getCharLength(str)===0),
            message
        }
    },
    minAndMax:(str='',{min=0,max=100,message=''}={})=>{
        let length = getCharLength(str);
        return{
            status:!(length<min||length>max),
            message
        }
    },
    equalOtherValue:(str='',{otherForm='',message=''}={})=>{
        return{
            status:$(otherForm).value===str,
            message
        }
    },
    email:(str='',{message=''}={})=>{
        return{
            status: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(str),
            message
        }
    },
    tel:(str,{message=''}={})=>{
        return{
            status: /^1[3|4|5|7|8][0-9]{9}$/.test(str),
            message
        }
    }
}