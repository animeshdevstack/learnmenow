import React from 'react'
import { 
  Plus, 
  Filter,
  Mail,
  Phone,
  Shield
} from 'lucide-react'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import UserManagementLogic from '../../../components/Admin/UserManagement'
import Dialog from '../../../components/shared/dialog/Dialog'
import Form from '../../../components/shared/form/Form'
import DeleteConfirmDialog from '../../../components/shared/delete-confirm-dialog/DeleteConfirmDialog'
import SearchBox from '../../../components/shared/search/SearchBox'
import Button from '../../../components/shared/button/Button'
import './UserManagement.css'

const UserManagement = () => {
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedUser,
    setSelectedUser,
    error,
    setError,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleEditClick,
    handleDeleteClick,
    getRoleBadgeClass,
    userFormFields,
    editFormFields
  } = UserManagementLogic()

  if (loading) {
    return (
      <div className="user-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    )
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div className="header-left">
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage your platform users</p>
        </div>
        <Button 
          variant="primary"
          size="medium"
          onClick={() => setShowCreateDialog(true)}
          icon={<Plus size={20} />}
        >
          Add User
        </Button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="user-management-filters">
        <SearchBox
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="300px"
        />
        
        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <span className="user-name">
                        {user.FName} {user.LName}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">
                      <Mail size={14} />
                      <span>{user.Email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="phone-cell">
                      <Phone size={14} />
                      <span>{user.Phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className={getRoleBadgeClass(user.Role)}>
                      <Shield size={12} />
                      {user.Role}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditClick(user)}
                        title="Edit User"
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClick(user)}
                        title="Delete User"
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Dialog */}
      <Dialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        title="Create New User"
        size="medium"
      >
        <Form
          fields={userFormFields}
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateDialog(false)}
          mode="create"
        />
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Edit User"
        size="medium"
      >
        <Form
          data={selectedUser}
          fields={editFormFields}
          onSubmit={handleUpdateUser}
          onCancel={() => setShowEditDialog(false)}
          mode="edit"
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete User"
        size="small"
      >
        <DeleteConfirmDialog
          item={selectedUser}
          onConfirm={handleDeleteUser}
          onCancel={() => setShowDeleteDialog(false)}
          title="Delete User"
          message="Are you sure you want to delete {itemName}? This action cannot be undone."
          itemName={`${selectedUser?.FName} ${selectedUser?.LName}`}
          itemDetails={[
            { label: 'Email', field: 'Email' },
            { label: 'Phone', field: 'Phone' },
            { label: 'Role', field: 'Role' }
          ]}
        />
      </Dialog>
    </div>
  )
}

export default UserManagement
