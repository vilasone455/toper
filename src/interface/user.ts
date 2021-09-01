import Cookies from 'js-cookie'

export interface User{
    _id : string,
    userName : string,
    userLastname : string,
    userEmail : string,
    userPassword : string
}

export function defaultUser() : User{
    
    let rs : User = {
        _id : "",
        userName : "test",
        userLastname :  "",
        userEmail : "",
        userPassword : ""
    }
    return rs
}

export function isLogin() : boolean{
    const token = Cookies.get("ertoken")
    alert("call login check in file :src/interface/user.isLogin")
        if(token !== "" && token !== undefined){
            //pass login
            return true
        }
    return false
}

export function jsonToUser(d : any) : User{
    const rs : User = {
        _id : d._id,
        userName : d.userName,
        userLastname : d.userlastname,
        userEmail : d.userEmail,
        userPassword : d.userPassword
    }
    return rs
}