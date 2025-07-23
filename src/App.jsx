import React from 'react';

// Only import the component you need to display
import DailyForecast from './pages/DailyForecast.jsx';

// The other page components are no longer needed here since they can't be routed to.
// import NewRequest from './pages/NewRequest.jsx';
// const Dashboard = () => <div className="p-4 text-xl">Admin Dashboard Page</div>;
// const MyRequests = () => <div className="p-4 text-xl">My Requests Page</div>;

function App() {
  return (
    // The main layout wrapper.
    <div className="h-screen bg-slate-100 font-sans">
      {/* 
        The <main> tag directly renders your single page.
        No Router, Routes, or Route components are necessary.
      */}
      <main className="p-4 sm:p-6 lg:p-8">
        <DailyForecast />
      </main>
    </div>
  );
}

export default App;