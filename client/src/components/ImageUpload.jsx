import { useState } from "react";
import { extractInvoiceDetails } from "../api/invoiceApi";

const ImageUpload = ({ onUploadSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const data = await extractInvoiceDetails(formData);
            onUploadSuccess(data);
        } catch (err) {
            console.error("Upload failed", err);
            setError("Failed to extract details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
            <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                {loading ? "Processing..." : "Upload Invoice Image"}
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={loading}
                />
            </label>
            {loading && <p className="text-sm text-gray-500 mt-2">Extracting details with AI...</p>}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default ImageUpload;
