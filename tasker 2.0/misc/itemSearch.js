import React from 'react';
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';


//Components import
import Task from "./dashcomponents/Task"
import Activity from "./dashcomponents/Activity"
import Ta from "./dashcomponents/taskActivity"


//Call Functions Import
import { addTask, getAllTask, updateTask, deleteTask} from "./utils/HandleApi";
import { addActivity, getAllActivity, updateActivity, deleteActivity} from "./utils/HandleApi";
import { getAllItems, addItem, updateItem, deleteItem } from "./utils/HandleApi";
import { getAllCustomers, addCustomer, updateCustomer, deleteCustomer } from "./utils/HandleApi";
import { getAllInvoices, addInvoice,updateInvoice, deleteInvoice} from "./utils/HandleApi";


//Icons Import
import { AiFillSchedule, AiOutlineClose, AiOutlineShoppingCart , AiFillCheckCircle, AiFillProject, AiFillDelete, AiOutlineSearch } from 'react-icons/ai'
import { HiOutlineMenu } from 'react-icons/hi'
import {BiEdit} from "react-icons/bi"
import { BsFillPersonFill } from 'react-icons/bs';
import {FiSearch} from 'react-icons/fi'


//CSS import
import "../css/Item.css"
import "../css/Menu.css"
import "../css/Invoice.css"
import "../css/Customer.css"
import "../css/dashboard.css"
import "../css/taskactivity.css"

//Pagination
import ReactPaginate from "react-paginate";

//Other imports 
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const userType = location.state ? location.state.userRole : '';

  function handleMenuClick(screen) {
    setActiveScreen(screen);
    setMenuOpen(false);
    console.log(userType)
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }
  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  };
  return (
    <div className="app-container">
    <button className="menu-toggle" onClick={toggleMenu}>
      <span>{menuOpen ? <AiOutlineClose size={20} /> : <HiOutlineMenu size={20} />}</span>
    </button>
    <div className={`menu-container ${menuOpen ? 'open' : ''}`}>
      <h1>Tasker</h1>
      <div className="menu-buttons">
        {userType === 'admin' && (
          <>
          <div className='authenticated-btn'>
            <button className={activeScreen === 'task' ? 'active' : ''} onClick={() => handleMenuClick('task')}>
              <AiFillSchedule size={20} /> &nbsp; Tasks
            </button>
            <button className={activeScreen === 'activity' ? 'active' : ''} onClick={() => handleMenuClick('activity')}>
              <AiFillCheckCircle size={20} />&nbsp; Activities
            </button>
            <button className={activeScreen === 'taskac' ? 'active' : ''} onClick={() => handleMenuClick('taskac')}>
              <AiFillProject size={20} />&nbsp; Task-Activity
            </button>
            <button className={activeScreen === 'items' ? 'active' : ''} onClick={() => handleMenuClick('items')}>
              <AiOutlineShoppingCart size={20} />&nbsp; Items
            </button>
            <button className={activeScreen === 'customer' ? 'active' : ''} onClick={() => handleMenuClick('customer')}>
              <BsFillPersonFill size={20} />&nbsp; Customers
            </button>
            <button className={activeScreen === 'invoice' ? 'active' : ''} onClick={() => handleMenuClick('invoice')}>
              <BsFillPersonFill size={20} />&nbsp; Invoice
            </button>
            </div>
            <button className='logout-btn' onClick={handleLogout}>Logout</button>
          </>
        )}
        {userType === 'user' && (
          <>
          <div className='authenticated-btn'>
            <button className={activeScreen === 'invoice' ? 'active' : ''} onClick={() => handleMenuClick('invoice')}>
              <BsFillPersonFill size={20} />&nbsp; Invoice
            </button>
            <button className='logout-btn' onClick={handleLogout}>Logout</button>
          </div>
          </>
        )}
      </div>
    </div>
    <div className="screen-container">
      {activeScreen === 'home' && <HomeScreen/>}
      {activeScreen === 'task' && <TaskScreen />}
      {activeScreen === 'activity' && <ActivityScreen />}
      {activeScreen === 'taskac' && <TaskAcScreen />}
      {activeScreen === 'items' && <ItemsScreen />}
      {activeScreen === 'customer' && <CustomerScreen />}
      {activeScreen === 'invoice' && <InvoiceScreen />}
    </div>
  </div>

);
}

function HomeScreen() {
  return (
    <div className='home-screen'>
      <h1 className='home-heading'>Welcome to Tasker</h1>
    </div>
  )
}

