import { useState, Dispatch, SetStateAction } from 'react'
import {Project}from '../Interfaces/index'
import ProjectModal from './ProjectModal'
import { Plus } from 'lucide-react'
import { X } from "lucide-react";
import { supabase } from "../supabaseclient";


interface ProjectListProps {
    projects: Project[];
    setProjects: Dispatch<SetStateAction<Project[]>>;
    onProjectClick : (currProject : Project) => void
    onProjectRemove : (projectId : number) => void
}

function ProjectList(props : ProjectListProps){
    const [showAddProject, setAddProject] = useState(false)

    //adds it to database 
    async function addProjectToDb(name: string, description: string) {
        const { data, error } = await supabase
          .from('projects')
          .insert([{ name, description }])
          .select()
        return { data, error }
    }

    async function handleAddProject(name : string, description : string){
        const { data, error } = await addProjectToDb(name, description)

        if (!data || !data[0]) {
            console.error('No data returned from database')
            return
        }

        if (error){
            console.error('Error adding project: ', error)
            return
        }

        const newProject: Project = {
            
            name: name,
            description: description,
            id: data[0].id,
            todos: [],  // starts as empty array of Tasks
        };

        console.log(newProject)
        props.setProjects([...props.projects, newProject])
        toggleForm()
    }

    function toggleForm(){
        setAddProject(!showAddProject);
    }


    return (
        <div className="project-list">
            <h1>Projects</h1>
            {showAddProject && <ProjectModal onAdd={handleAddProject} onClose={toggleForm}/>}
            {!showAddProject && (
                <>
                    {props.projects.map((project: Project) => (
                        <div key={project.id} className="project-item">
                            <div className="project-content" onClick={() => props.onProjectClick(project)}>
                                <h3>{project.name}</h3>
                                <p>{project.description}</p>
                            </div>
                            <button className="project-delete">
                                <X size={30} onClick={() => props.onProjectRemove(project.id)}/>
                            </button>
                        </div>
                    ))}
                    <button onClick={toggleForm}><Plus /></button>
                </>
            )}

        </div>
    )
}

export default ProjectList;