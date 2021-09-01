export interface Project{
    Id ?: string;
    ProjectName : string;
    ProjectDescription : string;
    UserId : string;
    VisibleStatus : number;
    ShareUrl : string;
    ProjectDetail : string;
}

export function defaultProject() : Project{
    let rs : Project = {
        Id : "",
        ProjectName : "" ,
        ProjectDescription : "",
        UserId : "",
        VisibleStatus : 1,
        ShareUrl  : "",
        ProjectDetail : ""
    }
    return rs
}

export function defaultProjects() : Project[]{
    return []
}

export function jsonToProject(d : any) : Project{
    let rs : Project = {
            Id : d._id,
		    ProjectName : d.projectName,
			ProjectDescription : d.projectDescription,
			ProjectDetail : "",
			VisibleStatus :  d.visibleStatus,
			UserId :  d.user,
			ShareUrl : ""
    }
    return rs
}

export function projectToJson(p : Project) {
    let rs : any = {
        projectName : p.ProjectName,
        projectDescription : p.ProjectDescription,
        projectDetail : p.ProjectDetail,
        user : p.UserId,
        visibleStatus : p.VisibleStatus,
        shareUrl : p.ShareUrl
    }
    return rs
}