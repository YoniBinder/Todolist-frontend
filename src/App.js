import { MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact'
import { useEffect, useState} from 'react'
import './App.css';
import axios from 'axios'


export default function App() {
    let i=1
    const [modal, setModal] = useState({show:false})
    const [task, setTask] = useState('')
    const [list, setList]= useState([])

    useEffect(() => {
        getList()
    }, [])

    function getList() {
        axios.get('http://localhost:8000/api/tasks')
        .then((response)=>{    
            setList(response.data.data)
            })
        .catch((error)=>{
            console.log(error)
        })
    }

    function changeTaskState(e){
        let taskChange = e.target.value
        setTask(taskChange)
    }
    // To show Modal
    function toggle(id,process){
        
           setModal({
                show: !modal.show,
                TaskID: id,
                Process:process
            });
    }

    // Create new task
    function createTask(task){
        axios.post(`http://localhost:8000/api/task`,
        {done:0,task_name:task})
        .then((response)=>{    
            setList(response.data.data)
            setModal({show:false})
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    // update an existing task
    function updateTask(task){
        axios.put(`http://localhost:8000/api/tasks/${modal.TaskID}`,
        {done:0,task_name:task})
        .then((response)=>{    
            setList(response.data.data)
            setModal({show:false})
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    // delete an existing task
    function deleteTask(){
        axios.delete(`http://localhost:8000/api/tasks/${modal.TaskID}`)
        .then((response)=>{    
            setList(response.data.data)
            setModal({show:false})
            })
        .catch((error)=>{
            console.log(error)
        })
    }
    // add line-through the task as completed
    function done(id){
        let taskDone=0;
        let index=list.findIndex((obj)=>{return obj.id===id})
        if(list[index].done===0){
            taskDone=1
        }
        axios.put(`http://localhost:8000/api/tasks/${id}`,
        {done:taskDone,task_name:list[index].task_name})
        .then((response)=>{    
            setList(response.data.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    return (
        <div>
            {/* Task Table  */}
            <table id="todoList">
            <tr>
                <th >
                    <button onClick={() => toggle(null,'create')} type="button" id="create-border">
                        <span id="create">+</span>
                    </button>
                    <span style={{float:'right',fontSize:"20px",marginTop:"5px",marginRight:"5px"}}>משימות</span>
                </th>
            </tr>
            <div style={{width:"300px",height:"300px", overflowY:"scroll"}}>
            { list.length>0&&list.map((obj)=>
                <tr >
                    <td key={obj._id} style={{width:"285px"}}>
                        
                        <button onClick={() => toggle(obj.id,'destroy')} type="button" id="delete">X</button>
                        
                        {obj.done===1?(
                        <span>
                            <button onClick={() => done(obj.id)} style={{float:'right',padding:'8px',borderRadius:'5px',backgroundColor:'grey'}}></button>    
                        
                        <span id="done">
                           
                            <span style={{fontWeight:"bold",fontSize:"15px"}}>{i++}.</span>
                            <span>{obj.task_name}</span>
                        </span>
                        </span>
                            ):(
                        <span>
                            <button onClick={() => done(obj.id)} style={{float:'right',padding:'8px',borderRadius:'5px',backgroundColor:'lightgrey'}}></button>    
                        <span id="undone">
                            
                            <span style={{fontWeight:"bold",fontSize:"15px"}}>{i++}.</span>
                            <span onClick={() => toggle(obj.id,'update')} style={{cursor:'pointer'}}>{obj.task_name}</span>
                        </span>
                        </span>
                        )}
                          
                    </td>
                </tr>
                )
            }
            </div>
            <tr >
                <td id="last" style={{textAlign:"center",backgroundColor:"white",padding:"1px",borderBottom:"1px lightgrey solid"}}>
              <span style={{float:"right",marginRight:"10px"}} > לסיום:<span style={{fontWeight:"bold"}}>{list.filter((obj)=>{return obj.done===0}).length}</span></span>
              <span> הושלמו:<span style={{fontWeight:"bold"}}>{list.filter((obj)=>{return obj.done===1}).length}</span></span>
              <span style={{float:"left",marginLeft:"10px"}}> סה"כ:<span style={{fontWeight:"bold"}}>{list.length}</span></span>
              </td>
            </tr>
            </table>

            {/* Modal  */}
            <MDBModal isOpen={modal.show} toggle={toggle} backdrop={false}>
            {modal.Process==='create'&&
            <div style={{textAlign:'right'}} >
                <MDBModalHeader>הוספת משימה</MDBModalHeader>
                <MDBModalBody>
                  
                    <label htmlfor="taskName" > שם המשימה:</label><br/>
                    <input onChange={changeTaskState} type="text" id="taskName" name="taskName" />
                </MDBModalBody>
                <MDBModalFooter>
                    <button onClick={()=>createTask(task)} className="btn btn-primary">אישור</button>
                    <button className="btn btn-secondary" onClick={toggle}>ביטול</button>
                    
                </MDBModalFooter>
                </div>
            }
            {modal.Process==='update'&&<div  style={{textAlign:'right'}}>
                <MDBModalHeader>עריכת משימה</MDBModalHeader>
                <MDBModalBody autoFocus={false}>
                    <label htmlfor="taskName">שם המשימה:</label><br/>
                    <input onChange={changeTaskState} type="text" id="taskName" name="taskName" defaultValue={list[list.findIndex((obj)=>{return obj.id===modal.TaskID})].task_name}/>
                </MDBModalBody>
                <MDBModalFooter>
                  <button onClick={()=>updateTask(task)} className="btn btn-primary">אישור</button>
                  <button className="btn btn-secondary" onClick={toggle}>ביטול</button>
                  
                </MDBModalFooter>
                </div>
            }   
            {modal.Process==='destroy'&&<div  style={{textAlign:'right'}} >
                <MDBModalHeader>מחיקת משימה</MDBModalHeader>
                <MDBModalBody>
                האם למחוק את המשימה?
                </MDBModalBody>
                <MDBModalFooter>
                <button onClick={deleteTask} className="btn btn-primary">כן</button>
                  <button className="btn btn-secondary" onClick={toggle}>לא</button>
                 
                </MDBModalFooter>
                </div>
            }
            </MDBModal>
        </div>
    )
}
