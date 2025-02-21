import React, { useState } from "react";

const AssetListingForm = () => {
  const [formData, setFormData] = useState({
    assetName: "",
    assetDescription: "",
    assetPrice: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add your form submission logic here
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-6 bg-gray-900 rounded-lg">
      <h2 className="text-white text-2xl font-bold mb-6 text-center">List Asset</h2>
      <input
        type="text"
        name="assetName"
        placeholder="Asset Name"
        value={formData.assetName}
        onChange={handleChange}
        className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
        aria-label="Asset Name"
        required
      />
      <textarea
        name="assetDescription"
        placeholder="Asset Description"
        value={formData.assetDescription}
        onChange={handleChange}
        className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
        aria-label="Asset Description"
        required
      />
      <input
        type="number"
        name="assetPrice"
        placeholder="Asset Price"
        value={formData.assetPrice}
        onChange={handleChange}
        className="w-full p-3 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-blue-500"
        aria-label="Asset Price"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-3 rounded font-bold flex items-center justify-center my-6 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Listing..." : "List"}
      </button>
    </form>
  </div>
  );
};

export default AssetListingForm;
