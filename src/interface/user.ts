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