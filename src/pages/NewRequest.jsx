import React, { useState } from 'react';
import { UploadCloud, CheckCircle, Send, Loader2 } from 'lucide-react';

// PASTE YOUR NEW WEB APP URL FROM STEP 2 HERE
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwD5mIA2pjOXp5ZHFiwfQuHwVrpzRXuoanaO2v7us8DhCQAwxhm5TfXIta6YF_lmZjt/exec';

// Helper function to convert a file to a Base64 string
const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
});

// Reusable file uploader component (Unchanged)
const FileUploader = ({ label, onFileSelect, selectedFile }) => {
    // ... same code as before ...
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <label htmlFor={`file-upload-${label}`} className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 bg-slate-50 transition">
                {selectedFile ? (
                    <>
                        <CheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-slate-600 truncate">{selectedFile.name}</span>
                    </>
                ) : (
                    <>
                        <UploadCloud className="text-slate-400 mr-3 flex-shrink-0" />
                        <span className="text-sm text-slate-600">Click to upload file</span>
                    </>
                )}
            </label>
            <input
                id={`file-upload-${label}`}
                type="file"
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => onFileSelect(e.target.files[0])}
            />
        </div>
    );
};


const NewRequest = () => {
    const [formData, setFormData] = useState({
        employeeName: 'Suresh Kumar',
        department: 'Maintenance',
        itemDescription: '',
        amountSpent: '',
        purpose: '',
        expenseType: 'Supplies',
        paymentMode: 'Cash',
    });
    
    const [voucherFile, setVoucherFile] = useState(null);
    const [invoiceFile, setInvoiceFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!voucherFile || !invoiceFile) {
            alert('Please upload both a voucher and an invoice.');
            return;
        }
        if (!GOOGLE_SCRIPT_URL.startsWith('https://')) {
            alert('Error: Please paste your new Google Script URL into the React code.');
            return;
        }

        setIsLoading(true);
        setStatusMessage('Submitting to Google...');

        try {
            const [voucherFileBase64, invoiceFileBase64] = await Promise.all([
                fileToBase64(voucherFile),
                fileToBase64(invoiceFile)
            ]);

            const payload = { ...formData, voucherFileName: voucherFile.name, voucherFileBase64, invoiceFileName: invoiceFile.name, invoiceFileBase64 };

            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            alert('Expense request submitted successfully!');
            setStatusMessage('Success! Your request has been recorded.');
            
            // Reset the form
            setFormData({ ...formData, itemDescription: '', amountSpent: '', purpose: '', expenseType: 'Supplies', paymentMode: 'Cash' });
            setVoucherFile(null);
            setInvoiceFile(null);

        } catch (error) {
            console.error('Submission Error:', error);
            setStatusMessage(`Error: ${error.message}`);
            alert('An error occurred. Please check the console and try again.');
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatusMessage(''), 5000); 
        }
    };


    // The JSX form structure is the same as before
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">New Expense Submission</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
                 {/* ... (all your form JSX inputs here) ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label htmlFor="itemDescription" className="block text-sm font-medium text-slate-700 mb-1">Item Description</label>
                        <input id="itemDescription" name="itemDescription" type="text" value={formData.itemDescription} onChange={handleChange}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="amountSpent" className="block text-sm font-medium text-slate-700 mb-1">Amount Spent (₹)</label>
                        <input id="amountSpent" name="amountSpent" type="number" step="0.01" value={formData.amountSpent} onChange={handleChange}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="purpose" className="block text-sm font-medium text-slate-700 mb-1">Purpose of Expense</label>
                        <input id="purpose" name="purpose" type="text" value={formData.purpose} onChange={handleChange}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="expenseType" className="block text-sm font-medium text-slate-700 mb-1">Type of Expense</label>
                        <select id="expenseType" name="expenseType" value={formData.expenseType} onChange={handleChange}
                            className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500">
                            <option>Supplies</option> <option>Food</option> <option>Travel</option> <option>Repairs</option> <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="paymentMode" className="block text-sm font-medium text-slate-700 mb-1">Mode of Payment</label>
                        <select id="paymentMode" name="paymentMode" value={formData.paymentMode} onChange={handleChange}
                            className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500">
                            <option>Cash</option> <option>Card</option> <option>UPI</option>
                        </select>
                    </div>
                    <FileUploader label="Upload Voucher" onFileSelect={setVoucherFile} selectedFile={voucherFile} />
                    <FileUploader label="Upload Invoice" onFileSelect={setInvoiceFile} selectedFile={invoiceFile} />
                </div>
                <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                     <span className="text-sm text-slate-600">{statusMessage}</span>
                    <button type="submit" disabled={isLoading}
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all">
                        {isLoading ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Submitting...</>) : (<><Send className="w-5 h-5 mr-2" />Submit Expense</>)}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewRequest;