import React from "react";
import { useEffect, useState } from "react";

import {
  getAllItems
} from "../utils/HandleApi";
import {
  getAllCustomers
} from "../utils/HandleApi";
import {
  getAllInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
} from "../utils/HandleApi";

//Icons Import
import {
  AiFillDelete,
  AiOutlineSearch,
} from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";



//Pagination
import ReactPaginate from "react-paginate";

//Other imports
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function InvoiceScreen() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [name, setName] = useState([]);
    const [invoiceNo, setinvoiceNo] = useState([]);
    const [date, setDate] = useState();
    const [totalAmount, setTotalAmount] = useState(0);
    const [rows, setRows] = useState([
      {
        item_name: "",
        invoice_itemQuantity: 0,
        invoice_itemPrice: 0,
        invoice_itemTotal: 0,
      },
    ]);
    const [editMode, setEditMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [customerCurrentPage, setCustomerCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState();
    const [customersPerPage, setCustomersPerPage] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("customer_name");
    const [searchModal, setSearchModal] = useState(false);
    const [ItemSearchModal, setItemSearchModal] = useState(false);
    const [customerSearchTerm, setCustomerSearchTerm] = useState("");
    const [customerSearchColumn, setCustomerSearchColumn] =
      useState("customer_name");
    const [itemSearchColumn, setItemSearchColumn] = useState("item_name");
    const [itemSearchTerm, setItemSearchTerm] = useState("");
    const [itemCurrentPage, setItemCurrentPage] = useState(0);
  
    // UseEffects to get data
    useEffect(() => {
      getAllCustomers(setCustomers);
      getAllItems(setItems);
      getAllInvoices(setInvoices);
    }, []);
  
    // UseEffects to for pagination
    useEffect(() => {
      setItemsPerPage(12);
    }, []);
  
    useEffect(() => {
      setCustomersPerPage(8);
    }, []);
  
    // UseEffects to get data based on edit selection and auto set invoice no.
    useEffect(() => {
      if (isModalOpen) {
        if (invoices.length > 0) {
          const sortedInvoices = [...invoices].sort(
            (a, b) => b.invoice_no - a.invoice_no
          );
          const highestInvoiceNo = sortedInvoices[0].invoice_no;
          setinvoiceNo(parseInt(highestInvoiceNo) + 1);
        } else {
          setinvoiceNo(1);
        }
        setDate(new Date().toISOString().slice(0, 10));
      }
    }, [isModalOpen, invoices]);
  
    useEffect(() => {
      const newTotalAmount = rows.reduce(
        (acc, row) => acc + row.invoice_itemTotal,
        0
      );
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
    const closeItemSearchModal = () => {
      setItemSearchModal(false);
    };

    //Handle Items
    function getItemPrice(itemName, items) {
      const selectedItem = items.find((item) => item.item_name === itemName);
      return selectedItem ? selectedItem.item_price : 0;
    }
  
    function handleItemSelect(e, index) {
      const selectedValue = e.target.value;
      console.log("selected:", selectedValue);
      const selectedPrice = getItemPrice(selectedValue, items);
      setRows((rows) =>
        rows.map((row, i) => {
          if (i === index) {
            return {
              ...row,
              item_name: selectedValue,
              invoice_itemPrice: selectedPrice,
            };
          } else {
            return row;
          }
        })
      );
    }
  
    function handleItemSelectModal(itemName, index) {
      console.log("selected:", itemName, "index:", index);
      const selectedValue = itemName;
      const selectedPrice = getItemPrice(selectedValue, items);
      setRows((rows) =>
        rows.map((row, i) => {
          if (i === index) {
            return {
              ...row,
              item_name: selectedValue,
              invoice_itemPrice: selectedPrice,
            };
          }
          return row;
        })
      );
    }
  
    function handleQuantityChange(e, index) {
      const { value } = e.target;
      const newRows = [...rows];
      newRows[index].invoice_itemQuantity = parseFloat(value, 3);
      newRows[index].invoice_itemTotal =
        newRows[index].invoice_itemQuantity * newRows[index].invoice_itemPrice;
      setRows(newRows);
    }
  
    function handlePriceChange(e, index) {
      const { value } = e.target;
      const newRows = [...rows];
      newRows[index].invoice_itemPrice = parseFloat(value, 3);
      newRows[index].invoice_itemTotal =
        newRows[index].invoice_itemQuantity * newRows[index].invoice_itemPrice;
      setRows(newRows);
    }
  
    //Handle Rows in tables and data
    const tableRows = rows.map((row, index) => (
      <tr key={index}>
        <td className="invoice-table-cell">{index + 1}</td>
        <td className="invoice-table-cell">
          <select
            className="invoice-select item-select"
            onChange={(e) => handleItemSelect(e, index)}
          >
            <option>select value</option>
            {items.map((item, index) => (
              <option key={index} value={item.item_name}>
                {item.item_name}
              </option>
            ))}
          </select>
          {/*
           <button className="customer-input-button" onClick={openItemSearchModal}>
            <AiOutlineSearch />
          </button>
          */}
         
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
          />
        </td>
        <td className="invoice-table-cell">
          <button
            onClick={() => handleDeleteRow(index)}
            className="invoice-item-delete"
          >
            <AiFillDelete />
          </button>
        </td>
      </tr>
    ));
  
    function addRow() {
      const newRows = [
        ...rows,
        {
          item_name: "",
          invoice_itemQuantity: 0,
          invoice_itemPrice: 0,
          invoice_itemTotal: 0,
        },
      ];
      setRows(newRows);
      console.log(rows);
    }
  
    function handleDeleteRow(index) {
      setRows((rows) => rows.filter((row, i) => i !== index));
    }
  
    const handleEditClick = (invoice_no) => {
      setEditMode(true);
      const invoiceItem = invoices.find((item) => item.invoice_no === invoice_no);
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
      console.log(rows);
    };
  
    //Handle CRUD
    const handleSaveInvoice = (e) => {
      e.preventDefault();
      addInvoice(
        invoiceNo,
        name,
        date,
        rows,
        totalAmount,
        setName,
        setinvoiceNo,
        setRows,
        setTotalAmount,
        setInvoices
      );
      console.log(name, invoiceNo, date, rows, totalAmount);
    };
  
    const handleUpdateInvoice = (e) => {
      e.preventDefault();
      updateInvoice(invoiceNo, name, date, rows, totalAmount, setInvoices)
        .then(() => {
          toast.success("Invoice updated successfully", { autoClose: 2000 });
        })
        .catch((error) => {
          toast.error("Failed to update invoice", { autoClose: 2000 });
          console.log(error);
        });
    };
  
    const handleInvoiceDelete = (e, invoice_no) => {
      e.preventDefault();
      deleteInvoice(invoice_no, setInvoices);
    };
  
    //Handle Search and Sort
    const sortedInvoices = invoices.sort((a, b) => b.invoice_no - a.invoice_no);
    const start = currentPage * itemsPerPage;
    const end = Math.min((currentPage + 1) * itemsPerPage, sortedInvoices.length);
    const displayedInvoices = sortedInvoices.slice(start, end);
  
    const filteredInvoices = displayedInvoices.filter((item) => {
      const searchTermLower = searchTerm.toLowerCase();
      const searchColumnLower = searchColumn.toLowerCase();
  
      if (searchColumnLower === "invoice_date") {
        const invoiceDate = new Date(item.invoice_date).toLocaleDateString(
          "en-GB"
        );
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
    const currentCustomers = filteredCustomers.slice(
      indexOfFirstCustomer,
      indexOfLastCustomer
    );
  
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
  
    /*
    const handleItemRowDoubleClick = (itemName) => {
      console.log(itemName);
      closeItemSearchModal(); 
    };*/
  
    //Handle PDF Generation
    const generateInvoicePDF = () => {
      try {
        // Define the document definition
        const docDefinition = {
          content: [
            // Invoice Title
            {
              text: "Invoice",
              fontSize: 24,
              bold: true,
              alignment: "right",
              margin: [0, 0, 0, 10],
            },
  
            // Invoice From Section
            {
              text: "Invoice From",
              fontSize: 16,
              bold: true,
              fillColor: "#007bff",
              color: "#007bff",
              margin: [0, 10, 0, 5],
              width: "50%",
              alignment: "left",
            },
            { text: "SR Consultants", fontSize: 12 },
            { text: "123 Street, City, Country", fontSize: 12 },
            { text: "Pincode: 123456", fontSize: 12, margin: [0, 0, 0, 10] },
  
            // Invoice To Section
            {
              text: "Invoice To",
              fontSize: 16,
              bold: true,
              fillColor: "#007bff",
              color: "#007bff",
              margin: [0, 10, 0, 5],
              width: "50%",
              alignment: "right",
            },
            { text: `Customer Name: ${name}`, alignment: "right", fontSize: 12 },
            {
              text: `Invoice Number: ${invoiceNo}`,
              alignment: "right",
              fontSize: 12,
            },
            {
              text: `Invoice Date: ${formatDate(date)}`,
              alignment: "right",
              fontSize: 12,
              margin: [0, 0, 0, 10],
            },
  
            // Table Section
            {
              style: "table",
              table: {
                headerRows: 1,
                widths: [40, "*", 60, 60, "*"],
                body: [
                  [
                    { text: "Sr. No", style: "tableHeader", alignment: "center" },
                    {
                      text: "Item Name",
                      style: "tableHeader",
                      alignment: "center",
                    },
                    {
                      text: "Quantity",
                      style: "tableHeader",
                      alignment: "center",
                    },
                    { text: "Price", style: "tableHeader", alignment: "center" },
                    { text: "Amount", style: "tableHeader", alignment: "center" },
                  ],
                  ...rows.map((row, index) => {
                    const itemName =
                      items.find((item) => item.item_id === row.item_id)
                        ?.item_name || "";
                    return [
                      { text: index + 1, alignment: "center" },
                      { text: itemName, alignment: "center" },
                      { text: row.invoice_itemQuantity, alignment: "center" },
                      { text: row.invoice_itemPrice, alignment: "center" },
                      {
                        text: (
                          row.invoice_itemQuantity * row.invoice_itemPrice
                        ).toFixed(2),
                        alignment: "center",
                      },
                    ];
                  }),
                  [
                    "",
                    "",
                    "",
                    "Total Amount:",
                    { text: totalAmount, colSpan: 1, alignment: "center" },
                  ], // Total Amount Row
                ],
              },
              layout: {
                hLineWidth: function (i, node) {
                  return i === 0 || i === node.table.body.length ? 1 : 0; // Add horizontal lines only at the top and bottom
                },
                vLineWidth: function (i, node) {
                  return i === 0 || i === node.table.widths.length ? 1 : 0; // Add vertical lines only at the beginning and end
                },
                hLineColor: function (i, node) {
                  return "#000"; // Set border color for horizontal lines
                },
                vLineColor: function (i, node) {
                  return "#000"; // Set border color for vertical lines
                },
                paddingLeft: function (i, node) {
                  return 5;
                },
                paddingRight: function (i, node) {
                  return 5;
                },
                paddingTop: function (i, node) {
                  return 3;
                },
                paddingBottom: function (i, node) {
                  return 3;
                },
              },
            },
  
            // Footer Section
            {
              margin: [0, 50, 0, 0],
              columns: [
                {
                  text: "Terms and Conditions Applied",
                  width: "50%",
                  fontSize: 10,
                },
                {
                  text: "Generated by Tasker",
                  width: "50%",
                  fontSize: 10,
                  alignment: "right",
                },
              ],
            },
  
            // Signature Section
            {
              margin: [0, 50, 0, 0],
              columns: [
                { text: "Signature:", width: "50%", fontSize: 10 },
                {
                  text: "Hritik J Pawar",
                  width: "50%",
                  fontSize: 10,
                  alignment: "right",
                },
              ],
            },
          ],
          defaultStyle: {
            font: "Roboto",
            fontSize: 12,
            lineHeight: 1.5,
          },
          styles: {
            tableHeader: {
              bold: true,
              fillColor: "#007bff",
              color: "#fff",
            },
          },
        };
  
        // Generate the PDF
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.download("invoice.pdf");
      } catch (error) {
        console.error("Error generating PDF:", error);
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
      return number.toString().padStart(2, "0");
    };
  
    return (
      <div className="invoice-screen">
        {editMode ? (
          <div className="edit-screen">
            <button onClick={handleBackClick} className="top-back-btn">
              Back
            </button>
            <h1 className="edit-invoice-heading">EDIT INVOICE</h1>
            <div className="edit-invoice-details">
              <div className="edit-customer-details">
                <label className="invoice-label" htmlFor="customer-select">
                  Customer Name:
                </label>
                <div className="edit-customer-input-div">
                  <div className="customer-input-container">
                    <input
                      type="text"
                      className="customer-input"
                      id="customer-input"
                      value={name || ""}
                      readOnly
                    />
                    <button
                      className="customer-input-button"
                      onClick={openSearchModal}
                    >
                      <AiOutlineSearch />
                    </button>
                  </div>
                </div>
                <div className="edit-invoice-number">
                  <label htmlFor="invoice-number">Invoice Number</label>
                  <input
                    type="text"
                    id="invoice-number"
                    defaultValue={invoiceNo}
                    onChange={(e) => setinvoiceNo(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="edit-invoice-date">
                  <label htmlFor="invoice-date">Invoice Date</label>
                  <input
                    type="date"
                    className="invoice-input"
                    id="date-input"
                    defaultValue={
                      date ? new Date(date).toISOString().substring(0, 10) : ""
                    }
                    onChange={(e) => setDate(e.target.value)}
                  />
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
                                <option
                                  key={item.item_name}
                                  value={item.item_name}
                                >
                                  {item.item_name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <>
                              <option>Select Value</option>
                              {items.map((item) => (
                                <option
                                  key={item.item_name}
                                  value={item.item_name}
                                >
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
                          value={(
                            row.invoice_itemQuantity * row.invoice_itemPrice
                          ).toFixed(2)}
                          readOnly={true}
                        />
                      </td>
                      <td className="invoice-table-cell">
                        <button
                          onClick={() => handleDeleteRow(index)}
                          className="invoice-item-delete"
                        >
                          <AiFillDelete />
                        </button>
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
                <p>
                  Date:{" "}
                  {new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="signature">
                <p>
                  Signature/Name:<span>&nbsp; Hritik Pawar</span>
                </p>
              </div>
            </div>
            <button className="submit-button" onClick={handleUpdateInvoice}>
              Update Invoice
            </button>{" "}
            &nbsp;
            <button className="submit-button" onClick={generateInvoicePDF}>
              Paid
            </button>
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
                    <td>
                      {new Date(item.invoice_date).toLocaleDateString("en-GB")}
                    </td>
                    <td>{item.invoice_amount.toFixed(2)}</td>
                    <td>
                      <BiEdit
                        className="icon"
                        onClick={() => handleEditClick(item.invoice_no)}
                      />
                    </td>
                    <td>
                      <AiFillDelete
                        className="icon"
                        onClick={(e) => handleInvoiceDelete(e, item.invoice_no)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={"<<"}
              nextLabel={">>"}
              pageCount={Math.ceil(displayedInvoices.length / itemsPerPage)}
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
            {isModalOpen && (
              <div className="invoice-modal">
                <h1 className="invoice-header">ADD INVOICE</h1>
                <div className="invoice-form-container">
                  <div className="form-row">
                    <label className="invoice-label" htmlFor="customer-select">
                      Customer Name:
                    </label>
                    <div className="customer-input-container">
                      <input
                        type="text"
                        className="invoice-input customer-input"
                        id="customer-input"
                        value={name || ""}
                        readOnly
                      />
                      <button
                        className="customer-input-button"
                        onClick={openSearchModal}
                      >
                        <AiOutlineSearch />
                      </button>
                    </div>
                  </div>
                  <div className="form-row">
                    <label className="invoice-label" htmlFor="item-input">
                      Invoice Number:
                    </label>
                    <input
                      type="text"
                      className="invoice-input"
                      id="invoice-input"
                      value={invoiceNo}
                      readOnly
                    />
                  </div>
                  <div className="form-row">
                    <label className="invoice-label" htmlFor="date-input">
                      Date:
                    </label>
                    <input
                      type="date"
                      className="invoice-input"
                      id="date-input"
                      defaultValue={date}
                      required
                      pattern="\d{4}-\d{2}-\d{2}"
                      onChange={(e) => setDate(e.target.value)}
                    />
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
                        <td colSpan="4" className="invoice-table-footer">
                          Total Amount:
                        </td>
                        <td className="invoice-table-footer amount-cell">
                          {totalAmount}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="5" className="add-row-col">
                          <button onClick={addRow} className="add-row">
                            +
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button className="invoice-btn" onClick={handleSaveInvoice}>
                  Submit
                </button>
                <button onClick={closeModal} className="top-back-btn">
                  Back
                </button>
              </div>
            )}
            <button className="add-invoice-btn" onClick={openModal}>
              +
            </button>
          </div>
        )}
        {searchModal && (
          <div className="invoice-customer-search-modal">
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
                  <tr
                    key={item.customer_id}
                    onDoubleClick={() =>
                      handleCustomerRowDoubleClick(item.customer_name)
                    }
                  >
                    <td>{item.customer_name}</td>
                    <td>{item.customer_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={"<<"}
              nextLabel={">>"}
              pageCount={Math.ceil(filteredCustomers.length / customersPerPage)}
              onPageChange={({ selected }) => setCustomerCurrentPage(selected)}
              containerClassName={"pagination"}
              activeClassName={"active"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
            />
            <button
              onClick={closeSearchModal}
              className="customer-search-close-btn"
            >
              Close
            </button>
          </div>
        )}
        {ItemSearchModal && (
          <div className="invoice-customer-search-modal">
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
                {currentItems.map((item, index) => (
                  <tr
                    key={item.item_id}
                    onClick={() => handleItemSelectModal(item.item_name, index)}
                  >
                    <td>{item.item_name}</td>
                    <td>{item.item_desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={"<<"}
              nextLabel={">>"}
              pageCount={Math.ceil(filteredItems.length / ItemsPerPage)}
              onPageChange={({ selected }) => setItemCurrentPage(selected)}
              containerClassName={"pagination"}
              activeClassName={"active"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
            />
            <button
              onClick={closeItemSearchModal}
              className="customer-search-close-btn"
            >
              Close
            </button>
          </div>
        )}
      </div>
    );
  }

export default InvoiceScreen;