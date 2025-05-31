# Seed data for PsyMag application
puts "🚀 Starting seed data creation..."

# Clear existing data in correct order to avoid foreign key constraints
puts "🗑️  Clearing existing data..."

# Disable foreign key constraints temporarily
ActiveRecord::Base.connection.execute("PRAGMA foreign_keys = OFF")

Comment.delete_all
ActiveRecord::Base.connection.execute("DELETE FROM articles_tags")
ArticleCategory.delete_all
Article.delete_all
Medium.delete_all
Author.delete_all
User.delete_all
Category.delete_all
Tag.delete_all

# Re-enable foreign key constraints
ActiveRecord::Base.connection.execute("PRAGMA foreign_keys = ON")

puts "👤 Creating users..."
# Create admin user
admin = User.create!(
  username: 'admin',
  email: 'admin@tamly.com',
  password: 'password123',
  full_name: 'Administrator',
  role: 1  # admin enum value
)

# Create regular users
users = []
5.times do |i|
  users << User.create!(
    username: "user#{i+1}",
    email: "user#{i+1}@tamly.com",
    password: 'password123',
    full_name: "User #{i+1}",
    role: 0  # user enum value
  )
end

puts "✍️  Creating authors..."
# Create author record for admin
author = Author.create!(
  username: admin.username,
  bio: 'Chuyên gia tâm lý với nhiều năm kinh nghiệm',
  profile_picture: 'admin_avatar.jpg'
)

puts "📂 Creating categories..."
categories = [
  { category_id: 73, name: 'Trầm cảm', description: 'Bài viết về trầm cảm' },
  { category_id: 74, name: 'Stress', description: 'Bài viết về stress' },
  { category_id: 75, name: 'Rối loạn lo âu', description: 'Bài viết về rối loạn lo âu' },
  { category_id: 76, name: 'Tin tức - Sự kiện', description: 'Tin tức và sự kiện tâm lý' },
  { category_id: 77, name: 'Tâm lý với cuộc sống', description: 'Ứng dụng tâm lý trong cuộc sống' }
].map { |cat_data| Category.create!(cat_data) }

puts "🏷️  Creating tags..."
tags_data = [
  { tag_id: 1, name: 'trầm cảm', slug: 'tram-cam' },
  { tag_id: 2, name: 'stress', slug: 'stress' },
  { tag_id: 3, name: 'lo âu', slug: 'lo-au' },
  { tag_id: 4, name: 'điều trị', slug: 'dieu-tri' },
  { tag_id: 5, name: 'tâm lý', slug: 'tam-ly' },
  { tag_id: 6, name: 'sức khỏe', slug: 'suc-khoe' },
  { tag_id: 7, name: 'gia đình', slug: 'gia-dinh' },
  { tag_id: 8, name: 'công việc', slug: 'cong-viec' },
  { tag_id: 9, name: 'học tập', slug: 'hoc-tap' },
  { tag_id: 10, name: 'thiền', slug: 'thien' }
]
tags = tags_data.map { |tag_data| Tag.create!(tag_data) }

