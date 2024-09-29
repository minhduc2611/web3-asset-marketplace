## Keys to win

- Valuable **content**
- Great app **UX**, learning **experience**
- Practicing well prepared **drills and excercises**

## Roadmap

- [x] Authentication
- [x] Flashcard - Space repitition algorithm applied
- [x] Flashcard - Shaditable (share and edit) Packs and Cards
- [ ] Flashcard - Realtime collaboration
- [ ] UX upgrade
- [ ] Repo structure upgrade
- [ ] Brain Log - AI intergration
- [ ] MK Learn - Create Video Lessons
- [ ] MK Learn - Create Video Lessons versioning
- [ ] MK Learn - Create Curriculum
- [ ] Stripe one off payment integration
- [ ] Stripe subcription payment integration
- [ ] [Web3 wallet based authentication](https://supabase.com/partners/integrations/picket)
- [ ] Crypto payment integration
- [ ] Rust editor - creat Rust analyser
- [ ] Rust editor - code
- [ ] Rust editor - register test cases
- [ ] Create customer chat bot, create chatbot knowledge.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Viết Git commit message
- CẤU TRÚC CHUNG CỦA 1 COMMIT MESSAGE: [type]: [description] [body]

### Trong đó:
type và description là phần BẮT BUỘC
body là phần TÙY CHỌN, có thể có hoặc không
Ví dụ:
feat: add email notifications on new messages
refers to JIRA-1234
##### [type]
- feat: Một tính năng mới (feature)
- fix: Sửa lỗi (fix bug)
- docs: Cập nhật tài liệu (sửa documents)
- style: Thêm khoảng trắng, format code, thiếu dấu chấm phảy, ...
- refactor: Đổi tên hàm, tên biến dễ hiểu hơn, tách hàm con, xóa code thừa, ...
- perf: Cải tiến hiệu năng
- test: Thêm test case còn thiếu, sửa unit test, ...
- build: Những thay đổi ảnh hưởng đến quá trình build
- ci: Thay đổi file cấu hình hoặc script CI
##### [description]
- Mô tả ngắn gọn về nội dung commit
- Không dài quá 50 ký tự để có thể dễ dàng đọc trên GitHub, cũng như các git tool khác
- Sử dụng câu mệnh lệnh, ở thì hiện tại. Ví dụ: “change ...“ thay vì “changed ...“
- Không viết hoa chữ cái đầu tiên
- Không sử dụng dấu chấm ở cuối câu
##### [body]
- Là phần TÙY CHỌN, sử dụng để mô tả chi tiết hơn về commit nếu cần
- Cách phần <type>: <description> ở bên trên bởi 1 dòng trắng (blank line)
- Nên dùng để giải thích câu hỏi What (để làm gì), hoặc Why (tại sao cần), chứ KHÔNG PHẢI How (làm như thế nào)
