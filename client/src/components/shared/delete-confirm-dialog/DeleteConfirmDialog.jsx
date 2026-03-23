import React from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import './DeleteConfirmDialog.css'

const DeleteConfirmDialog = ({ 
  item, 
  onConfirm, 
  onCancel, 
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item?',
  itemName = 'item',
  itemDetails = []
}) => {
  if (!item) return null

  return (
    <div className="delete-confirm-dialog">
      <div className="delete-warning">
        <div className="warning-icon">
          <AlertTriangle size={24} />
        </div>
        <h3 className="warning-title">{title}</h3>
        <p className="warning-message">
          {message.replace('{itemName}', itemName)}
        </p>
        {itemDetails.length > 0 && (
          <div className="item-details">
            {itemDetails.map((detail, index) => (
              <p key={index}>
                <strong>{detail.label}:</strong> {item[detail.field]}
              </p>
            ))}
          </div>
        )}
      </div>
      
      <div className="delete-actions">
        <button
          className="cancel-btn"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="delete-btn"
          onClick={onConfirm}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  )
}

export default DeleteConfirmDialog
