import React from 'react';
import Dashboard from './components/Dashboard.jsx';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Category from './components/Category.jsx';
import BranchMgt from './components/BranchMgt.jsx';
import SalesRep from './components/salesRep.jsx';
import Stores from './components/Stores.jsx';
import Profile from './components/Profile.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Independent Login Route */}
        <Route path='/adminLogin' element={<Login />} />
        
        {/* Dashboard Route with Nested Routes */}
        <Route path='/dashboard' element={<Dashboard />}>
          {/* Default child route for dashboard */}
          <Route index element={<Home />} />
          {/* Nested child routes */}
          <Route path='/dashboard/salesRep' element={<SalesRep />} />
          <Route path='/dashboard/category' element={<Category />} />
          <Route path='/dashboard/branchmgt' element={<BranchMgt />} />
          <Route path='/dashboard/stores' element={<Stores />} />
          <Route path='/dashboard/profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
