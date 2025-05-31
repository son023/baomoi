import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { articlesAPI } from '../services/api';

const SearchContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const SearchHeader = styled.div`
  margin-bottom: 30px;
`;

const SearchTitle = styled.h1`
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
`;

const SearchInfo = styled.p`
  color: #666;
  font-size: 16px;
`;

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ArticleCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  }
`;

const ArticleTitle = styled.h2`
  color: #333;
  margin-bottom: 10px;
  font-size: 20px;
  
  a {
    color: inherit;
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

const ArticleCategories = styled.div`
  display: flex;
  gap: 5px;
`;

const CategoryTag = styled.span`
  background: #667eea;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #e74c3c;
  font-size: 16px;
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

function SearchPage() {
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query.trim()) {
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await articlesAPI.search(searchQuery);
      setArticles(response.data);
    } catch (err) {
      setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (!query.trim()) {
    return (
      <SearchContainer>
        <SearchHeader>
          <SearchTitle>Tìm kiếm</SearchTitle>
          <SearchInfo>Vui lòng nhập từ khóa để tìm kiếm bài viết.</SearchInfo>
        </SearchHeader>
      </SearchContainer>
    );
  }

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchTitle>Kết quả tìm kiếm</SearchTitle>
        <SearchInfo>
          {loading ? 'Đang tìm kiếm...' : 
           error ? 'Có lỗi xảy ra' :
           `Tìm thấy ${articles.length} kết quả cho "${query}"`}
        </SearchInfo>
      </SearchHeader>

      {loading && (
        <LoadingMessage>Đang tìm kiếm...</LoadingMessage>
      )}

      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}

      {!loading && !error && articles.length === 0 && (
        <NoResultsMessage>
          Không tìm thấy kết quả nào cho "{query}". 
          Vui lòng thử với từ khóa khác.
        </NoResultsMessage>
      )}

      {!loading && !error && articles.length > 0 && (
        <SearchResults>
          {articles.map((article) => (
            <ArticleCard key={article.article_id}>
              <ArticleTitle>
                <Link to={`/article/${article.article_id}`}>
                  {article.title}
                </Link>
              </ArticleTitle>
              
              <ArticleExcerpt>
                {article.content}
              </ArticleExcerpt>
              
              <ArticleMeta>
                <ArticleCategories>
                  {article.categories?.map((category) => (
                    <CategoryTag key={category.category_id}>
                      {category.name}
                    </CategoryTag>
                  ))}
                </ArticleCategories>
                
                <div>
                  {article.author?.username && (
                    <span>Bởi {article.author.username} • </span>
                  )}
                  <span>{formatDate(article.published_date)}</span>
                </div>
              </ArticleMeta>
            </ArticleCard>
          ))}
        </SearchResults>
      )}
    </SearchContainer>
  );
}

export default SearchPage; 