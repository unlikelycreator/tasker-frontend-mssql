
// invoiceConfig.js


// Setting Initial invoice no
export const initialInvoiceNo = 1000; 

/*
useEffect(() => {
  if (isModalOpen) {
    if (invoices.length > 0) {
      const sortedInvoices = [...invoices].sort(
        (a, b) => b.invoice_no - a.invoice_no
      );
      const highestInvoiceNo = sortedInvoices[0].invoice_no;
      setInvoiceNo(parseInt(highestInvoiceNo) + 1);
    } else {
      setInvoiceNo(1);
    }
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = currentDate.getFullYear();
    const formattedInvoiceNo = `${month}/${year}/INV/${invoiceNo.toString().padStart(2, '0')}`;
    setFormattedInvoiceNo(formattedInvoiceNo);
    setDate(currentDate.toISOString().slice(0, 10));
  }
}, [isModalOpen, invoices]);


const prefix = fetchedInvoiceNo.slice(0, fetchedInvoiceNo.lastIndexOf('/') + 1);
const currentInvoiceNo = parseInt(fetchedInvoiceNo.slice(fetchedInvoiceNo.lastIndexOf('/') + 1)) + 1;
const newFormattedInvoiceNo = `${prefix}${currentInvoiceNo.toString().padStart(2, '0')}`;



*/