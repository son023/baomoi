import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { adminAPI, authHelpers, categoriesAPI, tagsAPI } from '../services/api';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
`;

const LogoutButton = styled.button`
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 14px;
`;

const Section = styled.section`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const SectionHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const Button = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: #666;
  font-weight: 500;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? '#e74c3c' : '#667eea'};
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  font-size: 12px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SubmitButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background: #5a6fd8;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

function AdminPage() {
  const [stats, setStats] = useState({});
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    category_id: '',
    tag_ids: [],
    media_url: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (!authHelpers.isAdmin()) {
      navigate('/login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      // Use admin APIs for dashboard data
      const [dashboardRes, articlesRes, categoriesRes, tagsRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getArticles(),
        categoriesAPI.getAll(),
        tagsAPI.getAll()
      ]);

      const dashboardData = dashboardRes.data || {};
      const articles = articlesRes.data?.articles || [];
      const categories = categoriesRes.data || [];
      const tags = tagsRes.data || [];
      
      setStats(dashboardData.stats || {
        total_articles: articles.length,
        total_categories: categories.length,
        total_tags: tags.length,
        total_users: 0
      });
      
      setArticles(articles);
      setCategories(categories);
      setTags(tags);
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Set default values if API fails
      setStats({
        total_articles: 0,
        total_categories: 0,
        total_tags: 0,
        total_users: 0
      });
      setArticles([]);
      setCategories([]);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to handle API operations with consistent error handling
  const handleApiOperation = async (operation, successMessage, errorMessage) => {
    try {
      await operation();
      if (successMessage) alert(successMessage);
      loadData(); // Reload data
    } catch (error) {
      console.error('API operation error:', error);
      alert(errorMessage || 'Có lỗi xảy ra');
    }
  };

  const handleLogout = () => {
    authHelpers.removeToken();
    navigate('/');
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      await handleApiOperation(
        () => adminAPI.deleteArticle(id),
        'Xóa bài viết thành công!',
        'Lỗi khi xóa bài viết'
      );
    }
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      const articleData = {
        title: newArticle.title,
        content: newArticle.content,
        category_id: parseInt(newArticle.category_id),
        tag_ids: newArticle.tag_ids.map(id => parseInt(id)),
        media_url: newArticle.media_url
      };
      
      await adminAPI.createArticle(articleData);
      setShowCreateModal(false);
      setNewArticle({
        title: '',
        content: '',
        category_id: '',
        tag_ids: [],
        media_url: ''
      });
      loadData(); // Reload data
      alert('Tạo bài viết thành công!');
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Lỗi khi tạo bài viết: ' + (error.response?.data?.error || error.message));
    } finally {
      setCreating(false);
    }
  };

  const handleTagChange = (tagId) => {
    const tagIds = newArticle.tag_ids.includes(tagId)
      ? newArticle.tag_ids.filter(id => id !== tagId)
      : [...newArticle.tag_ids, tagId];
    
    setNewArticle({ ...newArticle, tag_ids: tagIds });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <LogoutButton onClick={handleLogout}>Đăng xuất</LogoutButton>
      </Header>

      <Content>
        <StatsGrid>
          <StatCard>
            <StatNumber>{stats.total_articles || articles.length}</StatNumber>
            <StatLabel>Bài viết</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.total_categories || categories.length}</StatNumber>
            <StatLabel>Danh mục</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.total_tags || tags.length}</StatNumber>
            <StatLabel>Tags</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.total_users || 0}</StatNumber>
            <StatLabel>Người dùng</StatLabel>
          </StatCard>
        </StatsGrid>

        <Section>
          <SectionHeader>
            <SectionTitle>Quản lý bài viết</SectionTitle>
            <Button onClick={() => setShowCreateModal(true)}>
              Thêm bài viết
            </Button>
          </SectionHeader>
          
          {articles.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <Th>Tiêu đề</Th>
                  <Th>Tác giả</Th>
                  <Th>Ngày đăng</Th>
                  <Th>Trạng thái</Th>
                  <Th>Thao tác</Th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article.article_id}>
                    <Td>{article.title}</Td>
                    <Td>{article.author?.username || 'Admin'}</Td>
                    <Td>{new Date(article.published_date).toLocaleDateString('vi-VN')}</Td>
                    <Td>{article.status}</Td>
                    <Td>
                      <ActionButton onClick={() => handleDeleteArticle(article.article_id)} danger>
                        Xóa
                      </ActionButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              Chưa có bài viết nào
            </div>
          )}
        </Section>
      </Content>

      {/* Create Article Modal */}
      {showCreateModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Thêm bài viết mới</ModalTitle>
              <CloseButton onClick={() => setShowCreateModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleCreateArticle}>
              <FormGroup>
                <Label>Tiêu đề</Label>
                <Input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Nội dung</Label>
                <Textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Danh mục</Label>
                <Select
                  value={newArticle.category_id}
                  onChange={(e) => setNewArticle({ ...newArticle, category_id: e.target.value })}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Tags</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {tags.map(tag => (
                    <label key={tag.tag_id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <input
                        type="checkbox"
                        checked={newArticle.tag_ids.includes(tag.tag_id)}
                        onChange={() => handleTagChange(tag.tag_id)}
                      />
                      {tag.name}
                    </label>
                  ))}
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label>URL hình ảnh</Label>
                <Input
                  type="url"
                  value={newArticle.media_url}
                  onChange={(e) => setNewArticle({ ...newArticle, media_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </FormGroup>
              
              <SubmitButton type="submit" disabled={creating}>
                {creating ? 'Đang tạo...' : 'Tạo bài viết'}
              </SubmitButton>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </AdminContainer>
  );
}

export default AdminPage; 