puts "📝 Creating articles with media..."
# Optimized articles data structure
articles_data = [
  # Trầm cảm articles
  {
    title: 'Trầm cảm có di truyền không? Vai trò của Gen',
    content: 'Trầm cảm có di truyền không? là câu hỏi khiến không ít người trăn trở khi có người thân mắc bệnh này. Nghiên cứu khoa học cho thấy yếu tố di truyền đóng vai trò quan trọng trong việc phát triển bệnh trầm cảm, chiếm khoảng 40-50% nguy cơ mắc bệnh. Tuy nhiên, gen chỉ là một trong nhiều yếu tố góp phần vào việc phát triển bệnh này. Môi trường sống, stress, chấn thương tâm lý, và các yếu tố xã hội khác cũng có ảnh hưởng lớn đến việc kích hoạt các gen liên quan đến trầm cảm. Điều này có nghĩa là ngay cả khi có yếu tố di truyền, việc chăm sóc sức khỏe tinh thần đúng cách vẫn có thể ngăn ngừa hoặc giảm thiểu nguy cơ mắc bệnh. Các nghiên cứu về gen SERT, BDNF và các gen khác đã mở ra hướng điều trị cá nhân hóa cho từng bệnh nhân.',
    categories: [0], tags: [1, 5],
    media_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800'
  },
  {
    title: '10 hậu quả của trầm cảm với bản thân, gia đình và xã hội',
    content: 'Trầm cảm là bệnh lý đến một cách âm thầm, nhưng hậu quả lại phá hủy mạnh mẽ và toàn diện. Đối với bản thân người bệnh, trầm cảm gây ra những thay đổi nghiêm trọng về nhận thức, cảm xúc và hành vi. Người bệnh thường cảm thấy tuyệt vọng, mất hứng thú với mọi hoạt động, khó tập trung và có thể có ý nghĩ tự tử. Về mặt thể chất, trầm cảm có thể gây ra mất ngủ, mệt mỏi, đau đầu và các vấn đề tiêu hóa. Đối với gia đình, trầm cảm tạo ra căng thẳng trong các mối quan hệ, ảnh hưởng đến việc chăm sóc con cái và gây ra gánh nặng kinh tế do chi phí điều trị. Trên phạm vi xã hội, trầm cảm làm giảm năng suất lao động, tăng chi phí y tế công cộng và có thể dẫn đến các vấn đề xã hội khác như tệ nạn xã hội. Việc hiểu rõ những hậu quả này giúp chúng ta có cái nhìn đúng đắn về tầm quan trọng của việc phát hiện sớm và điều trị kịp thời.',
    categories: [0], tags: [1, 7],
    media_url: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800'
  },
  {
    title: 'Trầm cảm ở trẻ em: Dấu hiệu nhận biết và cách điều trị',
    content: 'Trầm cảm ở trẻ em ngày càng phổ biến nhưng thường bị bỏ qua hoặc nhầm lẫn với những thay đổi tâm lý bình thường của tuổi lên. Khác với người lớn, trẻ em thường biểu hiện trầm cảm qua sự thay đổi hành vi như cáu kỉnh, hung hăng, từ chối đi học, hoặc suy giảm thành tích học tập đột ngột. Các dấu hiệu cần chú ý bao gồm: thay đổi thói quen ăn uống và ngủ nghỉ, mất hứng thú với các hoạt động yêu thích, cảm giác buồn bã kéo dài, lo lắng quá mức, và khó khăn trong việc tập trung. Cha mẹ cần biết cách nhận biết các dấu hiệu sớm để có biện pháp can thiệp kịp thời. Điều trị trầm cảm ở trẻ em thường kết hợp giữa liệu pháp tâm lý, hỗ trợ gia đình và trong một số trường hợp nghiêm trọng có thể cần đến thuốc. Việc tạo ra môi trường gia đình ấm áp, lắng nghe và hiểu con là yếu tố quan trọng nhất trong quá trình hồi phục.',
    categories: [0], tags: [1, 6],
    media_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800'
  },
  {
    title: 'Cách vượt qua trầm cảm sau sinh hiệu quả',
    content: 'Trầm cảm sau sinh ảnh hưởng đến 10-15% phụ nữ sau khi sinh con, đây là tình trạng nghiêm trọng hơn nhiều so với "baby blues" thông thường. Các triệu chứng bao gồm cảm giác buồn bã sâu sắc, lo lắng quá mức về sức khỏe của em bé, mất kết nối với con, cảm giác tội lỗi và không xứng đáng làm mẹ. Nguyên nhân của trầm cảm sau sinh rất phức tạp, bao gồm thay đổi hormone, stress do vai trò mới, thiếu ngủ, và các yếu tố tâm lý xã hội khác. Để vượt qua tình trạng này, người mẹ cần được hỗ trợ toàn diện từ gia đình, bạn bè và chuyên gia y tế. Các phương pháp điều trị hiệu quả bao gồm liệu pháp tâm lý nhận thức hành vi, liệu pháp nhóm với các mẹ khác có cùng tình trạng, và trong một số trường hợp cần thiết có thể sử dụng thuốc chống trầm cảm an toàn cho phụ nữ cho con bú. Việc duy trì lối sống lành mạnh, tập thể dục nhẹ nhàng và có thời gian nghỉ ngơi đầy đủ cũng rất quan trọng.',
    categories: [0], tags: [1, 4],
    media_url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800'
  },
  
  # Stress articles
  {
    title: 'Stress công việc: Nguyên nhân và cách giải quyết hiệu quả',
    content: 'Stress công việc đang trở thành vấn đề phổ biến trong xã hội hiện đại. Áp lực từ công việc có thể gây ra nhiều vấn đề sức khỏe nghiêm trọng. Bài viết này sẽ giúp bạn hiểu rõ nguyên nhân và tìm ra những cách giải quyết hiệu quả để cân bằng cuộc sống.',
    categories: [1], tags: [2, 8],
    media_url: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800'
  },
  {
    title: '10 kỹ thuật quản lý stress đơn giản mà hiệu quả',
    content: 'Học cách quản lý stress sẽ giúp bạn có cuộc sống cân bằng và hạnh phúc hơn. Bài viết giới thiệu 10 kỹ thuật đơn giản mà bất kỳ ai cũng có thể áp dụng ngay trong cuộc sống hàng ngày để giảm thiểu tác động của stress.',
    categories: [1], tags: [2, 5],
    media_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
  },
  {
    title: 'Stress học tập ở học sinh: Dấu hiệu và cách hỗ trợ',
    content: 'Áp lực học tập có thể gây ra stress nghiêm trọng ở trẻ em và thanh thiếu niên. Cha mẹ và giáo viên cần biết cách nhận biết và hỗ trợ học sinh vượt qua những khó khăn này để phát triển toàn diện.',
    categories: [1], tags: [2, 9],
    media_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800'
  },
  {
    title: 'Tác động của stress lên sức khỏe thể chất và tinh thần',
    content: 'Stress không chỉ ảnh hưởng đến tâm lý mà còn gây ra nhiều vấn đề sức khỏe thể chất. Hiểu rõ những tác động này giúp chúng ta có động lực để quản lý stress tốt hơn và bảo vệ sức khỏe tổng thể.',
    categories: [1], tags: [2, 6],
    media_url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800'
  },
  
  # Lo âu articles
  {
    title: 'Rối loạn lo âu tổng quát: Triệu chứng và điều trị',
    content: 'Rối loạn lo âu tổng quát là một trong những vấn đề tâm lý phổ biến nhất hiện nay. Việc nhận biết sớm các triệu chứng sẽ giúp điều trị hiệu quả. Bài viết cung cấp thông tin chi tiết về triệu chứng và các phương pháp điều trị hiện đại.',
    categories: [2], tags: [3, 4],
    media_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800'
  },
  {
    title: 'Kỹ thuật thở để giảm lo âu và căng thẳng',
    content: 'Thở đúng cách có thể giúp giảm lo âu và mang lại cảm giác bình tĩnh. Đây là một kỹ thuật đơn giản nhưng rất hiệu quả mà bất kỳ ai cũng có thể thực hiện. Hãy cùng tìm hiểu các kỹ thuật thở cơ bản để cải thiện sức khỏe tinh thần.',
    categories: [2], tags: [3, 10],
    media_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800'
  },
  {
    title: 'Lo âu xã hội: Hiểu và vượt qua nỗi sợ giao tiếp',
    content: 'Lo âu xã hội khiến nhiều người cảm thấy khó khăn trong việc giao tiếp và tương tác với người khác. Bài viết chia sẻ những hiểu biết về tình trạng này và các phương pháp để vượt qua nỗi sợ, tự tin hơn trong giao tiếp.',
    categories: [2], tags: [3, 5],
    media_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800'
  },
  {
    title: 'Cơn hoảng sợ: Nguyên nhân và cách xử lý khẩn cấp',
    content: 'Cơn hoảng sợ có thể xuất hiện bất ngờ và gây ra cảm giác sợ hãi cực độ. Hiểu rõ nguyên nhân và biết cách xử lý sẽ giúp bạn hoặc người thân vượt qua những khoảnh khắc khó khăn này một cách hiệu quả.',
    categories: [2], tags: [3, 6],
    media_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
  },
  
  # Tin tức - Sự kiện
  {
    title: 'Hội thảo quốc tế về sức khỏe tâm thần 2024',
    content: 'Hội thảo quốc tế về sức khỏe tâm thần năm 2024 sẽ diễn ra tại Hà Nội với sự tham gia của nhiều chuyên gia hàng đầu. Đây là cơ hội tuyệt vời để cập nhật những kiến thức mới nhất trong lĩnh vực tâm lý học.',
    categories: [3], tags: [5, 6],
    media_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
  },
  {
    title: 'Nghiên cứu mới về tác động của mạng xã hội đến tâm lý',
    content: 'Một nghiên cứu mới cho thấy mạng xã hội có thể ảnh hưởng đáng kể đến sức khỏe tâm thần của người dùng. Bài viết phân tích những phát hiện quan trọng và đưa ra khuyến nghị cho việc sử dụng mạng xã hội một cách lành mạnh.',
    categories: [3], tags: [5, 7],
    media_url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800'
  },
  
  # Tâm lý với cuộc sống
  {
    title: 'Cách xây dựng mối quan hệ gia đình hạnh phúc',
    content: 'Gia đình là nơi quan trọng nhất trong cuộc sống của mỗi người. Bài viết chia sẻ những nguyên tắc và kỹ năng cần thiết để xây dựng một gia đình hạnh phúc, gắn kết và yêu thương.',
    categories: [4], tags: [7, 5],
    media_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800'
  },
  {
    title: 'Thiền định trong cuộc sống hiện đại: Lợi ích và cách thực hành',
    content: 'Thiền định không chỉ là một thực hành tâm linh mà còn là công cụ hiệu quả để cải thiện sức khỏe tinh thần. Bài viết hướng dẫn cách tích hợp thiền định vào cuộc sống bận rộn của thời đại hiện đại.',
    categories: [4], tags: [10, 5],
    media_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800'
  }
]

