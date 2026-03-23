import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Filter,
  BookOpen,
  ArrowLeft
} from 'lucide-react'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import TopicManagementLogic from '../../../components/Admin/TopicManagement'
import Dialog from '../../../components/shared/dialog/Dialog'
import Form from '../../../components/shared/form/Form'
import DeleteConfirmDialog from '../../../components/shared/delete-confirm-dialog/DeleteConfirmDialog'
import SearchBox from '../../../components/shared/search/SearchBox'
import Button from '../../../components/shared/button/Button'
import './TopicManagement.css'

const TopicManagement = () => {
  const { competitionId, subjectId, chapterId } = useParams()
  const navigate = useNavigate()
  
  const {
    topics,
    loading,
    searchTerm,
    setSearchTerm,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedTopic,
    setSelectedTopic,
    error,
    setError,
    chapterName,
    setChapterName,
    subjectName,
    setSubjectName,
    competitionName,
    setCompetitionName,
    handleCreateTopic,
    handleUpdateTopic,
    handleDeleteTopic,
    handleEditClick,
    handleDeleteClick,
    topicFormFields,
    editFormFields
  } = TopicManagementLogic(chapterId, subjectId, competitionId)

  if (loading) {
    return (
      <div className="topic-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading topics...</p>
      </div>
    )
  }

  return (
    <div className="topic-management">
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
        <button 
          className="breadcrumb-link"
          onClick={() => navigate(`/admin/competition/${competitionId}/subjects/${subjectId}/chapters`)}
        >
          {subjectName || 'Chapters'}
        </button>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">{chapterName || 'Topics'}</span>
      </div>

      <div className="topic-management-header">
        <div className="header-left">
          <h1 className="page-title">Topic Management</h1>
          <p className="page-subtitle">Manage topics for this chapter</p>
        </div>
        <Button 
          variant="primary"
          size="medium"
          onClick={() => setShowCreateDialog(true)}
          icon={<Plus size={20} />}
        >
          Add Topic
        </Button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="topic-management-filters">
        <SearchBox
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="300px"
        />
      </div>

      <div className="topics-table-container">
        <table className="topics-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Duration (min)</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No topics found
                </td>
              </tr>
            ) : (
              topics.map((topic) => (
                <tr key={topic._id}>
                  <td>
                    <div className="topic-info">
                      <BookOpen size={16} className="topic-icon" />
                      <span className="topic-name">
                        {topic.Name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="topic-duration">
                      {topic.Duration}
                    </span>
                  </td>
                  <td>
                    <span className="topic-priority">
                      {topic.Priority}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditClick(topic)}
                        title="Edit Topic"
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClick(topic)}
                        title="Delete Topic"
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

      {/* Create Topic Dialog */}
      <Dialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        title="Create New Topic"
        size="medium"
      >
        <Form
          fields={topicFormFields}
          onSubmit={handleCreateTopic}
          onCancel={() => setShowCreateDialog(false)}
          mode="create"
        />
      </Dialog>

      {/* Edit Topic Dialog */}
      <Dialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Edit Topic"
        size="medium"
      >
        <Form
          data={selectedTopic}
          fields={editFormFields}
          onSubmit={handleUpdateTopic}
          onCancel={() => setShowEditDialog(false)}
          mode="edit"
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Topic"
        size="small"
      >
        <DeleteConfirmDialog
          item={selectedTopic}
          onConfirm={handleDeleteTopic}
          onCancel={() => setShowDeleteDialog(false)}
          title="Delete Topic"
          message="Are you sure you want to delete {itemName}? This action cannot be undone."
          itemName={selectedTopic?.Name}
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

export default TopicManagement
