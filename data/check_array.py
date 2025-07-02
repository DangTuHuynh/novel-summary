# check_array.py

import json
import ast
import re

def fix_stringified_lists(data):
    for key, value in data.items():
        if isinstance(value, str) and value.strip().startswith("[") and value.strip().endswith("]"):
            try:
                parsed = ast.literal_eval(value)
                if isinstance(parsed, list):
                    data[key] = parsed
            except (ValueError, SyntaxError):
                pass
    return data

def extract_json_array_from_js(js_content):
    try:
        # Thử parse đúng kiểu JSON trước
        return json.loads(js_content)
    except json.JSONDecodeError:
        # Nếu lỗi JSON (do dùng nháy đơn...), dùng ast để "cứu vãn"
        try:
            return ast.literal_eval(js_content)
        except Exception as e:
            print("Parse error:", e)
    return []


def main():
    source_file = "source.js"
    novels_file = "novels.json"

    # Đọc nội dung từ source.js
    with open(source_file, "r", encoding="utf-8") as f:
        js_content = f.read()

    new_novels = extract_json_array_from_js(js_content)

    # Sửa dữ liệu mới
    fixed_novels = [fix_stringified_lists(novel) for novel in new_novels]

    # Đọc novels.json hiện tại
    try:
        with open(novels_file, "r", encoding="utf-8") as f:
            existing_novels = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        existing_novels = []

    # Gộp dữ liệu
    updated_novels = existing_novels + fixed_novels

    # Ghi lại vào novels.json
    with open(novels_file, "w", encoding="utf-8") as f:
        json.dump(updated_novels, f, ensure_ascii=False, indent=2)

    print(f"✅ Đã thêm {len(fixed_novels)} truyện vào novels.json.")

if __name__ == "__main__":
    main()