# Create articles with associated media, categories, and tags
articles_data.each_with_index do |article_data, index|
  # Create media
  media = Medium.create!(
    file_name: "#{article_data[:title].downcase.gsub(/[^a-z0-9\s]/, '').gsub(/\s+/, '_')}.jpg",
    file_path: article_data[:media_url],
    file_type: 'image',
    uploaded_date: Time.current
  )
  
  # Create article
  article = Article.create!(
    title: article_data[:title],
    content: article_data[:content],
    slug: article_data[:title].downcase.gsub(/[^a-z0-9\s]/, '').gsub(/\s+/, '-'),
    author_id: author.author_id,
    media_id: media.media_id,
    published_date: Time.current - index.days,
    status: 'published'
  )
  
  # Add categories
  article_data[:categories].each do |cat_index|
    ArticleCategory.create!(
      article_id: article.article_id,
      category_id: categories[cat_index].category_id
    )
  end
  
  # Add tags
  article_data[:tags].each do |tag_id|
    tag = tags.find { |t| t.tag_id == tag_id }
    article.tags << tag
  end
end

puts "✅ Seed data created successfully!"
puts "👤 Admin user: admin@tamly.com / password123"
puts "📊 Created: #{User.count} users, #{Author.count} authors, #{Category.count} categories, #{Tag.count} tags, #{Article.count} articles, #{Medium.count} media files"

# Display statistics
puts "\n📈 Articles per tag:"
Tag.all.each do |tag|
  puts "   - #{tag.name}: #{tag.articles.count} articles"
end
