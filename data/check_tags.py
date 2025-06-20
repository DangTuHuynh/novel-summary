import json

# Đọc file JSON
with open(r"C:\My Data\workspace\Project-thầy hiếu\novel-reader\Frontend\data\novels.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Khởi tạo set để tránh trùng lặp
all_tags = set()

# Duyệt từng truyện
for novel in data:
    if "genres" in novel:
        all_tags.update(novel["genres"])  # Thêm vào set, tự động loại trùng

# Chuyển sang list nếu cần xử lý tiếp
tag_list = sorted(all_tags)

# In ra
for i in tag_list:
    if len(str(i))>1:
        print(i)

