import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Filter,
  Trophy
} from 'lucide-react'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import CompetitionManagementLogic from '../../../components/Admin/CompetitionManagement'
import Dialog from '../../../components/shared/dialog/Dialog'
import Form from '../../../components/shared/form/Form'
import DeleteConfirmDialog from '../../../components/shared/delete-confirm-dialog/DeleteConfirmDialog'
import SearchBox from '../../../components/shared/search/SearchBox'
import Button from '../../../components/shared/button/Button'
import './CompetitionManagement.css'

const CompetitionManagement = () => {
  const navigate = useNavigate()
  
  const {
    competitions,
    loading,
    searchTerm,
    setSearchTerm,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedCompetition,
    setSelectedCompetition,
    error,
    setError,
    handleCreateCompetition,
    handleUpdateCompetition,
    handleDeleteCompetition,
    handleEditClick,
    handleDeleteClick,
    competitionFormFields,
    editFormFields
  } = CompetitionManagementLogic()

  if (loading) {
    return (
      <div className="competition-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading competitions...</p>
      </div>
    )
  }

  return (
    <div className="competition-management">
      <div className="competition-management-header">
        <div className="header-left">
          <h1 className="page-title">Competition Management</h1>
          <p className="page-subtitle">Manage your platform competitions</p>
        </div>
        <Button 
          variant="primary"
          size="medium"
          onClick={() => setShowCreateDialog(true)}
          icon={<Plus size={20} />}
        >
          Add Competition
        </Button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="competition-management-filters">
        <SearchBox
          placeholder="Search competitions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="300px"
        />
      </div>

      <div className="competitions-table-container">
        <table className="competitions-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {competitions.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">
                  No competitions found
                </td>
              </tr>
            ) : (
              competitions.map((competition) => (
                <tr key={competition._id}>
                  <td>
                    <div className="competition-info">
                      <Trophy size={16} className="competition-icon" />
                      <button 
                        className="competition-name-btn"
                        onClick={() => navigate(`/admin/competition/${competition._id}/subjects`)}
                        title="View subjects"
                      >
                        {competition.Name}
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className="competition-description">
                      {competition.Desciption || 'No description'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditClick(competition)}
                        title="Edit Competition"
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClick(competition)}
                        title="Delete Competition"
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

      {/* Create Competition Dialog */}
      <Dialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        title="Create New Competition"
        size="medium"
      >
        <Form
          fields={competitionFormFields}
          onSubmit={handleCreateCompetition}
          onCancel={() => setShowCreateDialog(false)}
          mode="create"
        />
      </Dialog>

      {/* Edit Competition Dialog */}
      <Dialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Edit Competition"
        size="medium"
      >
        <Form
          data={selectedCompetition}
          fields={editFormFields}
          onSubmit={handleUpdateCompetition}
          onCancel={() => setShowEditDialog(false)}
          mode="edit"
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Competition"
        size="small"
      >
        <DeleteConfirmDialog
          item={selectedCompetition}
          onConfirm={handleDeleteCompetition}
          onCancel={() => setShowDeleteDialog(false)}
          title="Delete Competition"
          message="Are you sure you want to delete {itemName}? This action cannot be undone."
          itemName={selectedCompetition?.Name}
          itemDetails={[
            { label: 'Name', field: 'Name' },
            { label: 'Description', field: 'Desciption' }
          ]}
        />
      </Dialog>
    </div>
  )
}

export default CompetitionManagement
