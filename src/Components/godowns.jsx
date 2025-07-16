import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';

const godowns = () => {
  const [godown, setGodown] = useState([]);

    useEffect(()=>{
        async function run() {
            try {
                const {data} =  await axios.get('http://192.168.251.175:6213/api/v1/godowns');
                setGodown(data.data);
            } catch (error) {
                console.log(error);
            }
        }
        run();
    },[])
    
  return (
    <div className="bg-white">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Godowns</h1>
            <p className="text-sm text-gray-600 mt-1">
              A list of all the Godowns.
            </p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
            Add Godown
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {godown.map((user) => (
              <tr key={user.godown_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.godown_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.godown_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 transition-colors">
                    Edit
                  </button> |
                  <button className="text-red-600 hover:text-indigo-900 transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default godowns