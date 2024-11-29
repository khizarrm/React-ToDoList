import { useState } from "react";

interface ProjectModalProps{
    onClose : () => void,
    onAdd: (name : string, description : string) => void
}

function ProjectModal(props : ProjectModalProps){
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    return(
        <div className = 'project-form'>
            <form onSubmit={(e) => {
                e.preventDefault()
                props.onAdd(name, description) //kinda passes this as a parent function
            }}>
                <input type="text" id="name" placeholder="Enter Project Name Here" value={name} onChange={(e) => setName(e.target.value)}/>
                <input type="text" id="description" placeholder="Enter Project Description Here" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <button type="submit">Add Project</button>
                <button type="button" onClick={props.onClose}>Cancel</button>
            </form>
        </div>
    )
}

export default ProjectModal;