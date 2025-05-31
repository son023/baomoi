import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { articlesAPI } from '../services/api';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const MainSection = styled.section`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedArticle = styled.article`
  flex: 2;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeaturedImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const FeaturedContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  padding: 30px;
`;

const FeaturedTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  line-height: 1.3;
  
  a {
    color: white;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const FeaturedMeta = styled.div`
  display: flex;
  gap: 15px;
  font-size: 14px;
  opacity: 0.9;
`;

const SidebarArticles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SidebarArticle = styled.article`
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SidebarImage = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
`;

const SidebarContent = styled.div`
  flex: 1;
`;

const SidebarTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
`;

const SidebarMeta = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 5px;
`;

const CategorySection = styled.section`
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 3px solid #667eea;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-transform: uppercase;
`;

const ViewMoreLink = styled(Link)`
  color: #667eea;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

const CategoryTag = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
`;

function HomePage() {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [sidebarArticles, setSidebarArticles] = useState([]);
  const [articlesByTag, setArticlesByTag] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    
    const loadData = async () => {
      try {
        // Use optimized homepage API with abort signal
        const homepageRes = await articlesAPI.getHomepage(abortController.signal);
        const data = homepageRes.data;

        // Check if request was aborted
        if (abortController.signal.aborted) return;

        // Set featured article
        if (data.featured_article) {
          setFeaturedArticle(data.featured_article);
        }

        // Set sidebar articles
        setSidebarArticles(data.sidebar_articles || []);

        // Set articles by tag
        setArticlesByTag(data.tag_articles || {});

      } catch (error) {
        // Don't log error if request was aborted
        if (!abortController.signal.aborted) {
          console.error('Error loading data:', error);
        }
      } finally {
        // Only set loading to false if request wasn't aborted
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function - abort request if component unmounts
    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) {
    return <LoadingContainer>Đang tải...</LoadingContainer>;
  }

  return (
    <HomeContainer>
      {/* Featured Article Section */}
      <FeaturedSection>
        {featuredArticle && (
          <FeaturedArticle>
            <FeaturedImageContainer>
              <FeaturedImage 
                src={featuredArticle.media?.file_path || 'https://via.placeholder.com/800x400/667eea/ffffff?text=BaoMoi.com'} 
                alt={featuredArticle.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400/667eea/ffffff?text=BaoMoi.com';
                }}
              />
            </FeaturedImageContainer>
            <FeaturedContent>
              <FeaturedTitle>
                <Link to={`/article/${featuredArticle.article_id}`}>
                  {featuredArticle.title}
                </Link>
              </FeaturedTitle>
              <FeaturedExcerpt>
                {featuredArticle.content ? featuredArticle.content.substring(0, 200) + '...' : 'Nội dung đang được cập nhật...'}
              </FeaturedExcerpt>
              <FeaturedMeta>
                <span>{featuredArticle.author?.username || 'Admin'}</span>
                <span>{new Date(featuredArticle.published_date).toLocaleDateString('vi-VN')}</span>
              </FeaturedMeta>
            </FeaturedContent>
          </FeaturedArticle>
        )}

        <Sidebar>
          <SidebarTitle>Bài viết mới nhất</SidebarTitle>
          {sidebarArticles.map(article => (
            <SidebarArticle key={article.article_id}>
              <SidebarImage 
                src={article.media?.file_path || 'https://via.placeholder.com/80x60/667eea/ffffff?text=TL'} 
                alt={article.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80x60/667eea/ffffff?text=TL';
                }}
              />
              <SidebarContent>
                <SidebarArticleTitle>
                  <Link to={`/article/${article.article_id}`}>
                    {article.title}
                  </Link>
                </SidebarArticleTitle>
                <SidebarMeta>
                  {new Date(article.published_date).toLocaleDateString('vi-VN')}
                </SidebarMeta>
              </SidebarContent>
            </SidebarArticle>
          ))}
        </Sidebar>
      </FeaturedSection>

      {/* Articles by Tags */}
      {Object.entries(articlesByTag).map(([tagName, articles]) => (
        articles.length > 0 && (
          <TagSection key={tagName}>
            <TagHeader>
              <TagTitle>{tagName}</TagTitle>
              <ViewMoreLink to={`/tag/${tagName}`}>Xem thêm</ViewMoreLink>
            </TagHeader>
            <ArticlesGrid>
              {articles.map(article => (
                <ArticleCard key={article.article_id}>
                  <ArticleImage 
                    src={article.media?.file_path || 'https://via.placeholder.com/400x200/667eea/ffffff?text=BaoMoi.com'} 
                    alt={article.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200/667eea/ffffff?text=BaoMoi.com';
                    }}
                  />
                  <ArticleContent>
                    <ArticleTitle>
                      <Link to={`/article/${article.article_id}`}>
                        {article.title}
                      </Link>
                    </ArticleTitle>
                    <ArticleExcerpt>
                      {article.content ? article.content.substring(0, 100) + '...' : 'Nội dung đang được cập nhật...'}
                    </ArticleExcerpt>
                    <ArticleMeta>
                      <span>{article.author?.username || 'Admin'}</span>
                      <span>{new Date(article.published_date).toLocaleDateString('vi-VN')}</span>
                    </ArticleMeta>
                  </ArticleContent>
                </ArticleCard>
              ))}
            </ArticlesGrid>
          </TagSection>
        )
      ))}
    </HomeContainer>
  );
}

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
`;

const FeaturedSection = styled.section`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FeaturedImageContainer = styled.div`
  flex: 2;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeaturedExcerpt = styled.p`
  color: white;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
`;

const Sidebar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SidebarArticleTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
  color: #333;
`;

const TagSection = styled.section`
  margin-bottom: 40px;
`;

const TagHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 3px solid #667eea;
`;

const TagTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-transform: uppercase;
`;

export default HomePage; 