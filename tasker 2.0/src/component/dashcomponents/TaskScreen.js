// HomeScreen.js
import React from 'react';
import { useState, useEffect } from 'react';
import { addTask, getAllTask, updateTask, deleteTask} from "../utils/HandleApi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Task from "./Task"

function TaskScreen() {
  
    const [task, setTask] = useState([])
    const [task_desc,setTaskdesc] = useState('')
    const[isUpdating, setIsUpdating] = useState(false)
    const[taskId, setTaskId] = useState()
  
    useEffect(() => {
      getAllTask(setTask)
    }, [])
  
    const updateMode = (_id, text) =>{
      setIsUpdating(true)
      setTaskdesc(text)
      setTaskId(_id)
    }
  
    const handleButtonClick = () => {
      if (typeof task_desc === 'string' && task_desc.trim() === '') {
        toast.warn('Input cannot be blank', { autoClose: 2000, toastClassName: 'toast-warning' });
      } else {
        if (isUpdating) {
          updateTask(taskId, task_desc, setTask, setTaskdesc, setIsUpdating);
          toast.success('Task Updated successfully', { autoClose: 2000, toastClassName: 'toast-success' });
        } else {
          addTask(task_desc, setTaskdesc, setTask);
          toast.success('Task Added successfully', { autoClose: 2000, toastClassName: 'toast-success' });
        }
      }
    };
    
  
    return (
      <div className="task-screen">
            <h1>Task Screen</h1>
            <div className="task-top">
              <input
              className="maininput"
              type="text" 
              placeholder="Add task..."
              value={task_desc}
              onChange={(e) => setTaskdesc(e.target.value)}
              />
                <div className="add" onClick={handleButtonClick}>
                    {isUpdating ? 'Update' : 'Add'}
                  </div>
            </div>
            <div className="task-list">
              {task.map((item) => <Task 
              key={item.task_id} 
              text={item.task_desc} 
              updateMode = {() => updateMode(item.task_id, item.task_desc)}
              deleteTask={()=> deleteTask(item.task_id,setTask)} />)}
            </div>
          </div>
    );
  }
  

export default TaskScreen;
