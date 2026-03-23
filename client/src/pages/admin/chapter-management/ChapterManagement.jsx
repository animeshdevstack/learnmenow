import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Filter,
  BookOpen,
  ArrowLeft
} from 'lucide-react'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import ChapterManagementLogic from '../../../components/Admin/ChapterManagement'
import Dialog from '../../../components/shared/dialog/Dialog'
import Form from '../../../components/shared/form/Form'
import DeleteConfirmDialog from '../../../components/shared/delete-confirm-dialog/DeleteConfirmDialog'
import SearchBox from '../../../components/shared/search/SearchBox'
import Button from '../../../components/shared/button/Button'
import './ChapterManagement.css'

const ChapterManagement = () => {
  const { competitionId, subjectId } = useParams()
  const navigate = useNavigate()
  
  const {
    chapters,
    loading,
    searchTerm,
    setSearchTerm,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedChapter,
    setSelectedChapter,
    error,
    setError,
    subjectName,
    setSubjectName,
    competitionName,
    setCompetitionName,
    handleCreateChapter,
    handleUpdateChapter,
    handleDeleteChapter,
    handleEditClick,
    handleDeleteClick,
    chapterFormFields,
    editFormFields
  } = ChapterManagementLogic(subjectId, competitionId)

  if (loading) {
    return (
      <div className="chapter-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading chapters...</p>
      </div>
    )
  }

  return (
    <div className="chapter-management">
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
        <button 
          className="breadcrumb-link"
          onClick={() => navigate(`/admin/competition/${competitionId}/subjects`)}
        >
          {competitionName || 'Subjects'}
        </button>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">{subjectName || 'Chapters'}</span>
      </div>

      <div className="chapter-management-header">
        <div className="header-left">
          <h1 className="page-title">Chapter Management</h1>
          <p className="page-subtitle">Manage chapters for this subject</p>
        </div>
        <Button 
          variant="primary"
          size="medium"
          onClick={() => setShowCreateDialog(true)}
          icon={<Plus size={20} />}
        >
          Add Chapter
        </Button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="chapter-management-filters">
        <SearchBox
          placeholder="Search chapters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="300px"
        />
      </div>

      <div className="chapters-table-container">
        <table className="chapters-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Duration (min)</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chapters.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No chapters found
                </td>
              </tr>
            ) : (
              chapters.map((chapter) => (
                <tr key={chapter._id}>
                  <td>
                    <div className="chapter-info">
                      <BookOpen size={16} className="chapter-icon" />
                      <button 
                        className="chapter-name-link"
                        onClick={() => navigate(`/admin/competition/${competitionId}/subjects/${subjectId}/chapters/${chapter._id}/topics`)}
                      >
                        {chapter.Name}
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className="chapter-duration">
                      {chapter.Duration}
                    </span>
                  </td>
                  <td>
                    <span className="chapter-priority">
                      {chapter.Priority}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditClick(chapter)}
                        title="Edit Chapter"
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClick(chapter)}
                        title="Delete Chapter"
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

      {/* Create Chapter Dialog */}
      <Dialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        title="Create New Chapter"
        size="medium"
      >
        <Form
          fields={chapterFormFields}
          onSubmit={handleCreateChapter}
          onCancel={() => setShowCreateDialog(false)}
          mode="create"
        />
      </Dialog>

      {/* Edit Chapter Dialog */}
      <Dialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Edit Chapter"
        size="medium"
      >
        <Form
          data={selectedChapter}
          fields={editFormFields}
          onSubmit={handleUpdateChapter}
          onCancel={() => setShowEditDialog(false)}
          mode="edit"
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Chapter"
        size="small"
      >
        <DeleteConfirmDialog
          item={selectedChapter}
          onConfirm={handleDeleteChapter}
          onCancel={() => setShowDeleteDialog(false)}
          title="Delete Chapter"
          message="Are you sure you want to delete {itemName}? This action cannot be undone."
          itemName={selectedChapter?.Name}
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

export default ChapterManagement