function TaskScreen() {
  
  const [task, setTask] = useState([])
  const [task_desc,setTaskdesc] = useState([])
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
            <div className="add" 
              onClick={ isUpdating ? 
              () => updateTask(taskId, task_desc, setTask, setTaskdesc, setIsUpdating)
              : () => addTask(task_desc, setTaskdesc, setTask)}>
                {isUpdating ? "Update": "Add"}
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


function ActivityScreen() {
  const [activity, setActivity] = useState([])
  const [activity_desc,setActivitydesc] = useState("")
  const[isUpdating, setIsUpdating] = useState(false)
  const[ActivityID, setActivityID] = useState()
  useEffect(() => {
    getAllActivity(setActivity)
  }, [])
  const updateMode = (_id, text) =>{
    setIsUpdating(true)
    setActivitydesc(text)
    setActivityID(_id)
  }
  return (
    <div className="task-screen">
          <h1>Activity Screen</h1>
          <div className="task-top">
            <input 
            className="maininput"
            type="text" 
            placeholder="Add Activity..."
            value={activity_desc}
            onChange={(e) => setActivitydesc(e.target.value)}
            />
            <div className="add" 
              onClick={ isUpdating ? 
              () => updateActivity(ActivityID, activity_desc, setActivity, setActivitydesc, setIsUpdating)
              : () => addActivity(activity_desc, setActivitydesc, setActivity)}>
                {isUpdating ? "Update": "Add"}
            </div>
          </div>
          <div className="task-list">
            {activity.map((item) => <Activity 
            key={item.activity_id} 
            text={item.activity_desc} 
            updateMode = {() => updateMode(item.activity_id, item.activity_desc)}
            deleteActivity={()=> deleteActivity(item.activity_id,setActivity)} />)}
          </div>
        </div>
  );
}


function TaskAcScreen() {
  const [task, setTask] = useState([])
  const [Activity, setActivity] = useState([])
  
  useEffect(() => {
    getAllTask(setTask)
    getAllActivity(setActivity)
  }, [])



  return (
    <div className="task-screen">
      <h1>All Task & Activities</h1>
      <div className="task-list">
      {task && task.length > 0 ? (
        task.map((task, index) => (
          <Ta
          key={index}
          id={task.task_id}
          text={task.task_desc}
          selectedoptions={task.selectedOptions}
          activities={Activity}
          />
        ))
      ) : (
        <p>No data found</p>
      )}
      </div>
    </div>
  );
}


function ItemsScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [item_name, setitemName] = useState("")
  const [item_desc, setitemDescription] = useState("")
  const [item_price, setitemPrice] = useState([])
  const[isUpdating, setIsUpdating] = useState(false)
  const[item_id, setitemId] = useState([])
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllItems(setItems);
  }, [])

  const openModal = (event) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdating(false)
    setitemId([])
    setitemName("")
    setitemDescription("")
    setitemPrice([])
  };

  const handleItemdelete = (e, _id) =>{
    e.preventDefault();
    deleteItem(_id, setItems)
  }

  const updateMode = (itemId, name, desc, price) =>{
    setIsUpdating(true)
    setitemId(itemId)
    setitemName(name)
    setitemDescription(desc)
    setitemPrice(price)
    setIsModalOpen(true);
  }

  useEffect(() => {
    setItemsPerPage(10); // or any other desired value
  },[]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0); // reset to first page of results
  };

  const filteredItems = items.filter((item) => {
    return (
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item_desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item_price.toString().includes(searchTerm)
    );
  });

  return (
    <div className="item-screen">
      <div className="item-container" >
        <h1>Items</h1>
        {isModalOpen && (
              <div className="item-modal-container">
                <div className="item-modal-input">
                  <label>Item Name:</label>
                  <input type="text" value={item_name} placeholder="Item Name" onChange={(e) => setitemName(e.target.value)} />
                  <label>Item Description:</label>
                  <input type="text" value={item_desc} placeholder="Item Description" onChange={(e) => setitemDescription(e.target.value)} />
                  <label>Item Price:</label>
                  <input type="number" step={0.01} value={item_price} placeholder="Item Price" onChange={(e) => setitemPrice(e.target.value)} />
                </div>
                <div className="item-modal-buttons">
                  <button className="item-modal-save" onClick={ isUpdating ? 
                    () => updateItem(item_id, item_name, item_desc, item_price, setItems, setitemName, setitemDescription, setitemPrice, setIsUpdating)
                    : () => addItem(item_name, item_desc, item_price, setItems, setitemName, setitemDescription, setitemPrice)}>
                    {isUpdating ? "Update": "Add"}
                  </button>
                  <button className="item-modal-close" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            )}
        <div className="item-search-container">
          <input
            className="item-search-input"
            type="text"
            placeholder="Search items"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="search-button">
            <FiSearch />
          </button>
        </div>
        <table className="item-table">
            <thead className="item-thead">
              <tr>
                <th>Item Name</th>
                <th>Item Description</th>
                <th>Item Price</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
          </thead>
          <tbody className="item-tbody">
          {filteredItems
            .sort((b, a) => b.item_name.localeCompare(a.item_name))
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((item) => (
              <tr key={item.item_id}>
                <td>{item.item_name}</td>
                <td>{item.item_desc}</td>
                <td>{item.item_price}</td>
                <td>
                  <BiEdit
                    className="icon"
                    onClick={() =>
                      updateMode(
                        item.item_id,
                        item.item_name,
                        item.item_desc,
                        item.item_price
                      )
                    }
                  />
                </td>
                <td>
                  <AiFillDelete
                    className="icon"
                    onClick={(e) => handleItemdelete(e, item.item_id)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
        </table>
        <ReactPaginate
            previousLabel={'<<'}
            nextLabel={'>>'}
            pageCount={Math.ceil(items.length / itemsPerPage)}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            containerClassName={'pagination'}
            activeClassName={'active'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
              />
      <button className="add-invoice-btn" onClick={openModal}>+</button>
    </div>
  </div>
);
}

function CustomerScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customer_name, setcustomerName] = useState("")
  const [customer_address, setcustomeAddress] = useState("")
  const[isUpdating, setIsUpdating] = useState(false)
  const[customer_id, setcustomerId] = useState([])
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllCustomers(setCustomers);
  }, [])

  const handleCustomerdelete = (e, _id) =>{
    e.preventDefault();
    deleteCustomer(_id, setCustomers)
  }

  const openModal = (event) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdating(false)
    setcustomerId([])
    setcustomerName("")
    setcustomeAddress("")
  };

  const updateMode = (customerId, name, address) =>{
    setIsModalOpen(true)
    setIsUpdating(true)
    setcustomerId(customerId)
    setcustomerName(name)
    setcustomeAddress(address)
  }
  useEffect(() => {
    setItemsPerPage(10); // or any other desired value
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0); // reset to first page of results
  };

  const filteredCustomers = customers.filter((item) => {
    return (
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
      <div className="customer-screen">
        <div className="customer-container" >
          <h1>Customers</h1>
          {isModalOpen && (
          <div className="customer-modal-container">
            <div className="customer-modal-input">
              <input  type="text" value={customer_name} placeholder="Customer Name" onChange={(e) => setcustomerName(e.target.value)} />
              <input  type="text" value={customer_address} placeholder="Customer Address" onChange={(e) => setcustomeAddress(e.target.value)} />
          </div>
          <div className="customer-modal-buttons">
              <button className="item-save-button" onClick={ isUpdating ? 
              () => updateCustomer(customer_id, customer_name, customer_address, setCustomers, setcustomerName, setcustomeAddress, setIsUpdating)
              : () => addCustomer(customer_name, customer_address, setcustomerName, setcustomeAddress, setCustomers)}>
                {isUpdating ? "Update": "Add"}</button>
                <button className="item-modal-close" onClick={closeModal}>
                      Close
                </button>
              </div>
          </div>
          )}
          <div className="customer-search-container">
            <input
              className="customer-search-input"
              type="text"
              placeholder="Search Customers"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="search-button">
              <FiSearch />
            </button>
          </div>
          <table className="customer-table">
              <thead className="customer-thead">
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Edit</th>
                  <th>Delete</th>
              </tr>
            </thead>
            <tbody className="customer-tbody">
            {filteredCustomers
              .sort((b, a) => b.customer_name.localeCompare(a.customer_name))
              .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
              .map((item) => (
                <tr key={item.customer_id}>
                  <td>{item.customer_name}</td>
                  <td>{item.customer_address}</td>
                  <td>
                    <BiEdit
                      className="icon"
                      onClick={() => updateMode(item.customer_id, item.customer_name, item.customer_address)}
                    />
                  </td>
                  <td>
                    <AiFillDelete
                      className="icon"
                      onClick={(e) => handleCustomerdelete(e, item.customer_id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            <ReactPaginate
                previousLabel={'<<'}
                nextLabel={'>>'}
                pageCount={Math.ceil(customers.length / itemsPerPage)}
                onPageChange={({ selected }) => setCurrentPage(selected)}
                containerClassName={'pagination'}
                activeClassName={'active'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
            />
      </div>
      <button className="add-invoice-btn" onClick={openModal}>+</button>
    </div>
  );
}



function InvoiceScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([])
  const [name, setName] = useState([])
  const [invoiceNo, setinvoiceNo] = useState([])
  const [date, setDate] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [rows, setRows] = useState([{ item_name: '', invoice_itemQuantity: 0, invoice_itemPrice: 0, invoice_itemTotal: 0 }]);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [customerCurrentPage, setCustomerCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [customersPerPage, setCustomersPerPage] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('customer_name');
  const [searchModal, setSearchModal] =useState(false)
  const [ItemSearchModal, setItemSearchModal] =useState(false)
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [customerSearchColumn, setCustomerSearchColumn] = useState('customer_name');
  const [itemSearchColumn, setItemSearchColumn] = useState('item_name');
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [itemCurrentPage, setItemCurrentPage] = useState(0);
  const [itemSearchResults, setItemSearchResults] = useState([]);
  
  // UseEffects to get data
  useEffect(() => {
    getAllCustomers(setCustomers);
    getAllItems(setItems)
    getAllInvoices(setInvoices)
  }, [])

 // UseEffects to for pagination
  useEffect(() => {
    setItemsPerPage(12); 
  }, []);


  useEffect(() => {
    setCustomersPerPage(8); 
  }, []);

   // UseEffects to get data based on edit selection and auto set invoice no.
  useEffect(() =>{
    if (isModalOpen){
      if (invoices.length > 0) {
        const sortedInvoices = [...invoices].sort((a, b) => b.invoice_no - a.invoice_no);
        const highestInvoiceNo = sortedInvoices[0].invoice_no;
        setinvoiceNo(parseInt(highestInvoiceNo) + 1);
      } else {
        setinvoiceNo(1);
      }
      setDate(new Date().toISOString().slice(0,10));
    }
  },[isModalOpen,invoices])


  useEffect(() => {
    const newTotalAmount = rows.reduce((acc, row) => acc + row.invoice_itemTotal, 0);
    setTotalAmount(newTotalAmount.toFixed(2));
    console.log(rows);
  }, [rows]);
  


  //Handle Modals
  const openModal = () => {
    setIsModalOpen(true);
  };
  const openSearchModal = () => {
    setSearchModal(true);
  };
  /*
  const openItemSearchModal = () => {
    setItemSearchModal(true);
  };
  */
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeSearchModal = () => {
    setSearchModal(false);
  };
  const openItemSearchModal = () => {
    setItemSearchModal(true);
  };
  const closeItemSearchModal = () => {
    setItemSearchModal(false);
  };

  //Handle Items
  function getItemPrice(itemName, items) {
    const selectedItem = items.find(item => item.item_name === itemName);
    return selectedItem ? selectedItem.item_price : 0;
  }


  function handleItemSelect(e, index) {
    const selectedValue = e.target.value;
    console.log("selected:", selectedValue)
    const selectedPrice = getItemPrice(selectedValue, items);
    setRows((rows) =>
    rows.map((row, i) => {
      if (i === index) {
        return { ...row, item_name: selectedValue, invoice_itemPrice: selectedPrice};
      } else {
        return row;
      }
    })
  );
  }

  function handleQuantityChange(e, index) {
    const { value } = e.target;
    const newRows = [...rows];
    newRows[index].invoice_itemQuantity = parseFloat(value, 3);
    newRows[index].invoice_itemTotal = newRows[index].invoice_itemQuantity * newRows[index].invoice_itemPrice;
    setRows(newRows);
  }

  function handlePriceChange(e,index){
    const {value} = e.target;
    const newRows = [...rows];
    newRows[index].invoice_itemPrice = parseFloat(value, 3);
    newRows[index].invoice_itemTotal = newRows[index].invoice_itemQuantity * newRows[index].invoice_itemPrice;
    setRows(newRows);
  }

  //Handle Rows in tables and data
  const tableRows = rows.map((row, index) => (
    <tr key={index}>
      <td className="invoice-table-cell">{index + 1}</td>
      <td className="invoice-table-cell">
      <div className="customer-input-container">
        <input
          type="text"
          className="invoice-input customer-input"
          id="customer-input"
          value={rows[index].item_name}
          readOnly
        />
        <button className="customer-input-button" onClick={openItemSearchModal}>
          <AiOutlineSearch/>
        </button>
        </div>
      </td>
      <td className="invoice-table-cell">
        <input
          type="number"
          className="invoice-input quantity-input"
          value={row.invoice_itemQuantity}
          onChange={(e) => handleQuantityChange(e, index)}
        />
      </td>
      <td className="invoice-table-cell">
        <input
          type="number"
          step="0.01"
          className="invoice-input price-input"
          onChange={(e) => handlePriceChange(e, index)}
          value={row.invoice_itemPrice}
        />
      </td>
      <td className="invoice-table-cell amount-cell">
          <input
              type="number"
              className="invoice-input price-input"
              step="0.01"
              value={row.invoice_itemTotal}
              readOnly={true}
            /></td>
      <td className="invoice-table-cell">
        <button onClick={() => handleDeleteRow(index)}  className="invoice-item-delete"><AiFillDelete/></button>
      </td>
    </tr>
  ));


  function addRow() {
    const newRows = [...rows, { item_name: '', invoice_itemQuantity: 0, invoice_itemPrice: 0, invoice_itemTotal: 0 }];
    setRows(newRows);
    console.log(rows)
  }

  function handleDeleteRow(index) {
    setRows((rows) => rows.filter((row, i) => i !== index));
  }


  const handleEditClick = (invoice_no) => {
    setEditMode(true);
    const invoiceItem = invoices.find(item => item.invoice_no === invoice_no);
    setName(invoiceItem.customer_name);
    setinvoiceNo(invoiceItem.invoice_no);
    setDate(invoiceItem.invoice_date);
    setRows(invoiceItem.invoice_items);
    setTotalAmount(invoiceItem.invoice_amount);
  };

  const handleBackClick = () => {
    setEditMode(false);
    setName([]);
    setinvoiceNo([]);
    setDate(null);
    setRows([]);
    setTotalAmount(0);
    console.log(rows)
  };


  //Handle CRUD
  const handleSaveInvoice = (e) => {
    e.preventDefault();
    addInvoice(invoiceNo, name, date, rows, totalAmount, setName, setinvoiceNo, setRows, setTotalAmount, setInvoices)
    console.log(name, invoiceNo, date, rows, totalAmount)
  }

  const handleUpdateInvoice = (e) => {
    e.preventDefault();
    updateInvoice(invoiceNo, name, date, rows, totalAmount, setInvoices)
  }
  const handleInvoiceDelete = (e, invoice_no) =>{
    e.preventDefault();
    deleteInvoice(invoice_no, setInvoices)
  }

  //Handle Search and Sort
  const sortedInvoices = invoices.sort((a,b) => b.invoice_no - a.invoice_no);
  const start = currentPage * itemsPerPage;
  const end = Math.min((currentPage + 1) * itemsPerPage, sortedInvoices.length);
  const displayedInvoices = sortedInvoices.slice(start, end);

  
  const filteredInvoices = displayedInvoices.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();
    const searchColumnLower = searchColumn.toLowerCase();

    if (searchColumnLower === 'invoice_date') {
      const invoiceDate = new Date(item.invoice_date).toLocaleDateString('en-GB');
      const searchValue = invoiceDate.toLowerCase();

      return searchValue.includes(searchTermLower);
    }

    const searchValue = String(item[searchColumn]).toLowerCase();

    return searchValue.includes(searchTermLower);
  });


  const filteredCustomers = customers.filter((customer) => {
    const searchTerm = customerSearchTerm.toLowerCase();
    const columnValue = customer[customerSearchColumn].toLowerCase();
  
    return columnValue.includes(searchTerm);
  });



  const handleCustomerRowDoubleClick = (customerName) => {
    setName(customerName);
    closeSearchModal(); 
  };




  const indexOfLastCustomer = (customerCurrentPage + 1) * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);



  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0); // reset to first page of results
  };


  const handleSearchColumnChange = (event) => {
    setSearchColumn(event.target.value);
  };


  const handleCustomerSearchColumnChange = (e) => {
    setCustomerSearchColumn(e.target.value);
  };


  // Handle customer search
  const handleCustomerSearch = (e) => {
    setCustomerSearchTerm(e.target.value);
  };



  const filteredItems = items.filter((item) => {
    const searchTerm = itemSearchTerm.toLowerCase();
    const columnValue = item[itemSearchColumn].toLowerCase();
  
    return columnValue.includes(searchTerm);
  });

  const ItemsPerPage = 6;
  const indexOfLastItem = (itemCurrentPage + 1) * ItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - ItemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  

  const handleItemSearchColumnChange = (event) => {
    setItemSearchColumn(event.target.value);
  };

  const handleItemSearch = (event) => {
    setItemSearchTerm(event.target.value);
  };

  
  const handleItemRowDoubleClick = (itemName) => {
    console.log(itemName)
    const selectedPrice = getItemPrice(itemName, items);
    setRows((rows) =>
      rows.map((row, index) => {
        if (index === currentItems) {
          return { ...row, item_name: itemName, invoice_itemPrice: selectedPrice };
        } else {
          return row;
        }
      })
    );
    closeItemSearchModal();
  };


  //Handle PDF Generation
  const generateInvoicePDF = () => {
    try {
      // Define the document definition
      const docDefinition = {
        content: [
          // Invoice Title
          { text: 'Invoice', fontSize: 24, bold: true, alignment: 'right', margin: [0, 0, 0, 10] },
          
          // Invoice From Section
          {
            text: 'Invoice From',
            fontSize: 16,
            bold: true,
            fillColor: '#007bff',
            color: '#007bff',
            margin: [0, 10, 0, 5],
            width: '50%',
            alignment: 'left',
          },
          { text: 'SR Consultants', fontSize: 12 },
          { text: '123 Street, City, Country', fontSize: 12 },
          { text: 'Pincode: 123456', fontSize: 12, margin: [0, 0, 0, 10] },
          
          // Invoice To Section
          {
            text: 'Invoice To',
            fontSize: 16,
            bold: true,
            fillColor: '#007bff',
            color: '#007bff',
            margin: [0, 10, 0, 5],
            width: '50%',
            alignment: 'right',
          },
          { text: `Customer Name: ${name}`,alignment: 'right', fontSize: 12 },
          { text: `Invoice Number: ${invoiceNo}`,alignment: 'right', fontSize: 12 },
          { text: `Invoice Date: ${formatDate(date)}`,alignment: 'right', fontSize: 12, margin: [0, 0, 0, 10] },
          
          // Table Section
          {
            style: 'table',
            table: {
              headerRows: 1,
              widths: [40, '*', 60, 60, '*'],
              body: [
                [{ text: 'Sr. No', style: 'tableHeader', alignment: 'center' }, 
                 { text: 'Item Name', style: 'tableHeader', alignment: 'center' }, 
                 { text: 'Quantity', style: 'tableHeader', alignment: 'center' }, 
                 { text: 'Price', style: 'tableHeader', alignment: 'center' }, 
                 { text: 'Amount', style: 'tableHeader', alignment: 'center' }],
                ...rows.map((row, index) => {
                  const itemName = items.find(item => item.item_id === row.item_id)?.item_name || '';
                  return [
                    { text: index + 1, alignment: 'center' },
                    { text: itemName, alignment: 'center' },
                    { text: row.invoice_itemQuantity, alignment: 'center' },
                    { text: row.invoice_itemPrice, alignment: 'center' },
                    { text: (row.invoice_itemQuantity * row.invoice_itemPrice).toFixed(2), alignment: 'center' },
                  ];
                }),
                ['', '', '', 'Total Amount:', { text: totalAmount, colSpan: 1, alignment: 'center' }] // Total Amount Row
              ],
            },
            layout: {
              hLineWidth: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 1 : 0; // Add horizontal lines only at the top and bottom
              },
              vLineWidth: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 1 : 0; // Add vertical lines only at the beginning and end
              },
              hLineColor: function (i, node) {
                return '#000'; // Set border color for horizontal lines
              },
              vLineColor: function (i, node) {
                return '#000'; // Set border color for vertical lines
              },
              paddingLeft: function(i, node) { return 5; },
              paddingRight: function(i, node) { return 5; },
              paddingTop: function(i, node) { return 3; },
              paddingBottom: function(i, node) { return 3; },
            },
          },
          
          // Footer Section
          {
            margin: [0, 50, 0, 0],
            columns: [
              { text: 'Terms and Conditions Applied', width: '50%', fontSize: 10 },
              { text: 'Generated by Tasker', width: '50%', fontSize: 10, alignment: 'right' },
            ],
          },
          
          // Signature Section
          {
            margin: [0, 50, 0, 0],
            columns: [
              { text: 'Signature:', width: '50%', fontSize: 10 },
              { text: 'Hritik J Pawar', width: '50%', fontSize: 10, alignment: 'right' },
            ],
          },
        ],
        defaultStyle: {
          font: 'Roboto',
          fontSize: 12,
          lineHeight: 1.5,
        },
        styles: {
          tableHeader: {
            bold: true,
            fillColor: '#007bff',
            color: '#fff',
          },
        },
      };
  
      // Generate the PDF
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.download('invoice.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${padZero(day)}/${padZero(month)}/${year}`;
  };
  
  const padZero = (number) => {
    return number.toString().padStart(2, '0');
  };
  
 


  return (
      <div className="invoice-screen">
          {editMode ? (
            <div className="edit-screen">
              <button onClick={handleBackClick} className="top-back-btn">Back</button>
              <h1 className="edit-invoice-heading">EDIT INVOICE</h1>
              <div className="edit-invoice-details">
                <div className="edit-customer-details">
                  <label className="invoice-label" htmlFor="customer-select">Customer Name:</label>
                  <div className='edit-customer-input-div'>
                    <div className="customer-input-container">
                      <input
                        type="text"
                        className="customer-input"
                        id="customer-input"
                        value={name || ""}
                        readOnly
                      />
                      <button className="customer-input-button" onClick={openSearchModal}>
                        <AiOutlineSearch/>
                      </button>
                  </div>
                </div>
                  <div className="edit-invoice-number">
                    <label htmlFor="invoice-number">Invoice Number</label>
                    <input type="text" id="invoice-number" defaultValue={invoiceNo} onChange={(e) => setinvoiceNo(e.target.value)} readOnly/>
                  </div>
                  <div className="edit-invoice-date">
                    <label htmlFor="invoice-date">Invoice Date</label>
                    <input type="date" className="invoice-input" id="date-input" defaultValue={date ? new Date(date).toISOString().substring(0, 10) : ""} onChange={(e) => setDate(e.target.value)}/>
                  </div>
                </div>
                <div className="edit-invoice-items">
                  <h2 className="items-heading">Items</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
   
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <td className="invoice-table-cell">{index + 1}</td>
                        <td className="invoice-table-cell">
                          <select
                            className="invoice-select item-select"
                            value={row.invoice_item}
                            onChange={(e) => handleItemSelect(e, index)}
                          >
                            {row.item_id ? (
                              <>
                                <option key={row.item_id} value={row.item_name}>
                                  {row.item_name}
                                </option>
                                {items.map((item) => (
                                  <option key={item.item_name} value={item.item_name}>
                                    {item.item_name}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <>
                                <option>Select Value</option>
                                {items.map((item) => (
                                  <option key={item.item_name} value={item.item_name}>
                                    {item.item_name}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>
                        </td>
                        <td className="invoice-table-cell">
                          <input
                            type="number"
                            step="0.01"
                            className="invoice-input quantity-input"
                            value={row.invoice_itemQuantity}
                            onChange={(e) => handleQuantityChange(e, index)}
                          />
                        </td>
                        <td className="invoice-table-cell">
                          <input
                            type="number"
                            step="0.01"
                            className="invoice-input price-input"
                            onChange={(e) => handlePriceChange(e, index)}
                            value={row.invoice_itemPrice}
                          />
                        </td>
                        <td className="invoice-table-cell amount-cell">
                          <input
                            type="number"
                            step="0.01"
                            className="invoice-input price-input"
                            value={(row.invoice_itemQuantity * row.invoice_itemPrice).toFixed(2)}
                            readOnly={true}
                          />
                        </td>
                        <td className="invoice-table-cell">
                          <button onClick={() => handleDeleteRow(index)} className="invoice-item-delete"><AiFillDelete/></button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                        <td colSpan="1">
                          <button onClick={addRow} className="add-row">
                            +
                          </button>
                        </td>
                    </tr>
                  </table>
                  
                  <div className="total">
                  <h2>Total: {totalAmount}</h2>
                  </div>
                  </div>
                  </div>
                  <div className="edit-invoice-footer">
                    <div className="edit-invoice-date-footer">
                       <p>Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                    </div>
                    <div className="signature">
                      <p>Signature/Name:<span>&nbsp; Hritik Pawar</span></p>
                    </div>
                  </div>
                  <button className="submit-button" onClick={handleUpdateInvoice}>Update Invoice</button> &nbsp; 
                  <button className="submit-button" onClick={generateInvoicePDF}>Paid</button>
            </div>
          ) : (
          <div className="invoice-main">
              <h1>Invoice Screen</h1>
              <div className="invoice-search-container">
                <select
                  className="search-select"
                  value={searchColumn}
                  onChange={handleSearchColumnChange}
                >
                  <option value="customer_name">Customer Name</option>
                  <option value="invoice_no">Invoice Number</option>
                  <option value="invoice_amount">Total Amount</option>
                  <option value="invoice_date">Date</option>
                </select>
                <input
                  className="invoice-search-input"
                  type="text"
                  placeholder="Search customer details"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="invoice-search-button">
                  <FiSearch />
                </div>
              </div>

              <table className="invoice-table">
                <thead className="invoice-thead">
                    <tr>
                      <th>Customer Name</th>
                      <th>Invoice Number</th>
                      <th>Date</th>
                      <th>Total Amount</th>
                      <th>Edit</th>
                      <th>Delete</th>
                  </tr>
                </thead>
                <tbody className="invoice-tbody">

                {filteredInvoices.map((item) => (
                    <tr key={item.invoice_id}>
                      <td>{item.customer_name}</td>
                      <td>{item.invoice_no}</td>
                      <td>{new Date(item.invoice_date).toLocaleDateString("en-GB")}</td>
                      <td>{item.invoice_amount.toFixed(2)}</td>
                      <td>
                        <BiEdit className='icon' onClick={() => handleEditClick(item.invoice_no)} />
                      </td>
                      <td><AiFillDelete className='icon'  onClick={(e) => handleInvoiceDelete(e,item.invoice_no)}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ReactPaginate
              previousLabel={'<<'}
              nextLabel={'>>'}
              pageCount={Math.ceil(displayedInvoices.length / itemsPerPage)}
              onPageChange={({ selected }) => setCurrentPage(selected)}
              containerClassName={'pagination'}
              activeClassName={'active'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
          />
            {isModalOpen && (
            <div className="invoice-modal">
              <h1 className="invoice-header">ADD INVOICE</h1>
              <div className="invoice-form-container">
                <div className="form-row">
                  <label className="invoice-label" htmlFor="customer-select">Customer Name:</label>
                  <div className="customer-input-container">
                    <input
                      type="text"
                      className="invoice-input customer-input"
                      id="customer-input"
                      value={name || ""}
                      readOnly
                    />
                    <button className="customer-input-button" onClick={openSearchModal}>
                       <AiOutlineSearch/>
                    </button>
                  </div>
                </div>
                <div className="form-row">
                  <label className="invoice-label" htmlFor="item-input">Invoice Number:</label>
                  <input
                      type="text"
                      className="invoice-input"
                      id="invoice-input"
                      value={invoiceNo}
                      readOnly
                    />
                </div>
                <div className="form-row">
                  <label className="invoice-label" htmlFor="date-input">Date:</label>
                  <input type="date" className="invoice-input" id="date-input" defaultValue={date} required pattern="\d{4}-\d{2}-\d{2}" onChange={(e) => setDate(e.target.value)}/>
                </div>
              </div>
              <div className="invoice-table-container">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th className="invoice-table-header">Sr. No</th>
                    <th className="invoice-table-header">Item</th>
                    <th className="invoice-table-header">Quantity</th>
                    <th className="invoice-table-header">Price</th>
                    <th className="invoice-table-header">Amount</th>
                    <th className="invoice-table-header">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows}
                  <tr>
                    <td colSpan="4" className="invoice-table-footer">Total Amount:</td>
                    <td className="invoice-table-footer amount-cell">{totalAmount}</td>
                  </tr>
                  <tr>
                    <td colSpan="5">
                      <button onClick={addRow} className="add-row">
                        +
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="invoice-btn" onClick={handleSaveInvoice}>Submit</button>
            <button onClick={closeModal} className="top-back-btn">Back</button>
              </div>
            )}
          <button className="add-invoice-btn" onClick={openModal}>+</button>
        </div>
        )}
      {searchModal && (
        <div className='invoice-customer-search-modal'>
          <h3>SEARCH CUSTOMERS</h3>
          <div className="invoice-customer-search-container">
            <select
              className="customer-search-select"
              value={customerSearchColumn}
              onChange={handleCustomerSearchColumnChange}
            >
              <option value="customer_name">Customer Name</option>
              <option value="customer_address">Customer Address</option>
            </select>
            <input
              className="invoice-customer-search-input"
              type="text"
              placeholder="Search Customer details"
              value={customerSearchTerm}
              onChange={handleCustomerSearch}
            />
            <div className="invoice-search-button">
              <FiSearch />
            </div>
          </div>
          <table className="invoice-table">
              <thead className="invoice-thead">
                  <tr>
                    <th>Customer Name</th>
                    <th>Customer Address</th>
                </tr>
              </thead>
              <tbody className="invoice-tbody">
                  {currentCustomers.map((item) => (
                  <tr key={item.customer_id} onDoubleClick={() => handleCustomerRowDoubleClick(item.customer_name)}>
                    <td>{item.customer_name}</td>
                    <td>{item.customer_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={'<<'}
              nextLabel={'>>'}
              pageCount={Math.ceil(filteredCustomers.length / customersPerPage)}
              onPageChange={({ selected }) => setCustomerCurrentPage(selected)}
              containerClassName={'pagination'}
              activeClassName={'active'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
            />
          <button onClick={closeSearchModal} className="customer-search-close-btn">Close</button>
        </div>
      )}
{ItemSearchModal && (
        <div className='invoice-customer-search-modal'>
          <h3>SEARCH ITEMS</h3>
          <div className="invoice-customer-search-container">
            <select
              className="customer-search-select"
              value={itemSearchColumn}
              onChange={handleItemSearchColumnChange}
            >
              <option value="item_name">Item Name</option>
              <option value="item_desc">Item Description</option>
            </select>
            <input
              className="invoice-customer-search-input"
              type="text"
              placeholder="Search Customer details"
              value={itemSearchTerm}
              onChange={handleItemSearch}
            />
            <div className="invoice-search-button">
              <FiSearch />
            </div>
          </div>
          <table className="invoice-table">
              <thead className="invoice-thead">
                  <tr>
                    <th>Item Name</th>
                    <th>Item Description</th>
                </tr>
              </thead>
              <tbody className="invoice-tbody">
                  {currentItems.map((item) => (
                  <tr key={item.item_id} onDoubleClick={() => handleItemRowDoubleClick(item.item_name)}>
                    <td>{item.item_name}</td>
                    <td>{item.item_desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={'<<'}
              nextLabel={'>>'}
              pageCount={Math.ceil(filteredItems.length / ItemsPerPage)}
              onPageChange={({ selected }) => setItemCurrentPage(selected)}
              containerClassName={'pagination'}
              activeClassName={'active'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
            />
          <button onClick={closeItemSearchModal} className="customer-search-close-btn">Close</button>
        </div>
      )}

    </div>
  );
}
export default App;


