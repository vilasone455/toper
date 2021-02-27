export interface User{
    Id : string,
    UserName : string,
    UserLastName : string,
    UserEmail : string,
    UserPassword : string
}

export function defaultUser() : User{
    let rs : User = {
        Id : "",
        UserName : "",
        UserLastName :  "",
        UserEmail : "",
        UserPassword : ""
    }
    return rs
}

export function jsonToUser(d : any) : User{
    const rs : User = {
        Id : d._id,
        UserName : d.userName,
        UserLastName : d.userlastname,
        UserEmail : d.userEmail,
        UserPassword : d.userPassword
    }
    return rs
}