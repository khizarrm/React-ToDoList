import { useEffect, useState } from "react";
import ProjectModal from "./Components/ProjectModal";
import { Project, Task } from "./Interfaces";
import ProjectList from "./Components/ProjectList";
import ToDoList from "./Components/ToDoList";
import { supabase } from "./supabaseclient";


function App() {
    //core application data
    const [projects, setProjects] = useState<Project[]>([])

    useEffect(() => {
      const fetchProjects = async () => {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            tasks(*) 
          `)  
    
        if (error) {
          console.error('Error fetching projects:', error.message)
          return
        }
    
        if (data) {
          // Transform data to match your interface
          const projectsWithTodos = data.map(project => ({
            ...project,
            todos: project.tasks || []  // map tasks to todos
          }))
          setProjects(projectsWithTodos)
        }
      }
  
      fetchProjects()
  }, [])
    
    //states and views for app
    const [showProjects, setShowProjects] = useState(true)
    const [showToDos, setToDos] = useState(false)
    const[currProject, setCurrProject] = useState<Project | null>(null)

    function handleProjectClick(project : Project){
      console.log("curr project", currProject)
        setToDos(true) 
        setShowProjects(false)
        setCurrProject(project)
        console.log("curr project", currProject)
    }

    function handleToDoBack(){
        setToDos(false)
        setShowProjects(true)
        setCurrProject(null)
    }
    
    async function removeProjectDb(projectId: number){
      const {data, error} = await supabase
        .from("projects")
        .delete()
        .eq('id', projectId)
      return {data, error}
    }


    async function removeProject(projectId : number){
        const {data, error} = await removeProjectDb(projectId);

        if (error){
          console.error("Error removing project", error)
          return 
        }

        setProjects(projects.filter(item => item.id !== projectId))
    }

    function addProjectTodo(project: Project, todo: Task) {
        const updatedProject = {
            ...project,
            todos: [...project.todos, todo]
        };

        setCurrProject(updatedProject);
    
        // Update in projects array
        setProjects(projects.map(p => 
            p.id === project.id ? updatedProject : p
        ));
    }

    async function removeToDoDb(projectId : number, todoId : number){
      const {data, error} = await supabase
        .from("tasks")
        .delete()
        .eq('id', todoId)
      return {data, error}
    }
    
    async function removeProjectTodo(projectId: number, todoId: number) {
      const {data, error} = await removeToDoDb(projectId, todoId)
      if (error){
        console.error("Error removing the todo", error)
      }
    
      const projectToUpdate = projects.find(p => p.id === projectId)

      if (projectToUpdate) {
          // Create new todos array without the task
          const updatedTodos = projectToUpdate.todos.filter(t => t.id !== todoId)
          
          // Create updated project with new todos array
          const updatedProject = {
              ...projectToUpdate,
              todos: updatedTodos
          }

          setCurrProject(updatedProject)

          // Update projects array
          setProjects(projects.map(p => 
              p.id === projectId ? updatedProject : p
          ))
      }
    }
    
    return (
        <div className="content">
            {showProjects && 
                <ProjectList projects={projects} setProjects={setProjects} onProjectClick={handleProjectClick} onProjectRemove={removeProject}/>
            }


            {showToDos && 
                <ToDoList project={currProject} onBack={handleToDoBack} addToDos={addProjectTodo} removeToDo={removeProjectTodo}/> 
            }
        </div>

    )
}

export default App;