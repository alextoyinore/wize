import { useState } from 'react'
import XMarkIcon from '@/components/icons/XMarkIcon'

export default function ImageUploadModal({ isOpen, onClose, onUpload }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleUpload = async () => {
    if (!file) return setError('Please select an image')

    setUploading(true)
    setError('')

    try {
      // Call the onUpload callback with the file
      await onUpload(file)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <h2 className="text-xl font-semibold mb-4">Upload Course Image</h2>

          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <p>Drag and drop an image here or click to select</p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="block w-full text-center px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-800 cursor-pointer"
            >
              {file ? 'Change Image' : 'Select Image'}
            </label>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-800 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  )
}
