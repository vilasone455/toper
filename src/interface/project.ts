export interface Project{
    Id : string;
    ProjectName : string;
    ProjectDescription : string;
    UserId : string;
    VisibleStatus : number;
    ShareUrl : string;
    ProjectDetail : string;
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