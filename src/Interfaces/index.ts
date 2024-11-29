export interface Task{
    name : string, 
    completed : boolean, 
    id : number
}

export interface Project{
    name : string, 
    description : string, 
    id : number
    todos : Task[]
}

