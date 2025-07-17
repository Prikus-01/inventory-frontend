import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';

const godowns = () => {
  const [godown, setGodown] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

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

  const addHandler = async () => {
    try {
      const { godown_name } = formData;
      let newErrors = {};

      if(!godown_name) newErrors.godown_name = "Godown name is required."

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});

      closeModal();
      await axios.post('http://192.168.251.175:6213/api/v1/godowns', formData);
      const { data } = await axios.get('http://192.168.251.175:6213/api/v1/godowns');
      setGodown(data.data);
    } catch (error) {
      console.error("Failed to add godown", error);
    }
  }

  const editHandler = async () => {
    try {
      const { godown_name } = formData;
      let newErrors = {};

      if(!godown_name) newErrors.godown_name = "Godown name is required."

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      closeModal();
      await axios.patch(`http://192.168.251.175:6213/api/v1/godowns/${formData.godown_id}`,formData)
      const { data } = await axios.get('http://192.168.251.175:6213/api/v1/godowns');
      setGodown(data.data);
    } catch (error) {
      console.error("Failed to editing godown", error);
    }
  }

  const deleteHandler = async (user) => {
    try {
      await axios.delete(`http://192.168.251.175:6213/api/v1/godowns/${user.godown_id}`)
      const { data } = await axios.get('http://192.168.251.175:6213/api/v1/godowns');
      setGodown(data.data);
    } catch (error) {
      console.error("Failed to delete godown", error);
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setFormData({});
  }
    
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
          <button onClick={() => {
            setFormData({ godown_name: '' });
            setShowAddModal(true);
          }} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
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
                  <button className="text-indigo-600 hover:text-indigo-900 transition-colors mr-3" onClick={() => {
                    setFormData({godown_id: user.godown_id, godown_name: user.godown_name });
                    setShowEditModal(true);
                  }}>
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900 transition-colors" onClick={() => deleteHandler(user)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Godown</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                <div className="mb-4">
                  <label htmlFor="godown_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Godown Name
                  </label>
                  <input
                    type="text"
                    id="godown_name"
                    name="godown_name"
                    value={formData.godown_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {errors.godown_name && <p className="text-red-500 text-xs mt-1">{errors.godown_name}</p>}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={addHandler}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Add Godown
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Godown</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                <div className="mb-4">
                  <label htmlFor="edit_godown_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Godown Name
                  </label>
                  <input
                    type="text"
                    id="edit_godown_name"
                    name="godown_name"
                    value={formData.godown_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {errors.godown_name && <p className="text-red-500 text-xs mt-1">{errors.godown_name}</p>}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={editHandler}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Update Godown
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default godowns