import { useEffect, useState,useRef} from 'react'
import { Button,Modal } from 'react-bootstrap';
import './App.css';
import axios from 'axios'


export default function App() {
    let index=1
    const [task, setTask] = useState('')
    const [list, setList]= useState([])
    const inputEl = useRef(null);
    
    const [show, setShow] = useState({modal:false});

    const handleClose = () => setShow({modal:false});

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
        
           setShow({
                modal: true,
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
            handleClose()
            // setModal({show:false})
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    // update an existing task
    function updateTask(task){
        axios.put(`http://localhost:8000/api/tasks/${show.TaskID}`,
        {done:0,task_name:task})
        .then((response)=>{    
            setList(response.data.data)
            handleClose()
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    // delete an existing task
    function deleteTask(){
        axios.delete(`http://localhost:8000/api/tasks/${show.TaskID}`)
        .then((response)=>{    
            setList(response.data.data)
            handleClose()
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
            <table id="todoList" style={{width:"300px"}}>
            <thead>
            <tr>
                <th >
                    <button onClick={()=>toggle(null,'create')} type="button" id="create-border">
                        <span id="create">+</span>
                    </button>
                    <span style={{float:'right',fontSize:"20px",marginTop:"5px",marginRight:"5px"}}>משימות</span>
                </th>
            </tr>
            </thead>
            <tbody style={{overflowY:"scroll",width:"300px",display:"block",height:"320px"}}>
            { list.length>0&&list.map((obj)=>
                <tr key={obj.id} >
                    <td  style={{width:"285px"}}>
                        
                        <button onClick={() => toggle(obj.id,'destroy')} type="button" id="delete">X</button>
                        
                        {obj.done===1?(
                        <span>
                            <button onClick={() => done(obj.id)} style={{float:'right',padding:'8px',borderRadius:'5px',backgroundColor:'grey'}}></button>    
                            <span id="done" style={{fontWeight:"bold",fontSize:"15px"}}>{index++}.{obj.task_name}</span>
                        </span>
                            ):(
                        <span>
                            <button onClick={() => done(obj.id)} style={{float:'right',padding:'8px',borderRadius:'5px',backgroundColor:'lightgrey'}}></button>    
                        <span id="undone">
                            
                            <span style={{fontWeight:"bold",fontSize:"15px"}}>{index++}.</span>
                            <span onClick={() => toggle(obj.id,'update')} style={{cursor:'pointer'}}>{obj.task_name}</span>
                        </span>
                        </span>
                        )}
                          
                    </td>
                </tr>
                )
            }
            </tbody>
            <tbody >
                <tr>
                    <td id="last" style={{height:"5px",textAlign:"center",backgroundColor:"white",padding:"1px",borderBottom:"1px lightgrey solid"}}>
                        <span style={{float:"right",marginRight:"10px"}} > לסיום:<span style={{fontWeight:"bold"}}>{list.filter((obj)=>{return obj.done===0}).length}</span></span>
                        <span> הושלמו:<span style={{fontWeight:"bold"}}>{list.filter((obj)=>{return obj.done===1}).length}</span></span>
                        <span style={{float:"left",marginLeft:"10px"}}> סה"כ:<span style={{fontWeight:"bold"}}>{list.length}</span></span>
                    </td>
                </tr>
            </tbody>
            
            </table>


            {/* Modal  */}
             <Modal backdrop={false} style={{textAlign:'right'}} show={show.modal}  >
             {show.Process==='create'&& <div> 
                <Modal.Header onEntered={()=>inputEl.current.focus()}>
                <Modal.Title>הוספת משימה</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <label htmlFor="taskName">שם המשימה:</label><br/>
                <input ref={inputEl} onChange={changeTaskState} type="text" id="taskName" name="taskName" />
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={()=>createTask(task)}>
                    אישור
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    ביטול
                </Button>
                </Modal.Footer>
                </div>  }
                {show.Process==='update'&& <div> 
                <Modal.Header onEntered={()=>inputEl.current.focus()}>
                <Modal.Title>עריכת משימה</Modal.Title>
                </Modal.Header >
                <Modal.Body>
                <label htmlFor="taskName">שם המשימה:</label><br/>
                <input ref={inputEl} onChange={changeTaskState} type="text" id="taskName" name="taskName" defaultValue={list[list.findIndex((obj)=>{return obj.id===show.TaskID})].task_name} />
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={()=>updateTask(task)}>
                    אישור
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    ביטול
                </Button>
                </Modal.Footer>
                </div>  }
                {show.Process==='destroy'&& <div> 
                <Modal.Header>
                <Modal.Title>מחיקת משימה</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                האם למחוק את המשימה?
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={deleteTask(task)}>
                    אישור
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    ביטול
                </Button>
                </Modal.Footer>
                </div>  }

            </Modal>
            </div>
    )
         
}
