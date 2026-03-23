import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Filter,
  BookOpen,
  ArrowLeft
} from 'lucide-react'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import SubjectManagementLogic from '../../../components/Admin/SubjectManagement'
import Dialog from '../../../components/shared/dialog/Dialog'
import Form from '../../../components/shared/form/Form'
import DeleteConfirmDialog from '../../../components/shared/delete-confirm-dialog/DeleteConfirmDialog'
import SearchBox from '../../../components/shared/search/SearchBox'
import Button from '../../../components/shared/button/Button'
import './SubjectManagement.css'

const SubjectManagement = () => {
  const { competitionId } = useParams()
  const navigate = useNavigate()
  
  const {
    subjects,
    loading,
    searchTerm,
    setSearchTerm,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedSubject,
    setSelectedSubject,
    error,
    setError,
    competitionName,
    setCompetitionName,
    handleCreateSubject,
    handleUpdateSubject,
    handleDeleteSubject,
    handleEditClick,
    handleDeleteClick,
    subjectFormFields,
    editFormFields
  } = SubjectManagementLogic(competitionId)

  if (loading) {
    return (
      <div className="subject-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading subjects...</p>
      </div>
    )
  }

  return (
    <div className="subject-management">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button 
          className="breadcrumb-back"
          onClick={() => navigate('/admin/competition')}
        >
          <ArrowLeft size={16} />
          Competition
        </button>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">{competitionName || 'Subjects'}</span>
      </div>

      <div className="subject-management-header">
        <div className="header-left">
          <h1 className="page-title">Subject Management</h1>
          <p className="page-subtitle">Manage subjects for this competition</p>
        </div>
        <Button 
          variant="primary"
          size="medium"
          onClick={() => setShowCreateDialog(true)}
          icon={<Plus size={20} />}
        >
          Add Subject
        </Button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="subject-management-filters">
        <SearchBox
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="300px"
        />
      </div>

      <div className="subjects-table-container">
        <table className="subjects-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Duration (min)</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No subjects found
                </td>
              </tr>
            ) : (
              subjects.map((subject) => (
                <tr key={subject._id}>
                  <td>
                    <div className="subject-info">
                      <BookOpen size={16} className="subject-icon" />
                      <button 
                        className="subject-name-link"
                        onClick={() => navigate(`/admin/competition/${competitionId}/subjects/${subject._id}/chapters`)}
                      >
                        {subject.Name}
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className="subject-duration">
                      {subject.Duration}
                    </span>
                  </td>
                  <td>
                    <span className="subject-priority">
                      {subject.Priority}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditClick(subject)}
                        title="Edit Subject"
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClick(subject)}
                        title="Delete Subject"
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

      {/* Create Subject Dialog */}
      <Dialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        title="Create New Subject"
        size="medium"
      >
        <Form
          fields={subjectFormFields}
          onSubmit={handleCreateSubject}
          onCancel={() => setShowCreateDialog(false)}
          mode="create"
        />
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Edit Subject"
        size="medium"
      >
        <Form
          data={selectedSubject}
          fields={editFormFields}
          onSubmit={handleUpdateSubject}
          onCancel={() => setShowEditDialog(false)}
          mode="edit"
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Subject"
        size="small"
      >
        <DeleteConfirmDialog
          item={selectedSubject}
          onConfirm={handleDeleteSubject}
          onCancel={() => setShowDeleteDialog(false)}
          title="Delete Subject"
          message="Are you sure you want to delete {itemName}? This action cannot be undone."
          itemName={selectedSubject?.Name}
          itemDetails={[
            { label: 'Name', field: 'Name' },
            { label: 'Duration', field: 'Duration' },
            { label: 'Priority', field: 'Priority' }
          ]}
        />
      </Dialog>
    </div>
  )
}

export default SubjectManagement
