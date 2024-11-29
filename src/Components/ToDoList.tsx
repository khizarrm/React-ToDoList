import ToDoListModal from '../Components/ToDoListModal'
import { useState } from 'react'
import { Project, Task } from '../Interfaces'
import { supabase } from "../supabaseclient";

interface ToDoListProps{
    project : Project, 
    onBack : () => void,
    addToDos : (project: Project, task : Task) => void,
    removeToDo : (projectId: number, todoId : number) => void
}

function ToDoList(props : ToDoListProps){
    const [showForm, setForm] = useState(false)

    async function addTaskToDb(name: string, completed : boolean){
        const {data, error} = await supabase
            .from("tasks")
            .insert([{name, completed, project_id : props.project.id}])
            .select()
        return {data, error}
    }
    
    async function handleAddTask(name : string){
        const {data, error } = await addTaskToDb(name, false);

        if (error){
            console.error("Error adding to do list task", error)
            return
        }

        if (!data || !data[0]) {
            console.error('No data returned from database')
            return
        }
        
        const newTask = {
            name : name, 
            completed : false, 
            id : data[0].id, 
        }


        props.addToDos(props.project, newTask)
        toggleForm()
    }


    function toggleForm(){
        setForm(!showForm);
    }

    return(
        <div className="todolist">
            <h1>{props.project.name} : To-Do List</h1>
            {showForm && 
                <ToDoListModal onAdd={handleAddTask} onClose={toggleForm}/>
            }
            {!showForm && (
                <>
                    {props.project?.todos.map((task: Task) => (
                        <div key={task.id} className="todo-item">
                            <h3>{task.name}</h3>
                            <button onClick = {() => props.removeToDo(props.project.id, task.id)}>Remove</button>
                        </div>
                    ))}
                    <button onClick={toggleForm}>Add New Task</button>
                    <button onClick = {props.onBack}>Go Back</button>
                </>
            )}
        </div>
    )
}

export default ToDoList;