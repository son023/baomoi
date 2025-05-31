import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { commentsAPI, authHelpers } from '../services/api';

const CommentSectionContainer = styled.div`
  margin-top: 3rem;
  padding: 2rem 0;
  border-top: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CommentCount = styled.span`
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const CommentForm = styled.form`
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
`;

const CharacterCount = styled.span`
  font-size: 0.875rem;
  color: ${props => props.isNearLimit ? '#e53e3e' : '#718096'};
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  ${props => props.variant === 'primary' && `
    background: #667eea;
    color: white;
    
    &:hover:not(:disabled) {
      background: #5a67d8;
      transform: translateY(-1px);
    }
    
    &:disabled {
      background: #a0aec0;
      cursor: not-allowed;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: transparent;
    color: #718096;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background: #f7fafc;
      color: #2d3748;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background: #e53e3e;
    color: white;
    
    &:hover {
      background: #c53030;
    }
  `}
  
  ${props => props.size === 'small' && `
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  `}
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CommentItem = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
`;

const AuthorDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
`;

const CommentDate = styled.span`
  font-size: 0.75rem;
  color: #718096;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CommentContent = styled.div`
  color: #2d3748;
  line-height: 1.6;
  margin-bottom: 1rem;
  white-space: pre-wrap;
`;

const ReplySection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
`;

const RepliesList = styled.div`
  margin-left: 2rem;
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #feb2b2;
`;

const LoginPrompt = styled.div`
  background: #ebf8ff;
  border: 1px solid #bee3f8;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 2rem;
  
  p {
    margin: 0 0 1rem 0;
    color: #2b6cb0;
  }
`;

const CommentSection = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  const user = authHelpers.getUser();
  const isAuthenticated = authHelpers.isAuthenticated();
  const maxLength = 1000;

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentsAPI.getByArticle(articleId);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    setError('');
    
    try {
      const commentData = {
        article_id: articleId,
        content: newComment.trim(),
        parent_comment_id: replyingTo
      };
      
      await commentsAPI.create(commentData);
      setNewComment('');
      setReplyingTo(null);
      await fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;
    
    try {
      await commentsAPI.update(commentId, { content: editContent.trim() });
      setEditingComment(null);
      setEditContent('');
      await fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
      setError('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await commentsAPI.delete(commentId);
      await fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const renderComment = (comment, isReply = false) => (
    <CommentItem key={comment.id}>
      <CommentHeader>
        <AuthorInfo>
          <Avatar>{getInitials(comment.author_name)}</Avatar>
          <AuthorDetails>
            <AuthorName>{comment.author_name}</AuthorName>
            <CommentDate>{formatDate(comment.publish_date)}</CommentDate>
          </AuthorDetails>
        </AuthorInfo>
        
        {comment.can_edit && (
          <CommentActions>
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                setEditingComment(comment.id);
                setEditContent(comment.content);
              }}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => handleDeleteComment(comment.id)}
            >
              Delete
            </Button>
          </CommentActions>
        )}
      </CommentHeader>
      
      {editingComment === comment.id ? (
        <div>
          <TextArea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={maxLength}
          />
          <FormActions>
            <CharacterCount isNearLimit={editContent.length > maxLength * 0.9}>
              {editContent.length}/{maxLength}
            </CharacterCount>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  setEditingComment(null);
                  setEditContent('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => handleEditComment(comment.id)}
                disabled={!editContent.trim()}
              >
                Save
              </Button>
            </div>
          </FormActions>
        </div>
      ) : (
        <>
          <CommentContent>{comment.content}</CommentContent>
          
          {!isReply && isAuthenticated && (
            <ReplyButton onClick={() => setReplyingTo(comment.id)}>
              Reply
            </ReplyButton>
          )}
          
          {replyingTo === comment.id && (
            <ReplySection>
              <CommentForm onSubmit={handleSubmitComment}>
                <TextArea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`Reply to ${comment.author_name}...`}
                  maxLength={maxLength}
                  required
                />
                <FormActions>
                  <CharacterCount isNearLimit={newComment.length > maxLength * 0.9}>
                    {newComment.length}/{maxLength}
                  </CharacterCount>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setReplyingTo(null);
                        setNewComment('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={submitting || !newComment.trim()}
                    >
                      {submitting ? 'Posting...' : 'Post Reply'}
                    </Button>
                  </div>
                </FormActions>
              </CommentForm>
            </ReplySection>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <RepliesList>
              {comment.replies.map(reply => renderComment(reply, true))}
            </RepliesList>
          )}
        </>
      )}
    </CommentItem>
  );

  if (loading) {
    return (
      <CommentSectionContainer>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
          Loading comments...
        </div>
      </CommentSectionContainer>
    );
  }

  return (
    <CommentSectionContainer>
      <SectionTitle>
        Comments
        <CommentCount>{comments.length}</CommentCount>
      </SectionTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!isAuthenticated ? (
        <LoginPrompt>
          <p>Join the conversation! Please log in to leave a comment.</p>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/login'}
          >
            Sign In
          </Button>
        </LoginPrompt>
      ) : (
        !replyingTo && (
          <CommentForm onSubmit={handleSubmitComment}>
            <TextArea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              maxLength={maxLength}
              required
            />
            <FormActions>
              <CharacterCount isNearLimit={newComment.length > maxLength * 0.9}>
                {newComment.length}/{maxLength}
              </CharacterCount>
              <Button
                variant="primary"
                type="submit"
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </FormActions>
          </CommentForm>
        )
      )}
      
      {comments.length > 0 ? (
        <CommentsList>
          {comments.map(comment => renderComment(comment))}
        </CommentsList>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </CommentSectionContainer>
  );
};

export default CommentSection; 