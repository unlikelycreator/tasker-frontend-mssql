import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // Set the base URL for all requests
  withCredentials: true,
});

// Set the default authorization header for all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    console.log(token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define your API endpoints
const baseurl = "/tasks";
const baseurlta = "/taskactivity";
const baseurlac = "/activities";
const baseurlItem = "/item";
const baseurlcust = "/customer";
const baseurlinvoice = "/invoice";

/*https://tasker-backend.onrender.com*/
/*http://localhost:5001*/

/*Get*/
const getAllTask = (setTask) => {
    axiosInstance.get(baseurl)
    .then(({data}) =>{
        console.log('data -->', data);
        setTask(data)
    })
}

const getAllActivity = (setActivity) => {
    axiosInstance.get(baseurlac)
    .then(({data}) =>{
        console.log('data -->', data);
        setActivity(data)
    })
}

const getAllTaskActivity = (setTaskActivity) => {
    axiosInstance.get(baseurlta)
    .then(({data}) =>{
        console.log('data -->', data);
        setTaskActivity(data)
    })
}

const getAllItems = (setItems) => {
    axiosInstance.get(baseurlItem)
  .then(({data}) =>{
      console.log('data -->', data);
      setItems(data)
  })
}

const getAllCustomers = (setCustomers) => {
    axiosInstance.get(baseurlcust)
    .then(({data}) =>{
        console.log('data -->', data);
        setCustomers(data)
    })
  }

  
const getAllInvoices = (setInvoice) =>{
    axiosInstance.get(baseurlinvoice)
    .then(({data}) =>{
        console.log('data -->', data);
        setInvoice(data)
    })
}

/*Add*/
const addTask = (task_desc, setText, setTask) =>{
    axiosInstance
    .post(`${baseurl}/save`,{task_desc})
    .then((data) =>{
        console.log(data);
        setText("")
        getAllTask(setTask)
    }).catch((err) => console.log(err))
}


const addActivity = (activity_desc, setActivitydesc, setActivity) =>{
    axiosInstance
    .post(`${baseurlac}/save`,{activity_desc})
    .then((data) =>{
        console.log(data);
        setActivitydesc("")
        getAllActivity(setActivity)
    }).catch((err) => console.log(err))
}

const addTaskActivity = (task_id, selectedActivities) => {
    axiosInstance
    .post(`${baseurlta}/save`,{task_id, selectedActivities})
    .then((data) => {
        console.log(data);
    }).catch((err) => console.log(err))
}

const addItem = (item_name, item_desc, item_price, setItems, setitemName, setitemDescription, setitemPrice) =>{
axiosInstance
  .post(`${baseurlItem}/save`,{item_name, item_desc, item_price})
  .then((data) =>{
      console.log(data);
      getAllItems(setItems)
      setitemName("")
      setitemDescription("")
      setitemPrice([])
  }).catch((err) => console.log(err))
}

const addCustomer = (customer_name, customer_address, setcustomerName, setcustomeAddress, setCustomers) =>{
    axiosInstance
    .post(`${baseurlcust}/save`,{customer_name, customer_address})
    .then((data) =>{
        console.log(data);
        getAllCustomers(setCustomers)
        setcustomerName("")
        setcustomeAddress("")
    }).catch((err) => console.log(err))
}

const addInvoice = (invoiceNo, name, date, rows, totalAmount, setName, setinvoiceNo, setRows, setTotalAmount, setInvoices) =>{
axiosInstance
.post(`${baseurlinvoice}/save`,{customer_name: name,invoice_no: invoiceNo,invoice_date: date, invoice_items: rows, invoice_amount: totalAmount})
.then((data) =>{
    console.log(data);
    getAllInvoices(setInvoices)
    setName([])
    setinvoiceNo([])
    setRows([])
    setTotalAmount([])
}).catch((err) => console.log(err))
}

