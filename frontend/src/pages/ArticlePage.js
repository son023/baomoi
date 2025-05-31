import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { articlesAPI } from '../services/api';
import CommentSection from '../components/CommentSection';

const ArticleContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ArticleHeader = styled.header`
  margin-bottom: 30px;
`;

const ArticleTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #333;
  line-height: 1.3;
  margin-bottom: 20px;
`;

const ArticleMeta = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
`;

const AuthorInfo = styled.div`
  font-size: 14px;
  color: #666;
`;

const PublishDate = styled.div`
  font-size: 14px;
  color: #999;
`;

const CategoryTags = styled.div`
  display: flex;
  gap: 10px;
`;

const CategoryTag = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 30px;
`;

const ArticleContent = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  
  p {
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 30px 0 15px 0;
    color: #333;
  }
  
  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 25px 0 12px 0;
    color: #333;
  }
  
  ul, ol {
    margin: 15px 0;
    padding-left: 30px;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  blockquote {
    border-left: 4px solid #667eea;
    padding-left: 20px;
    margin: 20px 0;
    font-style: italic;
    color: #666;
  }
`;

const RelatedArticles = styled.section`
  margin-top: 50px;
  padding-top: 30px;
  border-top: 2px solid #eee;
`;

const RelatedTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 25px;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const RelatedCard = styled.article`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const RelatedImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const RelatedContent = styled.div`
  padding: 15px;
`;

const RelatedCardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
  color: #333;
`;

const RelatedMeta = styled.div`
  font-size: 12px;
  color: #999;
`;

const NotFound = styled.div`
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

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      
      // Load the specific article
      const articleRes = await articlesAPI.getById(id);
      const articleData = articleRes.data;
      setArticle(articleData);

      // Load related articles from same category
      if (articleData.categories && articleData.categories.length > 0) {
        const categoryId = articleData.categories[0].category_id;
        try {
          const relatedRes = await articlesAPI.getByCategory(categoryId);
          const relatedArticles = relatedRes.data
            .filter(a => a.article_id !== parseInt(id))
            .slice(0, 3);
          setRelatedArticles(relatedArticles);
        } catch (error) {
          console.error('Error loading related articles:', error);
          // Fallback: load from homepage API
          const homepageRes = await articlesAPI.getHomepage();
          const fallbackArticles = homepageRes.data.sidebar_articles
            .filter(a => a.article_id !== parseInt(id))
            .slice(0, 3);
          setRelatedArticles(fallbackArticles);
        }
      } else {
        // No categories, use homepage sidebar articles
        const homepageRes = await articlesAPI.getHomepage();
        const fallbackArticles = homepageRes.data.sidebar_articles
          .filter(a => a.article_id !== parseInt(id))
          .slice(0, 3);
        setRelatedArticles(fallbackArticles);
      }
      
    } catch (error) {
      console.error('Error loading article:', error);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ArticleContainer>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          Đang tải...
        </div>
      </ArticleContainer>
    );
  }

  if (!article) {
    return (
      <ArticleContainer>
        <BackLink to="/">← Về trang chủ</BackLink>
        <NotFound>
          Không tìm thấy bài viết này.
        </NotFound>
      </ArticleContainer>
    );
  }

  return (
    <ArticleContainer>
      <BackLink to="/">← Về trang chủ</BackLink>
      
      <ArticleHeader>
        <ArticleTitle>{article.title}</ArticleTitle>
        
        <ArticleMeta>
          <AuthorInfo>
            Tác giả: {article.author?.username || 'Admin'}
          </AuthorInfo>
          <PublishDate>
            {new Date(article.published_date).toLocaleDateString('vi-VN')}
          </PublishDate>
          <CategoryTags>
            {article.categories && article.categories.map(category => (
              <CategoryTag key={category.category_id}>
                {category.name}
              </CategoryTag>
            ))}
          </CategoryTags>
        </ArticleMeta>
      </ArticleHeader>

      {article.media && (
        <ArticleImage 
          src={article.media.file_path} 
          alt={article.title}
        />
      )}

      <ArticleContent>
        {article.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </ArticleContent>

      <CommentSection articleId={id} />

      {relatedArticles.length > 0 && (
        <RelatedArticles>
          <RelatedTitle>Bài viết liên quan</RelatedTitle>
          <RelatedGrid>
            {relatedArticles.map(relatedArticle => (
              <RelatedCard key={relatedArticle.article_id}>
                <Link to={`/article/${relatedArticle.article_id}`}>
                  <RelatedImage 
                    src={relatedArticle.media?.file_path || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'} 
                    alt={relatedArticle.title}
                  />
                  <RelatedContent>
                    <RelatedCardTitle>{relatedArticle.title}</RelatedCardTitle>
                    <RelatedMeta>
                      {new Date(relatedArticle.published_date).toLocaleDateString('vi-VN')}
                    </RelatedMeta>
                  </RelatedContent>
                </Link>
              </RelatedCard>
            ))}
          </RelatedGrid>
        </RelatedArticles>
      )}
    </ArticleContainer>
  );
}

export default ArticlePage; 