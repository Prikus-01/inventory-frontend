import axios from 'axios';
import React, { useEffect, useState } from 'react'

const home = () => {

    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(()=>{
        async function run() {
            try {
                const {data} =  await axios.get('https://inv-man.onrender.com/api/v1/displayinventorys');
                // console.log(data.data);
                setInventory(data.data);
            } catch (error) {
                console.log(error);
            }
        }
        run();
    },[])

    const filteredInventory = inventory.filter((i) => {
      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      return (
        (i.product_name || '').toLowerCase().includes(q) ||
        (i.packing || '').toLowerCase().includes(q) ||
        String(i.quantity ?? '').toLowerCase().includes(q) ||
        String(i.cases ?? '').toLowerCase().includes(q) ||
        (i.godown_name || '').toLowerCase().includes(q) ||
        (i.updated_at ? new Date(i.updated_at).toISOString().slice(0,19).replace('T',' ').toLowerCase().includes(q) : false)
      );
    });

    return (
    <div className="bg-white px-5">
      <div className="py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
            <p className="text-sm text-gray-600 mt-1">
              A list of all the products in your account including their name, packing, quantity and etc.
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inventory..."
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Packing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                cases
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Godown
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                UpdatedAt
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventory.map((user) => (
              <tr key={user.inventory_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.product_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{user.packing}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{user.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{user.cases}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{user.godown_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{new Date(user.updated_at).toISOString().slice(0, 19).replace("T", " ")}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default home