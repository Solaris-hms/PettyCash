// src/pages/DailyForecast.js
import React, { useState, useMemo } from 'react';
import { PlusCircle, Trash2, Send } from 'lucide-react';

const DailyForecast = () => {
    // State to hold the list of expense items. Starts with one empty row.
    const [items, setItems] = useState([
        { id: 1, description: '', amount: '', remark: '' }
    ]);

    // Get and format today's date for display
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Function to handle changes in any input field of a specific row
    const handleItemChange = (id, event) => {
        const { name, value } = event.target;
        setItems(currentItems =>
            currentItems.map(item =>
                item.id === id ? { ...item, [name]: value } : item
            )
        );
    };

    // Function to add a new empty row
    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), description: '', amount: '', remark: '' }]);
    };

    // Function to remove a row
    const handleRemoveItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        } else {
            alert("You must have at least one expense item.");
        }
    };
    
    // Calculate the total estimated amount for display on the page
    const totalAmount = useMemo(() => {
        return items.reduce((total, item) => total + (Number(item.amount) || 0), 0);
    }, [items]);

    // This function runs when the user clicks the final "Submit" button
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Filter out any rows that are completely empty
        const validItems = items.filter(
            item => item.description.trim() !== '' && item.amount.trim() !== ''
        );

        if (validItems.length === 0) {
            alert('Please fill out at least one expense item before submitting.');
            return;
        }
        
        // Prepare the data in the format expected by the Google Apps Script
        const forecastData = {
            expenses: validItems,
        };

        // This is the URL for your Google Apps Script Web App
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzzCasqRTbU1oVdHBpzCzIIn9A5lDLDZPJ6IZziirecIMvsL3yU7NJUYsQss5Zx1qEtiA/exec";

        try {
            // Send the data to your Google Script using the 'fetch' API
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(forecastData),
                mode: 'cors',
                headers: {
                  'Content-Type': 'text/plain;charset=utf-8',
                },
                redirect: 'follow',
            });
            
            const result = await response.json();

            if (result.status === 'success') {
                alert('Forecast has been successfully recorded for approval!');
                // Reset the form to a single empty row
                setItems([{ id: 1, description: '', amount: '', remark: '' }]);
            } else {
                console.error('Error from Google Script:', result.message);
                alert('There was an error saving your data. Please check the console for details.');
            }

        } catch (error) {
            console.error('Failed to submit forecast:', error);
            alert('A network error occurred. Please check your internet connection and try again.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Today's Possible Expenses</h1>
                    <p className="mt-1 text-sm md:text-base text-slate-500 font-medium">{today}</p>
                </div>
            </div>

            {/* Main Form Card */}
            <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
                
                {/* Headers for Desktop View (Hidden on mobile) */}
                <div className="hidden md:grid grid-cols-12 gap-x-4 pb-2 border-b mb-4">
                    <h3 className="col-span-5 font-semibold text-slate-600">Expense Description</h3>
                    <h3 className="col-span-3 lg:col-span-2 font-semibold text-slate-600">Est. Amount (₹)</h3>
                    <h3 className="col-span-4 lg:col-span-4 font-semibold text-slate-600">Remarks</h3>
                </div>

                {/* Dynamic List of Expense Items */}
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-slate-50 p-4 rounded-lg ring-1 ring-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-x-4 items-start">

                                {/* Expense Description Input */}
                                <div className="col-span-12 md:col-span-5">
                                    <label htmlFor={`description-${item.id}`} className="text-sm font-medium text-slate-600 md:hidden mb-1 block">Description</label>
                                    <input id={`description-${item.id}`} type="text" name="description" value={item.description}
                                        onChange={(e) => handleItemChange(item.id, e)}
                                        placeholder="e.g., Purchase of safety gloves"
                                        className="w-full p-2 border border-slate-300 rounded-md" required />
                                </div>
                                
                                {/* Estimated Amount Input */}
                                <div className="col-span-12 md:col-span-3 lg:col-span-2">
                                    <label htmlFor={`amount-${item.id}`} className="text-sm font-medium text-slate-600 md:hidden mb-1 block">Est. Amount (₹)</label>
                                    <input id={`amount-${item.id}`} type="number" name="amount" value={item.amount}
                                        onChange={(e) => handleItemChange(item.id, e)}
                                        placeholder="e.g., 1500"
                                        className="w-full p-2 border border-slate-300 rounded-md" required />
                                </div>
                                
                                {/* Remark Input */}
                                <div className="col-span-12 md:col-span-4 lg:col-span-4">
                                    <label htmlFor={`remark-${item.id}`} className="text-sm font-medium text-slate-600 md:hidden mb-1 block">Remarks</label>
                                    <input id={`remark-${item.id}`} type="text" name="remark" value={item.remark}
                                        onChange={(e) => handleItemChange(item.id, e)}
                                        placeholder="Optional notes"
                                        className="w-full p-2 border border-slate-300 rounded-md" />
                                </div>

                                {/* Remove Button */}
                                <div className="col-span-12 md:col-span-1 flex items-center justify-end">
                                    <button type="button" onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 -mr-2"
                                        disabled={items.length <= 1}>
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions and Summary */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t border-slate-200">
                    <button type="button" onClick={handleAddItem}
                        className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 text-blue-600 font-semibold border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition mb-4 md:mb-0">
                        <PlusCircle size={20} className="mr-2" />
                        Add Another Item
                    </button>
                    
                    <div className="w-full md:w-auto flex flex-col md:flex-row items-center">
                        <div className="text-center md:text-right w-full md:w-auto md:mr-6 mb-4 md:mb-0">
                            <p className="text-slate-500">Total Estimated</p>
                            <p className="text-2xl font-bold text-slate-800">
                                ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <button type="submit"
                            className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
                            <Send size={20} className="mr-2" />
                            Submit Forecast
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DailyForecast;