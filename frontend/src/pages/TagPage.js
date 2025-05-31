import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { articlesAPI } from '../services/api';

const TagContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const TagHeader = styled.header`
  margin-bottom: 30px;
  text-align: center;
`;

const TagTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-transform: capitalize;
`;

const TagDescription = styled.p`
  color: #666;
  font-size: 16px;
`;

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
`;

const ArticleCard = styled.article`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ArticleContent = styled.div`
  padding: 20px;
`;

const ArticleTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 1.4;
  color: #333;
  
  a {
    color: #333;
    text-decoration: none;
    
    &:hover {
      color: #667eea;
    }
  }
`;

const ArticleExcerpt = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
`;

const ArticleMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
`;

const NoArticles = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  font-weight: 500;
  text-decoration: none;
  margin-bottom: 20px;
  
  &:hover {
    text-decoration: underline;
  }
`;

function TagPage() {
  const { tagName } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticlesByTag();
  }, [tagName]);

  const loadArticlesByTag = async () => {
    try {
      setLoading(true);
      const response = await articlesAPI.getByTag(tagName);
      setArticles(response.data || []);
    } catch (error) {
      console.error('Error loading articles by tag:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingContainer>Đang tải...</LoadingContainer>;
  }

  return (
    <TagContainer>
      <BackLink to="/">← Về trang chủ</BackLink>
      
      <TagHeader>
        <TagTitle>#{tagName}</TagTitle>
        <TagDescription>
          Tất cả bài viết về {tagName}
        </TagDescription>
      </TagHeader>

      {articles.length > 0 ? (
        <ArticlesGrid>
          {articles.map(article => (
            <ArticleCard key={article.article_id}>
              <ArticleImage 
                src={article.media?.file_path || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'} 
                alt={article.title}
              />
              <ArticleContent>
                <ArticleTitle>
                  <Link to={`/article/${article.article_id}`}>
                    {article.title}
                  </Link>
                </ArticleTitle>
                <ArticleExcerpt>
                  {article.content ? article.content.substring(0, 150) + '...' : 'Nội dung đang được cập nhật...'}
                </ArticleExcerpt>
                <ArticleMeta>
                  <span>{article.author?.username || 'Admin'}</span>
                  <span>{new Date(article.published_date).toLocaleDateString('vi-VN')}</span>
                </ArticleMeta>
              </ArticleContent>
            </ArticleCard>
          ))}
        </ArticlesGrid>
      ) : (
        <NoArticles>
          Không có bài viết nào cho tag "{tagName}"
        </NoArticles>
      )}
    </TagContainer>
  );
}

export default TagPage; 