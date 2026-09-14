import { readFile } from "node:fs/promises";

const config = JSON.parse(
  await readFile(new URL("../firebase-applet-config.json", import.meta.url), "utf8")
);

const createdAt = "14/09/2026 09:15";
const common = {
  authorId: "daisu-so-editorial",
  authorName: "Ban biên tập Đại sứ số",
  authorRole: "Đại sứ số học đường",
  authorAvatar:
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=150&auto=format&fit=crop&q=80",
  createdAt,
  views: 0,
  likes: 0,
  isLikedByUser: false,
  status: "published",
  isFeatured: false,
  comments: [],
};

const posts = [
  {
    ...common,
    id: "auto_20260914_kiem-chung-thong-tin",
    title: "Bộ lọc 3 câu hỏi: Kiểm chứng thông tin trước khi chia sẻ",
    slug: "bo-loc-3-cau-hoi-kiem-chung-thong-tin",
    summary:
      "Một thói quen chỉ mất vài phút giúp học sinh nhận ra thông tin thiếu căn cứ, tránh chia sẻ vội và xây dựng văn hóa số có trách nhiệm.",
    category: "digital_citizenship",
    categoryName: "Văn hóa ứng xử trên mạng",
    thumbnail:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80",
    tags: ["Kiểm chứng thông tin", "Văn hóa số", "Tư duy phản biện"],
    content: `Mỗi ngày, một tin nhắn trong nhóm lớp, một video ngắn hoặc một ảnh chụp màn hình có thể khiến chúng ta muốn bấm “chia sẻ” thật nhanh. Nhưng tốc độ không quan trọng bằng độ tin cậy. Một thông tin chưa được kiểm chứng có thể làm bạn bè lo lắng, hiểu sai một sự việc hoặc vô tình tiếp tay cho lừa đảo.

## Hãy dùng bộ lọc 3 câu hỏi

Trước khi tin, bình luận hoặc gửi lại một thông tin, em hãy dừng vài phút và tự hỏi:

1. **Ai là nguồn của thông tin này?**
   Bài viết có ghi rõ tác giả, cơ quan, tổ chức hoặc đường dẫn gốc không? Một tài khoản có tên giống trường học, cơ quan báo chí hay người quen chưa chắc là tài khoản thật. Hãy xem trang đó có lịch sử đăng bài rõ ràng hay chỉ mới lập và đăng các tin giật gân.

2. **Bằng chứng nằm ở đâu?**
   Tiêu đề gây sốc không phải bằng chứng. Em hãy tìm dữ kiện cụ thể: thời gian, địa điểm, văn bản gốc, ảnh hoặc video đầy đủ bối cảnh. Hình ảnh cũng có thể là ảnh cũ hoặc được cắt ghép. Nếu bài viết chỉ dùng các câu như “nghe nói”, “ai cũng biết” hay “chia sẻ gấp”, hãy coi đó là dấu hiệu cần thận trọng.

3. **Có nguồn độc lập nào xác nhận không?**
   Hãy tìm thông tin trên trang chính thức của đơn vị liên quan hoặc ít nhất hai nguồn uy tín, độc lập với nhau. Với thông báo của trường, em nên ưu tiên kênh do nhà trường công bố và hỏi giáo viên chủ nhiệm khi còn băn khoăn.

## Một tình huống thường gặp

Trong nhóm lớp xuất hiện tin nhắn: “Ngày mai nghỉ học khẩn, gửi cho tất cả mọi người.” Thay vì chuyển tiếp ngay, em có thể làm theo bốn bước:

- Không bấm vào đường link lạ và không chuyển tiếp.
- Kiểm tra thông báo trên các kênh chính thức của trường.
- Hỏi giáo viên chủ nhiệm hoặc người phụ trách lớp.
- Nếu tin sai, trả lời lịch sự: “Mình chưa thấy thông báo chính thức, mọi người chờ xác nhận nhé.”

Câu trả lời bình tĩnh ấy không làm ai mất mặt, đồng thời giúp cả nhóm tránh lan truyền tin chưa chắc chắn.

## Dùng AI như công cụ hỗ trợ, không phải “máy kết luận”

AI có thể giúp tóm tắt một bài viết, gợi ý câu hỏi để kiểm tra hoặc giải thích vì sao một lập luận còn thiếu căn cứ. Tuy nhiên, AI cũng có thể trả lời sai hoặc nêu nguồn không tồn tại. Vì vậy, nếu dùng AI để hỗ trợ kiểm chứng, hãy yêu cầu AI chỉ ra phần nào cần xác minh, rồi tự đối chiếu với nguồn chính thức.

## Thử thách nhỏ hôm nay

Chọn một tin em thấy trên mạng. Viết ra: nguồn ban đầu là gì, bằng chứng nào bài viết đưa ra, và em đã tìm được xác nhận độc lập chưa. Nếu chưa đủ ba phần, chưa nên chia sẻ.

Trở thành công dân số có trách nhiệm không có nghĩa là phải biết mọi thứ. Đó là biết dừng lại, đặt câu hỏi và chọn cách chia sẻ tử tế.`,
  },
  {
    ...common,
    id: "auto_20260914_ai-hoc-tap-15-phut",
    title: "Hoạt động 15 phút với AI: Học sinh đặt câu hỏi, không sao chép đáp án",
    slug: "hoat-dong-15-phut-voi-ai-hoc-sinh-dat-cau-hoi",
    summary:
      "Gợi ý hoạt động ngắn cho giáo viên và học sinh: dùng AI để luyện đặt câu hỏi, đối chiếu thông tin và tự sửa bài thay vì làm bài hộ.",
    category: "tech_ai",
    categoryName: "Công nghệ & AI",
    thumbnail:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
    tags: ["AI có trách nhiệm", "Dạy học", "Kỹ năng đặt câu hỏi"],
    content: `AI có thể trả lời rất nhanh, nhưng mục tiêu của việc học không phải là có đáp án nhanh nhất. Điều quan trọng là học sinh biết đặt câu hỏi, đánh giá câu trả lời và diễn đạt lại bằng hiểu biết của mình. Hoạt động 15 phút dưới đây giúp lớp học làm quen với AI theo hướng chủ động và an toàn.

## Chuẩn bị trước giờ học

Giáo viên chọn một câu hỏi bám sát bài đang học, chẳng hạn: “Vì sao cần tiết kiệm nước trong gia đình?” hoặc “Hãy giải thích một hiện tượng khoa học bằng ngôn ngữ phù hợp với học sinh lớp 7.” Chuẩn bị một công cụ AI được phép dùng trong lớp; không yêu cầu học sinh đăng nhập tài khoản cá nhân và không đưa vào công cụ tên đầy đủ, ảnh, số điện thoại hay thông tin riêng tư.

## Bước 1 — Viết câu hỏi có ngữ cảnh (4 phút)

Chia lớp thành các nhóm nhỏ. Mỗi nhóm viết một câu hỏi có ba thành phần:

- **Vai trò:** “Bạn là trợ giảng môn Khoa học tự nhiên…”
- **Nhiệm vụ:** “Hãy giải thích vì sao cần tiết kiệm nước…”
- **Yêu cầu đầu ra:** “Dùng 5 câu ngắn, nêu một ví dụ gần gũi và không bịa số liệu.”

Giáo viên nhắc học sinh: câu hỏi càng rõ, câu trả lời càng dễ kiểm tra. Đây là kỹ năng giao tiếp với AI, đồng thời cũng là kỹ năng trình bày yêu cầu trong học tập và cuộc sống.

## Bước 2 — Đọc với thái độ phản biện (5 phút)

Mỗi nhóm xem câu trả lời AI và đánh dấu bằng ba ký hiệu: dấu cộng cho ý đúng, dấu hỏi cho ý cần kiểm tra, và dấu bút chì cho câu cần viết lại cho rõ hơn. Các em không được chép toàn bộ câu trả lời. Thay vào đó, nhóm cần tìm ít nhất một ý trong sách giáo khoa, tài liệu giáo viên cung cấp hoặc nguồn tin cậy để đối chiếu.

Một câu hỏi hữu ích là: “AI đã dựa vào nguồn nào?” Nếu AI không nêu nguồn hoặc câu trả lời quá chung chung, học sinh cần ghi nhận giới hạn đó thay vì coi đây là sự thật chắc chắn.

## Bước 3 — Viết lại bằng tiếng nói của mình (4 phút)

Mỗi nhóm dùng kiến thức đã đối chiếu để viết một đoạn 3–4 câu. Đoạn này cần có một ý chính, một ví dụ và một câu nêu điều nhóm vẫn muốn tìm hiểu. Bằng cách đó, AI trở thành điểm bắt đầu cho quá trình suy nghĩ, không phải người làm bài thay.

## Bước 4 — Chia sẻ nguyên tắc sử dụng AI (2 phút)

Kết thúc hoạt động, cả lớp cùng nhắc lại ba nguyên tắc: không đưa dữ liệu cá nhân vào AI; kiểm tra thông tin quan trọng; và ghi rõ khi có dùng AI để hỗ trợ. Giáo viên có thể lưu các câu hỏi tốt nhất thành “ngân hàng câu hỏi” của lớp để học sinh tham khảo trong những bài sau.

Một tiết học có AI hiệu quả là tiết học mà học sinh hỏi nhiều hơn, kiểm tra kỹ hơn và tự tin giải thích bằng ngôn ngữ của chính mình.`,
  },
];

function field(value) {
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(field) } };
  if (value && typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, field(item)])),
      },
    };
  }
  return { nullValue: null };
}

for (const post of posts) {
  const url = new URL(
    `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents/posts/${post.id}`
  );
  url.searchParams.set("key", config.apiKey);
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(post).map(([key, value]) => [key, field(value)])) }),
  });
  if (!response.ok) throw new Error(`Không thể xuất bản ${post.id}: ${response.status} ${await response.text()}`);
  console.log(`Đã xuất bản: ${post.title}`);
}
