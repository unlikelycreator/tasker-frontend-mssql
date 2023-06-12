import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

//Components import

import Activity from "./dashcomponents/Activity";
import Ta from "./dashcomponents/taskActivity";
import HomeScreen from "./dashcomponents/HomeScreen";
import TaskScreen from "./dashcomponents/TaskScreen";
import InvoiceScreen from "./dashcomponents/InvoiceScreen";

//Call Functions Import
import { getAllTask } from "./utils/HandleApi";
import {
  addActivity,
  getAllActivity,
  updateActivity,
  deleteActivity,
} from "./utils/HandleApi";
import {
  getAllItems,
  addItem,
  updateItem,
  deleteItem,
} from "./utils/HandleApi";
import {
  getAllCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "./utils/HandleApi";


//Icons Import
import {
  AiFillSchedule,
  AiOutlineClose,
  AiOutlineShoppingCart,
  AiFillCheckCircle,
  AiFillProject,
  AiFillDelete,
} from "react-icons/ai";
import { HiOutlineMenu } from "react-icons/hi";
import { BiEdit } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";

//CSS import
import "../css/Item.css";
import "../css/Menu.css";
import "../css/Invoice.css";
import "../css/Customer.css";
import "../css/dashboard.css";
import "../css/taskactivity.css";

//Pagination
import ReactPaginate from "react-paginate";

//Other imports
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import "react-toastify/dist/ReactToastify.css";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function App() {
  const [activeScreen, setActiveScreen] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const userType = location.state ? location.state.userRole : "";

  function handleMenuClick(screen) {
    setActiveScreen(screen);
    setMenuOpen(false);
    console.log(userType);
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="app-container">
      <button className="menu-toggle" onClick={toggleMenu}>
        <span>
          {menuOpen ? (
            <AiOutlineClose size={20} />
          ) : (
            <HiOutlineMenu size={20} />
          )}
        </span>
      </button>
      <div className={`menu-container ${menuOpen ? "open" : ""}`}>
        <h1>Tasker</h1>
        <div className="menu-buttons">
          {userType === "admin" && (
            <>
              <div className="authenticated-btn">
                <button
                  className={activeScreen === "task" ? "active" : ""}
                  onClick={() => handleMenuClick("task")}
                >
                  <AiFillSchedule size={20} /> &nbsp; Tasks
                </button>
                <button
                  className={activeScreen === "activity" ? "active" : ""}
                  onClick={() => handleMenuClick("activity")}
                >
                  <AiFillCheckCircle size={20} />
                  &nbsp; Activities
                </button>
                <button
                  className={activeScreen === "taskac" ? "active" : ""}
                  onClick={() => handleMenuClick("taskac")}
                >
                  <AiFillProject size={20} />
                  &nbsp; Task-Activity
                </button>
                <button
                  className={activeScreen === "items" ? "active" : ""}
                  onClick={() => handleMenuClick("items")}
                >
                  <AiOutlineShoppingCart size={20} />
                  &nbsp; Items
                </button>
                <button
                  className={activeScreen === "customer" ? "active" : ""}
                  onClick={() => handleMenuClick("customer")}
                >
                  <BsFillPersonFill size={20} />
                  &nbsp; Customers
                </button>
                <button
                  className={activeScreen === "invoice" ? "active" : ""}
                  onClick={() => handleMenuClick("invoice")}
                >
                  <BsFillPersonFill size={20} />
                  &nbsp; Invoice
                </button>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
          {userType === "user" && (
            <>
              <div className="authenticated-btn">
                <button
                  className={activeScreen === "invoice" ? "active" : ""}
                  onClick={() => handleMenuClick("invoice")}
                >
                  <BsFillPersonFill size={20} />
                  &nbsp; Invoice
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="screen-container">
        {activeScreen === "home" && <HomeScreen />}
        {activeScreen === "task" && <TaskScreen />}
        {activeScreen === "activity" && <ActivityScreen />}
        {activeScreen === "taskac" && <TaskAcScreen />}
        {activeScreen === "items" && <ItemsScreen />}
        {activeScreen === "customer" && <CustomerScreen />}
        {activeScreen === "invoice" && <InvoiceScreen />}
      </div>
    </div>
  );
}

function ActivityScreen() {
  const [activity, setActivity] = useState([]);
  const [activity_desc, setActivitydesc] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [ActivityID, setActivityID] = useState();
  useEffect(() => {
    getAllActivity(setActivity);
  }, []);
  const updateMode = (_id, text) => {
    setIsUpdating(true);
    setActivitydesc(text);
    setActivityID(_id);
  };
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
        <div
          className="add"
          onClick={
            isUpdating
              ? () =>
                  updateActivity(
                    ActivityID,
                    activity_desc,
                    setActivity,
                    setActivitydesc,
                    setIsUpdating
                  )
              : () => addActivity(activity_desc, setActivitydesc, setActivity)
          }
        >
          {isUpdating ? "Update" : "Add"}
        </div>
      </div>
      <div className="task-list">
        {activity.map((item) => (
          <Activity
            key={item.activity_id}
            text={item.activity_desc}
            updateMode={() => updateMode(item.activity_id, item.activity_desc)}
            deleteActivity={() => deleteActivity(item.activity_id, setActivity)}
          />
        ))}
      </div>
    </div>
  );
}

function TaskAcScreen() {
  const [task, setTask] = useState([]);
  const [Activity, setActivity] = useState([]);

  useEffect(() => {
    getAllTask(setTask);
    getAllActivity(setActivity);
  }, []);

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
  const [item_name, setitemName] = useState("");
  const [item_desc, setitemDescription] = useState("");
  const [item_price, setitemPrice] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [item_id, setitemId] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllItems(setItems);
  }, []);

  const openModal = (event) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdating(false);
    setitemId([]);
    setitemName("");
    setitemDescription("");
    setitemPrice([]);
  };

  const handleItemdelete = (e, _id) => {
    e.preventDefault();
    deleteItem(_id, setItems);
  };

  const updateMode = (itemId, name, desc, price) => {
    setIsUpdating(true);
    setitemId(itemId);
    setitemName(name);
    setitemDescription(desc);
    setitemPrice(price);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setItemsPerPage(9); // or any other desired value
  }, []);

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
      <h1>Products</h1>
      <div className="outer-search-div">
        <label>Search Items:</label>
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
      </div>
      <div className="item-container">
        {isModalOpen && (
          <div className="item-modal-container">
            <div className="item-modal-input">
              <label>Product Name:</label>
              <input
                type="text"
                value={item_name}
                placeholder="Item Name"
                onChange={(e) => setitemName(e.target.value)}
              />
              <label>Product Description:</label>
              <input
                type="text"
                value={item_desc}
                placeholder="Item Description"
                onChange={(e) => setitemDescription(e.target.value)}
              />
              <label>Product Price:</label>
              <input
                type="number"
                step={0.01}
                value={item_price}
                placeholder="Item Price"
                onChange={(e) => setitemPrice(e.target.value)}
              />
            </div>
            <div className="item-modal-buttons">
              <button
                className="item-modal-save"
                onClick={
                  isUpdating
                    ? () =>
                        updateItem(
                          item_id,
                          item_name,
                          item_desc,
                          item_price,
                          setItems,
                          setitemName,
                          setitemDescription,
                          setitemPrice,
                          setIsUpdating
                        )
                    : () =>
                        addItem(
                          item_name,
                          item_desc,
                          item_price,
                          setItems,
                          setitemName,
                          setitemDescription,
                          setitemPrice
                        )
                }
              >
                {isUpdating ? "Update" : "Add"}
              </button>
              <button className="item-modal-close" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}
        <div className="table-container">
          <table className="item-table">
            <thead className="item-thead">
              <tr>
                <th>Product Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Edit</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody className="item-tbody">
              {filteredItems
                .sort((b, a) => b.item_name.localeCompare(a.item_name))
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
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
        </div>
        <ReactPaginate
          previousLabel={"<<"}
          nextLabel={">>"}
          pageCount={Math.ceil(items.length / itemsPerPage)}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
        />
        <button className="add-invoice-btn" onClick={openModal}>
          +
        </button>
      </div>
    </div>
  );
}

function CustomerScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customer_name, setcustomerName] = useState("");
  const [customer_address, setcustomeAddress] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [customer_id, setcustomerId] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllCustomers(setCustomers);
  }, []);

  const handleCustomerdelete = (e, _id) => {
    e.preventDefault();
    deleteCustomer(_id, setCustomers);
  };

  const openModal = (event) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdating(false);
    setcustomerId([]);
    setcustomerName("");
    setcustomeAddress("");
  };

  const updateMode = (customerId, name, address) => {
    setIsModalOpen(true);
    setIsUpdating(true);
    setcustomerId(customerId);
    setcustomerName(name);
    setcustomeAddress(address);
  };
  useEffect(() => {
    setItemsPerPage(11); // or any other desired value
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
      <h1>Customers</h1>
      <div className="outer-customer-search">
        <label>Search Customers</label>
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
      </div>
      <div className="customer-container">
        {isModalOpen && (
          <div className="customer-modal-container">
            <div className="customer-modal-input">
              <input
                type="text"
                value={customer_name}
                placeholder="Customer Name"
                onChange={(e) => setcustomerName(e.target.value)}
              />
              <input
                type="text"
                value={customer_address}
                placeholder="Customer Address"
                onChange={(e) => setcustomeAddress(e.target.value)}
              />
            </div>
            <div className="customer-modal-buttons">
              <button
                className="item-save-button"
                onClick={
                  isUpdating
                    ? () =>
                        updateCustomer(
                          customer_id,
                          customer_name,
                          customer_address,
                          setCustomers,
                          setcustomerName,
                          setcustomeAddress,
                          setIsUpdating
                        )
                    : () =>
                        addCustomer(
                          customer_name,
                          customer_address,
                          setcustomerName,
                          setcustomeAddress,
                          setCustomers
                        )
                }
              >
                {isUpdating ? "Update" : "Add"}
              </button>
              <button className="item-modal-close" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}
        <div className="customer-table-container">
          <table className="customer-table">
            <thead className="customer-thead">
              <tr>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Edit</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody className="customer-tbody">
              {filteredCustomers
                .sort((b, a) => b.customer_name.localeCompare(a.customer_name))
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((item) => (
                  <tr key={item.customer_id}>
                    <td>{item.customer_name}</td>
                    <td>{item.customer_address}</td>
                    <td>
                      <BiEdit
                        className="icon"
                        onClick={() =>
                          updateMode(
                            item.customer_id,
                            item.customer_name,
                            item.customer_address
                          )
                        }
                      />
                    </td>
                    <td>
                      <AiFillDelete
                        className="icon"
                        onClick={(e) =>
                          handleCustomerdelete(e, item.customer_id)
                        }
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <ReactPaginate
          previousLabel={"<<"}
          nextLabel={">>"}
          pageCount={Math.ceil(customers.length / itemsPerPage)}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
        />
      </div>
      <button className="add-invoice-btn" onClick={openModal}>
        +
      </button>
    </div>
  );
}


export default App;
