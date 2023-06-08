import React from "react";
import { useState } from "react";
import { getAllTask, getAllActivity, getAllTaskActivity, addTaskActivity} from "../utils/HandleApi";
import { useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import Select from 'react-select';


const Ta = ({ id, text }) => {
  const [activity, setActivity] = useState([]);
  const [task, setTask] = useState([]);
  const [taskActivity, setTaskActivity] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [newRow, setNewRow] = useState({ activity: null });


  useEffect(() => {
    getAllTask(setTask);
    getAllActivity(setActivity);
    getAllTaskActivity(setTaskActivity);
  }, []);


  const handleAddRow = () => {
    if (newRow.activity) {
      const newActivity = newRow.activity;
  
      const newRowData = {
        task_id: id,
        activity_id: newActivity.value,
        activity_desc: newActivity.label,
      };
  
      setTaskActivity((prevTaskActivity) => [...prevTaskActivity, newRowData]);
      setSelectedActivities((prevSelectedActivities) => [
        ...prevSelectedActivities,
        newActivity.value,
      ]);
      setNewRow({ activity: null });
    }
  };
  
  
  
  const handleDeleteRow = (taskActivityId) => {
    const deletedActivity = taskActivity.find(
      (item) => item.taskActivity_id === taskActivityId
    );
  
    if (deletedActivity) {
      setTaskActivity((prevTaskActivity) =>
        prevTaskActivity.filter((item) => item.taskActivity_id !== taskActivityId)
      );
  
      setSelectedActivities((prevSelectedActivities) =>
        prevSelectedActivities.filter((id) => id !== deletedActivity.activity_id)
      );
    }
  };
  


  const openModal = (event) => {
    setSelectedActivities([]);
    setNewRow({ activity_id: "", activity_desc: "" });
  
    setIsModalOpen(true);
    const searchText = text;
    const matchingTask = task.find((task) => task.task_desc === searchText);
    if (matchingTask) {
      const matchingActivities = taskActivity.filter(
        (activity) => activity.task_id === matchingTask.task_id
      );
      const activityIds = matchingActivities.map((activity) => activity.activity_id);
      setSelectedActivities(activityIds);
      setNewRow({ ...newRow, id: matchingTask.task_id }); // Set the id for the new row
    } else {
      console.log(`No match found for "${searchText}"`);
    }
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
  };




  const handleSave = (e) => {
    e.preventDefault();
    addTaskActivity(id, selectedActivities)
  };

  

  return (
    <div className="task">
      <div className="main">
        <div className="text">
          <b>{text}</b>
        </div>
        <button onClick={openModal} className="modal-btn">
          Edit
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <form>
            <label>
              Your task:
              <input type="text" value={text} readOnly={true} />
            </label>
            <div className="modal-body">
              <div className="modal-top">
                <h2>Selected Activities</h2>
              </div>
            </div>
          </form>

          <table className="act-table">
            <thead>
              <tr>
                <th>Activity Description</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
                {taskActivity.map((item) => {
                  if (
                    selectedActivities.some(
                      (selectedItem) =>
                        selectedItem === item.activity_id && id === item.task_id
                    )
                  ) {
                    return (
                      <tr key={item.taskActivity_id}>
                        <td>{item.activity_desc}</td>
                        <td>
                          <button onClick={() => handleDeleteRow(item.taskActivity_id)} className="ta-item-delete">
                            <AiFillDelete/>
                          </button>
                        </td>
                      </tr>
                    );
                  }
                  return null;
                })}
                <tr>
                <td>
                  <Select
                    className="ta-select"
                    value={newRow.activity}
                    onChange={(selectedOption) => setNewRow({ activity: selectedOption })}
                    options={activity
                      .filter(
                        (item) =>
                          item.task_id !== id &&
                          !selectedActivities.includes(item.activity_id)
                      )
                      .map((item) => ({
                        value: item.activity_id,
                        label: item.activity_desc,
                      }))}
                    isClearable
                    isSearchable
                  />
                </td>
                  <td>
                    <button onClick={handleAddRow} className="ta-act-add">+</button>
                  </td>
                </tr>
              </tbody>
          </table>
          <button onClick={handleSave} className="modal-btn">
            Save
          </button>
          <button onClick={closeModal} className="modal-btn">
            Close
          </button>
        </div>
        
      )}
    </div>
  );
};


export default Ta;