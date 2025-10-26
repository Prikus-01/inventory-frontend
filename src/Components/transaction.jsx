import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';

const transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [products, setProducts] = useState([]);
    const [godowns, setGodowns] = useState([]);
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(()=>{
        async function run() {
            try {
                const {data} =  await axios.get('https://inv-man.onrender.com/api/v1/transactions/display');
                setTransactions(data.data);
            } catch (error) {
                console.log(error);
            }
        }
        run();
    },[])

    const addButton = async ()=>{
      const products =  await axios.get('https://inv-man.onrender.com/api/v1/products');
      setProducts(products.data.data);
      const data =  await axios.get('https://inv-man.onrender.com/api/v1/godowns');
      setGodowns(data.data.data);
      setShowAddModal(true);
      setFormData({ transaction_type : '', product_id: '', godown_id: '', quantity: '', reference_number: '' })
    }

    const addHandler = async () => {
      try {
        const { transaction_type, product_id, godown_id, quantity, reference_number } = formData;
        let newErrors = {};

        if (!transaction_type) newErrors.transaction_type = "transaction_type is required.";

        if (!product_id) newErrors.product_id = "Product is required.";

        if (!godown_id) newErrors.godown_id = "gogown is required.";

        if (!quantity) newErrors.quantity = "quantity is required.";
        else if(!/^\d+$/.test(quantity)) newErrors.quantity = "Must be a valid integer.";

        if (!reference_number) newErrors.reference_number = "reference_number is required.";
        else if(!/^\d+$/.test(reference_number)) newErrors.reference_number = "Must be a valid integer.";


        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }

        setErrors({});

        const response = await axios.post(`https://inv-man.onrender.com/api/v1/transactions`,formData);
        if(response.status === 204) {
          setShowStockModal(true);
          return;
        }
        closeModal();
        const { data } = await axios.get('https://inv-man.onrender.com/api/v1/transactions/display');
        setTransactions(data.data);
      } catch (error) {
        console.error("Failed to add product", error);
      }
    }

    const deleteHandler = async (user) => {
      try {
        await axios.delete(`https://inv-man.onrender.com/api/v1/transactions/${user.transactions_id}`);
        const { data } = await axios.get('https://inv-man.onrender.com/api/v1/transactions/display');
        setTransactions(data.data);
      } catch (error) {
        console.error("Failed to delete product", error);
      }
    }

    const closeModal = () => {
    setShowAddModal(false);
    setFormData({});
  }
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const filteredTransactions = transactions.filter((t) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      String(t.transactions_id).toLowerCase().includes(q) ||
      (t.transaction_type || '').toLowerCase().includes(q) ||
      (t.product_name || '').toLowerCase().includes(q) ||
      (t.packing || '').toLowerCase().includes(q) ||
      String(t.quantity ?? '').toLowerCase().includes(q) ||
      (t.godown_name || '').toLowerCase().includes(q) ||
      String(t.reference_number ?? '').toLowerCase().includes(q) ||
      (t.transactions_date ? new Date(t.transactions_date).toISOString().slice(0, 19).replace('T',' ').toLowerCase().includes(q) : false)
    );
  });

  return (
    <div className="bg-white">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
            <p className="text-sm text-gray-600 mt-1">
              list of all the Transactions and details.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
            onClick={addButton}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
              Add Transactions
            </button>
          </div>
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
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                packing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                godown name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                reference number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((user) => (
              <tr key={user.transactions_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.transactions_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.transaction_type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(user.transactions_date).toISOString().slice(0, 19).replace("T", " ")}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.product_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.packing}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.godown_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.reference_number}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <button 
                  onClick={() => {
                    deleteHandler(user);
                  }}
                  className="text-red-600 hover:text-indigo-900 transition-colors">
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
                <h3 className="text-lg font-medium text-gray-900">Add New Transaction</h3>
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
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Choose in/out : </label>
                  <select onChange={handleInputChange} name="transaction_type" id="type" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">SELECT</option>
                    <option value="inward">inward</option>
                    <option value="outward">outward</option>
                  </select>
                  {errors.transaction_type && <p className="text-red-500 text-xs mt-1">{errors.transaction_type}</p>}
                  <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">Choose a product : </label>
                  <select onChange={handleInputChange} name="product_id" id="product" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">SELECT</option>
                    {products.map((product)=>(
                      <option key={product.product_id} value={product.product_id}>{product.product_name},{product.packing}</option>
                    ))}
                  </select>
                  {errors.product_id && <p className="text-red-500 text-xs mt-1">{errors.product_id}</p>}
                  <label htmlFor="godown" className="block text-sm font-medium text-gray-700 mb-2">Choose a godown : </label>
                  <select onChange={handleInputChange} name="godown_id" id="godown" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">SELECT</option>
                    {godowns.map((godown)=>(
                      <option key={godown.godown_id} value={godown.godown_id}>{godown.godown_name}</option>
                    ))}
                  </select>
                  {errors.godown_id && <p className="text-red-500 text-xs mt-1">{errors.godown_id}</p>}
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                  <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Reference number
                  </label>
                  <input
                    type="text"
                    id="reference_number"
                    name="reference_number"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {errors.reference_number && <p className="text-red-500 text-xs mt-1">{errors.reference_number}</p>}
                  {errors.not_in_stock && <p className="text-red-500 text-xs mt-1">{errors.not_in_stock}</p>}
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
                    Add Transactions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStockModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Material not in Stock.</h3>
                <button
                  onClick={()=>{setShowStockModal(false)}}
                  className="text-gray-400 hover:text-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default transaction