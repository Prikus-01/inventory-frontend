import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';

const products = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

    useEffect(()=>{
        async function run() {
            try {
                const {data} =  await axios.get('https://inv-man.onrender.com/api/v1/Products');
                setProducts(data.data);
            } catch (error) {
                console.log(error);
            }
        }
        run();
    },[])

    const addHandler = async () => {
    try {
      const { product_name, packing, units_in_case } = formData;
      let newErrors = {};

      if (!product_name) newErrors.product_name = "Product name is required.";
      else if (product_name.length > 30) newErrors.product_name = "Max 30 characters allowed.";

      if (!packing) newErrors.packing = "Packing is required.";

      if (!units_in_case) newErrors.units_in_case = "Units in case is required.";
      else if (!/^\d+$/.test(units_in_case)) newErrors.units_in_case = "Must be a valid integer.";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      closeModal();
      await axios.post('https://inv-man.onrender.com/api/v1/products/', formData);
      const { data } = await axios.get('https://inv-man.onrender.com/api/v1/products/');
      setProducts(data.data);
    } catch (error) {
      console.error("Failed to add products", error);
    }
  }

  const editHandler = async () => {
    try {
      const { product_id, product_name, packing, units_in_case } = formData;
      let newErrors = {};
      if (!product_id){
        alert("Product id is missing.");
        return;
      }

      if (!product_name) newErrors.product_name = "Product name is required.";
      else if (product_name.length > 30) newErrors.product_name = "Max 30 characters allowed.";

      if (!packing) newErrors.packing = "Packing is required.";

      if (!units_in_case) newErrors.units_in_case = "Units in case is required.";
      else if (!/^\d+$/.test(units_in_case)) newErrors.units_in_case = "Must be a valid integer.";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      closeModal();
      await axios.patch(`https://inv-man.onrender.com/api/v1/products/${formData.product_id}`,formData)
      const { data } = await axios.get('https://inv-man.onrender.com/api/v1/products');
      setProducts(data.data);
    } catch (error) {
      console.error("Failed to editing Products", error);
    }
  }

  const deleteHandler = async (user) => {
    try {
      await axios.delete(`https://inv-man.onrender.com/api/v1/products/${user.product_id}`)
      const { data } = await axios.get('https://inv-man.onrender.com/api/v1/products');
      setProducts(data.data);
    } catch (error) {
      console.error("Failed to delete product", error);
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
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="text-sm text-gray-600 mt-1">
              list of all the Products and details.
            </p>
          </div>
          <button onClick={() => {
            setFormData({ product_name: '', packing : '', units_in_case: '' });
            setShowAddModal(true);
          }} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
            Add Product
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
                packing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                units in case
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((user) => (
              <tr key={user.product_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.product_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.product_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.packing}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.units_in_case}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <button onClick={()=>{
                    setFormData(user);
                    setShowEditModal(true);
                  }} className="text-indigo-600 hover:text-indigo-900 transition-colors">
                    Edit
                  </button> |
                  <button onClick={() => {
                    deleteHandler(user);
                  }} className="text-red-600 hover:text-indigo-900 transition-colors">
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
                <h3 className="text-lg font-medium text-gray-900">Add New Product</h3>
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
                  <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="product_name"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {errors.product_name && <p className="text-red-500 text-xs mt-1">{errors.product_name}</p>}
                  <label htmlFor="packing" className="block text-sm font-medium text-gray-700 mb-2">
                    Packing
                  </label>
                  <input
                    type="text"
                    id="packing"
                    name="packing"
                    value={formData.packing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {errors.packing && <p className="text-red-500 text-xs mt-1">{errors.packing}</p>}
                  <label htmlFor="units_in_case" className="block text-sm font-medium text-gray-700 mb-2">
                    Units in case
                  </label>
                  <input
                    type="text"
                    id="units_in_case"
                    name="units_in_case"
                    value={formData.units_in_case}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {errors.units_in_case && <p className="text-red-500 text-xs mt-1">{errors.units_in_case}</p>}
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
                    Add Product
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
                <h3 className="text-lg font-medium text-gray-900">Edit Product</h3>
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
                  <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="product_name"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {errors.product_name && <p className="text-red-500 text-xs mt-1">{errors.product_name}</p>}
                  <label htmlFor="packing" className="block text-sm font-medium text-gray-700 mb-2">
                    packing
                  </label>
                  <input
                    type="text"
                    id="packing"
                    name="packing"
                    value={formData.packing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {errors.packing && <p className="text-red-500 text-xs mt-1">{errors.packing}</p>}
                  <label htmlFor="units_in_case" className="block text-sm font-medium text-gray-700 mb-2">
                    Units in case
                  </label>
                  <input
                    type="text"
                    id="units_in_case"
                    name="units_in_case"
                    value={formData.units_in_case}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {errors.units_in_case && <p className="text-red-500 text-xs mt-1">{errors.units_in_case}</p>}
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
                    Update Product
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

export default products