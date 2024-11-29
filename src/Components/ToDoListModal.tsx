import { useState } from "react";
import { Task, Project } from "../Interfaces";

interface ToDoListModalProps{
    onAdd : (name : string, description : string) => void, 
    onClose : () => void
}

function ToDoListModal(props : ToDoListModalProps){
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')

    return(
        <div className="todomodal">
            <form onSubmit={(e) => {
                e.preventDefault()
                props.onAdd(name, description);
            }}> 
            <input type="text" id="name" value = {name} onChange={(e) => setName(e.target.value)} />
            <input type="text" id="description" value = {description} onChange={(e) => setDescription(e.target.value)} />
            <button type="submit">Add Task</button>
            <button type="button" onClick={props.onClose}>Cancel</button>
            </form>
        </div>
    )
}

export default ToDoListModal;