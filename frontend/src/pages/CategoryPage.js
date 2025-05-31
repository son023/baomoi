import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { articlesAPI, categoriesAPI } from '../services/api';

const CategoryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CategoryHeader = styled.div`
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 3px solid #667eea;
`;

const CategoryTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #333;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const CategoryDescription = styled.p`
  color: #666;
  font-size: 16px;
  line-height: 1.6;
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
    transform: translateY(-5px);
  }
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
`;

const ArticleContent = styled.div`
  padding: 20px;
`;

const ArticleTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.4;
  color: #333;
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
  font-size: 13px;
  color: #999;
`;

const CategoryTag = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
`;

const NoArticles = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
`;

function CategoryPage() {
  const { categoryName } = useParams();
  const [articles, setArticles] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryData();
  }, [categoryName]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      
      // Load all categories first to get the correct category_id
      const categoriesRes = await categoriesAPI.getAll();
      const categories = categoriesRes.data;
      
      // Map category slug to category name for lookup
      const categoryNameMapping = {
        'tram-cam': 'Trầm cảm',
        'stress': 'Stress', 
        'roi-loan-lo-au': 'Rối loạn lo âu',
        'tin-tuc-su-kien': 'Tin tức - Sự kiện',
        'tam-ly-cuoc-song': 'Tâm lý với cuộc sống',
        'van-de-tam-ly': 'Vấn đề tâm lý'
      };
      
      const targetCategoryName = categoryNameMapping[categoryName];
      const category = categories.find(cat => cat.name === targetCategoryName);
      
      if (category) {
        setCategoryInfo(category);
        const articlesRes = await articlesAPI.getByCategory(category.category_id);
        setArticles(articlesRes.data);
      } else if (categoryName === 'van-de-tam-ly') {
        setCategoryInfo({ name: 'Vấn đề tâm lý', description: 'Khám phá các bài viết về tâm lý và sức khỏe tinh thần.' });
        
        // Get articles from Trầm cảm (73), Stress (74), and Rối loạn lo âu (75)
        const subCategories = [73, 74, 75];
        const allArticles = [];
        
        for (const catId of subCategories) {
          try {
            const articlesRes = await articlesAPI.getByCategory(catId);
            allArticles.push(...articlesRes.data);
          } catch (error) {
            console.error(`Error loading articles for category ${catId}:`, error);
          }
        }
        
        // Sort by published_date desc
        allArticles.sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
        setArticles(allArticles);
      } else {
        const articlesRes = await articlesAPI.getAll();
        setArticles(articlesRes.data);
      }
      
    } catch (error) {
      console.error('Error loading category data:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDisplayName = () => {
    switch(categoryName) {
      case 'tram-cam':
        return 'Trầm cảm';
      case 'stress':
        return 'Stress';
      case 'roi-loan-lo-au':
        return 'Rối loạn lo âu';
      case 'tin-tuc-su-kien':
        return 'Tin tức - Sự kiện';
      case 'tam-ly-cuoc-song':
        return 'Tâm lý với cuộc sống';
      case 'van-de-tam-ly':
        return 'Vấn đề tâm lý';
      default:
        return categoryName;
    }
  };

  const getCategoryDescription = () => {
    switch(categoryName) {
      case 'tram-cam':
        return 'Tìm hiểu về bệnh trầm cảm, nguyên nhân, triệu chứng và các phương pháp điều trị hiệu quả.';
      case 'stress':
        return 'Cách nhận biết và quản lý stress trong cuộc sống hàng ngày để có một tinh thần khỏe mạnh.';
      case 'roi-loan-lo-au':
        return 'Thông tin về các rối loạn lo âu, cách nhận biết và phương pháp điều trị phù hợp.';
      case 'tin-tuc-su-kien':
        return 'Cập nhật những tin tức mới nhất về tâm lý học và sức khỏe tinh thần.';
      case 'tam-ly-cuoc-song':
        return 'Ứng dụng tâm lý học vào cuộc sống để có một cuộc sống hạnh phúc và ý nghĩa hơn.';
      default:
        return 'Khám phá các bài viết về tâm lý và sức khỏe tinh thần.';
    }
  };

  return (
    <CategoryContainer>
      <CategoryHeader>
        <CategoryTitle>{getCategoryDisplayName()}</CategoryTitle>
        <CategoryDescription>{getCategoryDescription()}</CategoryDescription>
      </CategoryHeader>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          Đang tải...
        </div>
      ) : articles.length > 0 ? (
        <ArticlesGrid>
          {articles.map(article => (
            <ArticleCard key={article.article_id}>
              <Link to={`/article/${article.article_id}`}>
                <ArticleImage 
                  src={article.media?.file_path || 'https://via.placeholder.com/400x220/667eea/ffffff?text=BaoMoi.com'}
                  alt={article.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x220/667eea/ffffff?text=BaoMoi.com';
                  }}
                />
              </Link>
              <ArticleContent>
                <Link to={`/article/${article.article_id}`}>
                  <ArticleTitle>{article.title}</ArticleTitle>
                </Link>
                <ArticleExcerpt>
                  {article.content && article.content.length > 150 
                    ? article.content.substring(0, 150) + '...' 
                    : article.content}
                </ArticleExcerpt>
                <ArticleMeta>
                  <span>{article.author?.username || 'Admin'} • {new Date(article.published_date).toLocaleDateString('vi-VN')}</span>
                  <CategoryTag>{article.categories?.[0]?.name || 'Chưa phân loại'}</CategoryTag>
                </ArticleMeta>
              </ArticleContent>
            </ArticleCard>
          ))}
        </ArticlesGrid>
      ) : (
        <NoArticles>
          Không có bài viết nào trong danh mục này.
        </NoArticles>
      )}
    </CategoryContainer>
  );
}

export default CategoryPage; 