/*Update*/
const updateTask = (task_id, task_desc, setTask, setTaskdesc, setIsUpdating) =>{
    axiosInstance
    .post(`${baseurl}/update`,{task_id, task_desc})
    .then((data) =>{
        setTaskdesc("")
        setIsUpdating(false)
        getAllTask(setTask)
    })
    .catch((err) => console.log(err))
}

const updateActivity = (ActivityID, activity_desc, setActivity, setActivitydesc, setIsUpdating) =>{
    axiosInstance
    .post(`${baseurlac}/update`,{activity_id: ActivityID, activity_desc})
    .then((data) =>{
        setActivitydesc("")
        setIsUpdating(false)
        getAllActivity(setActivity)
    })
    .catch((err) => console.log(err))
}

const updateItem = (item_id, item_name, item_desc, item_price, setItems, setitemName, setitemDescription, setitemPrice, setIsUpdating) =>{
    axiosInstance
  .post(`${baseurlItem}/update`,{item_id, item_name, item_desc, item_price})
  .then((data) =>{
        console.log(data)
        setitemName("")
        setitemDescription("")
        setitemPrice([])
        setIsUpdating(false)
        getAllItems(setItems)
  })
  .catch((err) => console.log(err))
}

const updateCustomer = (customer_id, customer_name, customer_address, setCustomers, setcustomerName, setcustomeAddress, setIsUpdating) =>{
    axiosInstance
    .post(`${baseurlcust}/update`,{customer_id, customer_name, customer_address})
    .then((data) =>{
          console.log(data)
          setcustomerName("")
          setcustomeAddress("")
          setIsUpdating(false)
          getAllCustomers(setCustomers)
    })
    .catch((err) => console.log(err))
  }

  const updateInvoice = (invoiceNo, name, date, rows, totalAmount, setInvoices) =>{
    axiosInstance
    .post(`${baseurlinvoice}/update`,{invoice_no: invoiceNo, customer_name: name, invoice_date: date, invoice_items: rows, invoice_amount: totalAmount})
    .then((data) =>{
          console.log(data)
          getAllInvoices(setInvoices)
    })
    .catch((err) => console.log(err))
  }


/*Delete*/

const deleteTask = (task_id, setTask) =>{
    axiosInstance
    .post(`${baseurl}/delete`,{task_id})
    .then((data) =>{
        console.log(data)
        getAllTask(setTask)
    })
    .catch((err) => console.log(err))
}

const deleteActivity = (activity_id, setActivity) =>{
    axiosInstance
    .post(`${baseurlac}/delete`,{activity_id: activity_id})
    .then((data) =>{
        console.log(data)
        getAllActivity(setActivity)
    })
    .catch((err) => console.log(err))
}

const deleteItem = (item_id, setItems) =>{
    axiosInstance
  .post(`${baseurlItem}/delete`,{item_id: item_id})
  .then((data) =>{
      console.log(data)
      getAllItems(setItems)
      console.log("Item deleted successfully")
  })
  .catch((err) => console.log(err))
}

const deleteCustomer = (customer_id, setCustomers) =>{
    axiosInstance
    .post(`${baseurlcust}/delete`,{customer_id})
    .then((data) =>{
        console.log(data)
        getAllCustomers(setCustomers)
        console.log("Customer deleted successfully")
    })
    .catch((err) => console.log(err))
  }

const deleteInvoice = (invoice_no, setInvoices) =>{
axiosInstance
.post(`${baseurlinvoice}/delete`,{invoice_no: invoice_no})
.then((data) =>{
    console.log(data)
    getAllInvoices(setInvoices)
    console.log("Customer deleted successfully")
})
.catch((err) => console.log(err))
}

export {getAllTask, addTask, updateTask, deleteTask,
    getAllActivity, addActivity, updateActivity, deleteActivity,
    getAllTaskActivity, addTaskActivity, 
    getAllItems, addItem, updateItem, deleteItem,
     getAllCustomers,addCustomer, updateCustomer, deleteCustomer,
    getAllInvoices, addInvoice,updateInvoice, deleteInvoice}