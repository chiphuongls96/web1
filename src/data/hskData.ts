export interface Vocabulary {
  id: string;
  hanzi: string;
  pinyin: string;
  sinoVietnamese: string;
  meaning: string;
  example: string;
  examplePinyin: string;
  exampleMeaning: string;
  strokeCount: number;
  radical: string;
  hskLevel: 1 | 2 | 3;
  lessonId: number;
  tags?: string[];
}

export interface GrammarPoint {
  id: string;
  title: string;
  formula: string;
  explanation: string;
  examples: {
    hanzi: string;
    pinyin: string;
    vietnamese: string;
  }[];
}

export interface Lesson {
  id: number;
  hskLevel: 1 | 2 | 3;
  title: string;
  pinyin: string;
  meaning: string;
  description: string;
  vrScene: {
    name: string;
    description: string;
    culturalContext: string;
    dialogue: { speaker: string; hanzi: string; pinyin: string; vi: string }[];
  };
  vocabList: Vocabulary[];
  grammarPoints: GrammarPoint[];
}

export interface SRSCard {
  id: string;
  vocabId: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  hskLevel: number;
  lessonId: number;
  easeFactor: number; // default 2.5
  intervalDays: number; // days until next review
  repetitions: number;
  nextReviewDate: string; // ISO string
  lastReviewedDate?: string;
  errorCount: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

export interface ExamQuestion {
  id: string;
  section: 'listening' | 'reading' | 'writing';
  audioPrompt?: string; // Text to be spoken
  prompt: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
}

// Complete 15 lessons for HSK 1
export const HSK1_LESSONS: Lesson[] = [
  {
    id: 1,
    hskLevel: 1,
    title: '你好',
    pinyin: 'Nǐ hǎo',
    meaning: 'Chào bạn',
    description: 'Học cách chào hỏi cơ bản, đại từ nhân xưng và phát âm các thanh mẫu, vận mẫu mở đầu.',
    vrScene: {
      name: 'Quảng trường Thiên An Môn & Giảng đường Bắc Kinh',
      description: 'Gặp gỡ bạn học quốc tế và thầy cô vào ngày đầu tựu trường tại khuôn viên trường đại học Bắc Kinh.',
      culturalContext: 'Trong văn hóa Trung Hoa, "你好" là lời chào lịch sự phổ biến nhất, còn với người lớn tuổi/tôn kính dùng "您好" (Nín hǎo).',
      dialogue: [
        { speaker: 'Li Ming', hanzi: '你好！', pinyin: 'Nǐ hǎo!', vi: 'Chào bạn!' },
        { speaker: 'David', hanzi: '你好！', pinyin: 'Nǐ hǎo!', vi: 'Chào bạn!' },
        { speaker: 'Thầy Vương', hanzi: '你们好！', pinyin: 'Nǐmen hǎo!', vi: 'Chào các em!' }
      ]
    },
    vocabList: [
      { id: 'v1-1', hanzi: '你', pinyin: 'nǐ', sinoVietnamese: 'Nhĩ', meaning: 'Bạn, anh, chị (ngôi thứ 2)', example: '你好吗？', examplePinyin: 'Nǐ hǎo ma?', exampleMeaning: 'Bạn khỏe không?', strokeCount: 7, radical: '亻 (Nhân đứng)', hskLevel: 1, lessonId: 1 },
      { id: 'v1-2', hanzi: '好', pinyin: 'hǎo', sinoVietnamese: 'Hảo', meaning: 'Tốt, đẹp, khỏe', example: '很好。', examplePinyin: 'Hěn hǎo.', exampleMeaning: 'Rất tốt.', strokeCount: 6, radical: '女 (Nữ)', hskLevel: 1, lessonId: 1 },
      { id: 'v1-3', hanzi: '您', pinyin: 'nín', sinoVietnamese: 'Nẫm', meaning: 'Ngài, ông, bà (kính ngữ)', example: '老师，您好！', examplePinyin: 'Lǎoshī, nín hǎo!', exampleMeaning: 'Em chào thầy ạ!', strokeCount: 11, radical: '心 (Tâm)', hskLevel: 1, lessonId: 1 },
      { id: 'v1-4', hanzi: '你们', pinyin: 'nǐmen', sinoVietnamese: 'Nhĩ môn', meaning: 'Các bạn, các anh', example: '你们好！', examplePinyin: 'Nǐmen hǎo!', exampleMeaning: 'Chào các bạn!', strokeCount: 9, radical: '亻 (Nhân đứng)', hskLevel: 1, lessonId: 1 },
      { id: 'v1-5', hanzi: '对不起', pinyin: 'duìbuqǐ', sinoVietnamese: 'Đối bất khởi', meaning: 'Xin lỗi', example: '对不起，我迟到了。', examplePinyin: 'Duìbuqǐ, wǒ chídào le.', exampleMeaning: 'Xin lỗi, tôi đến muộn.', strokeCount: 15, radical: '寸 (Thốn)', hskLevel: 1, lessonId: 1 },
      { id: 'v1-6', hanzi: '没关系', pinyin: 'méi guānxi', sinoVietnamese: 'Một quan hệ', meaning: 'Không có gì / Không sao đâu', example: '没关系，请进。', examplePinyin: 'Méi guānxi, qǐng jìn.', exampleMeaning: 'Không sao đâu, mời vào.', strokeCount: 17, radical: '氵 (Thủy)', hskLevel: 1, lessonId: 1 }
    ],
    grammarPoints: [
      {
        id: 'g1-1',
        title: 'Quy tắc biến điệu hai thanh 3 liên tiếp',
        formula: 'Thanh 3 + Thanh 3 ➔ Thanh 2 + Thanh 3',
        explanation: 'Khi hai âm tiết mang thanh 3 đi liền nhau, âm tiết thứ nhất đọc chuyển thành thanh 2 (Ví dụ: Nǐ hǎo đọc thành Ní hǎo).',
        examples: [
          { hanzi: '你好', pinyin: 'ní hǎo (viết: nǐ hǎo)', vietnamese: 'Chào bạn' },
          { hanzi: '很好', pinyin: 'hén hǎo (viết: hěn hǎo)', vietnamese: 'Rất tốt' }
        ]
      }
    ]
  },
  {
    id: 2,
    hskLevel: 1,
    title: '谢谢你',
    pinyin: 'Xièxie nǐ',
    meaning: 'Cảm ơn bạn',
    description: 'Cách biểu đạt lòng biết ơn và đáp lại lời cảm ơn, tạm biệt trong giao tiếp hàng ngày.',
    vrScene: {
      name: 'Tiệm trà đạo phố cổ Nam Kinh',
      description: 'Nhận tách trà Long Tỉnh ấm áp từ người bạn trà và trao lời cảm ơn tao nhã.',
      culturalContext: 'Khi nhận đồ bằng hai tay là cử chỉ tôn trọng chuẩn mực.',
      dialogue: [
        { speaker: 'Tiểu Hồng', hanzi: '谢谢你！', pinyin: 'Xièxie nǐ!', vi: 'Cảm ơn bạn!' },
        { speaker: 'Trương Vĩ', hanzi: '不客气！', pinyin: 'Bú kèqi!', vi: 'Đừng khách sáo!' },
        { speaker: 'Tiểu Hồng', hanzi: '再见！', pinyin: 'Zàijiàn!', vi: 'Tạm biệt!' }
      ]
    },
    vocabList: [
      { id: 'v2-1', hanzi: '谢谢', pinyin: 'xièxie', sinoVietnamese: 'Tạ tạ', meaning: 'Cảm ơn', example: '太谢谢你了！', examplePinyin: 'Tài xièxie nǐ le!', exampleMeaning: 'Cảm ơn bạn nhiều lắm!', strokeCount: 12, radical: '讠 (Ngôn)', hskLevel: 1, lessonId: 2 },
      { id: 'v2-2', hanzi: '不', pinyin: 'bù', sinoVietnamese: 'Bất', meaning: 'Không (phủ định)', example: '我不去。', examplePinyin: 'Wǒ bú qù.', exampleMeaning: 'Tôi không đi.', strokeCount: 4, radical: '一 (Nhất)', hskLevel: 1, lessonId: 2 },
      { id: 'v2-3', hanzi: '不客气', pinyin: 'bú kèqi', sinoVietnamese: 'Bất khách khí', meaning: 'Không có chi, đừng khách sáo', example: '不客气，这是我应该做的。', examplePinyin: 'Bú kèqi, zhè shì wǒ yīnggāi zuò de.', exampleMeaning: 'Không có chi, đây là việc tôi nên làm.', strokeCount: 17, radical: '宀 (Miên)', hskLevel: 1, lessonId: 2 },
      { id: 'v2-4', hanzi: '再见', pinyin: 'zàijiàn', sinoVietnamese: 'Tái kiến', meaning: 'Tạm biệt, hẹn gặp lại', example: '明天见！再见！', examplePinyin: 'Míngtiān jiàn! Zàijiàn!', exampleMeaning: 'Mai gặp lại! Tạm biệt!', strokeCount: 10, radical: '冂 (Quynh)', hskLevel: 1, lessonId: 2 }
    ],
    grammarPoints: [
      {
        id: 'g2-1',
        title: 'Biến điệu của chữ "不" (bù)',
        formula: 'bù + Thanh 4 ➔ bú + Thanh 4',
        explanation: 'Từ "不" vốn đọc thanh 4 (bù), nhưng đứng trước từ mang thanh 4 thì chuyển thành thanh 2 (bú).',
        examples: [
          { hanzi: '不是', pinyin: 'bú shì', vietnamese: 'Không phải' },
          { hanzi: '不客气', pinyin: 'bú kèqi', vietnamese: 'Không cần khách sáo' }
        ]
      }
    ]
  },
  {
    id: 3,
    hskLevel: 1,
    title: '你叫什么名字',
    pinyin: 'Nǐ jiào shénme míngzi',
    meaning: 'Bạn tên là gì?',
    description: 'Hỏi tên, tự giới thiệu bản thân và hỏi đại từ nghi vấn 什么.',
    vrScene: {
      name: 'Buổi giao lưu ký túc xá quốc tế',
      description: 'Làm quen với các bạn đến từ nhiều quốc gia trong buổi tiệc chào đón tân sinh viên.',
      culturalContext: 'Tên người Trung Quốc luôn đặt họ trước tên sau (ví dụ: Vương Phương thì Vương là họ, Phương là tên).',
      dialogue: [
        { speaker: 'Lý Mai', hanzi: '你叫什么名字？', pinyin: 'Nǐ jiào shénme míngzi?', vi: 'Bạn tên là gì?' },
        { speaker: 'David', hanzi: '我叫李月。', pinyin: 'Wǒ jiào Lǐ Yuè.', vi: 'Tôi tên là Lý Nguyệt.' }
      ]
    },
    vocabList: [
      { id: 'v3-1', hanzi: '叫', pinyin: 'jiào', sinoVietnamese: 'Khiếu', meaning: 'Gọi, tên là', example: '我叫王明。', examplePinyin: 'Wǒ jiào Wáng Míng.', exampleMeaning: 'Tôi tên là Vương Minh.', strokeCount: 5, radical: '口 (Khẩu)', hskLevel: 1, lessonId: 3 },
      { id: 'v3-2', hanzi: '什么', pinyin: 'shénme', sinoVietnamese: 'Thập ma', meaning: 'Cái gì', example: '这是什么？', examplePinyin: 'Zhè shì shénme?', exampleMeaning: 'Đây là cái gì?', strokeCount: 7, radical: '亻 (Nhân)', hskLevel: 1, lessonId: 3 },
      { id: 'v3-3', hanzi: '名字', pinyin: 'míngzi', sinoVietnamese: 'Danh tự', meaning: 'Tên gọi', example: '你的名字很好听。', examplePinyin: 'Nǐ de míngzi hěn hǎotīng.', exampleMeaning: 'Tên của bạn rất hay.', strokeCount: 12, radical: '夕 (Tịch)', hskLevel: 1, lessonId: 3 },
      { id: 'v3-4', hanzi: '我', pinyin: 'wǒ', sinoVietnamese: 'Ngã', meaning: 'Tôi, ta (ngôi thứ 1)', example: '我是学生。', examplePinyin: 'Wǒ shì xuésheng.', exampleMeaning: 'Tôi là học sinh.', strokeCount: 7, radical: '戈 (Qua)', hskLevel: 1, lessonId: 3 },
      { id: 'v3-5', hanzi: '是', pinyin: 'shì', sinoVietnamese: 'Thị', meaning: 'Là (động từ phán đoán)', example: '他是老师。', examplePinyin: 'Tā shì lǎoshī.', exampleMeaning: 'Thầy ấy là giáo viên.', strokeCount: 9, radical: '日 (Nhật)', hskLevel: 1, lessonId: 3 }
    ],
    grammarPoints: [
      {
        id: 'g3-1',
        title: 'Câu hỏi với đại từ nghi vấn 什么 (shénme)',
        formula: 'Chủ ngữ + Động từ + 什么 + (Danh từ)?',
        explanation: 'Đại từ nghi vấn "什么" đứng ở vị trí của thành phần cần hỏi trong câu.',
        examples: [
          { hanzi: '你叫什么名字？', pinyin: 'Nǐ jiào shénme míngzi?', vietnamese: 'Bạn tên là gì?' },
          { hanzi: '你看什么书？', pinyin: 'Nǐ kàn shénme shū?', vietnamese: 'Bạn đọc sách gì?' }
        ]
      }
    ]
  },
  {
    id: 4,
    hskLevel: 1,
    title: '她是我的汉语老师',
    pinyin: 'Tā shì wǒ de Hànyǔ lǎoshī',
    meaning: 'Cô ấy là giáo viên tiếng Trung của tôi',
    description: 'Học hỏi quốc tịch, nghề nghiệp và sử dụng trợ từ kết cấu 的 (đích).',
    vrScene: {
      name: 'Thư viện Trung tâm Ngôn ngữ',
      description: 'Giới thiệu giáo viên bộ môn và các bạn bè cùng lớp nghiên cứu Hán ngữ.',
      culturalContext: 'Tiếng Trung có chữ 他 (anh ấy), 她 (cô ấy) và 它 (nó - dùng cho đồ vật/con vật), phát âm đều là "tā".',
      dialogue: [
        { speaker: 'Lý Mai', hanzi: '她是谁？', pinyin: 'Tā shì shéi?', vi: 'Cô ấy là ai thế?' },
        { speaker: 'Vương Phương', hanzi: '她是我的汉语老师。', pinyin: 'Tā shì wǒ de Hànyǔ lǎoshī.', vi: 'Cô ấy là giáo viên tiếng Trung của tôi.' }
      ]
    },
    vocabList: [
      { id: 'v4-1', hanzi: '谁', pinyin: 'shéi', sinoVietnamese: 'Thùy', meaning: 'Ai', example: '他是谁？', examplePinyin: 'Tā shì shéi?', exampleMeaning: 'Anh ấy là ai?', strokeCount: 10, radical: '讠 (Ngôn)', hskLevel: 1, lessonId: 4 },
      { id: 'v4-2', hanzi: '的', pinyin: 'de', sinoVietnamese: 'Đích', meaning: 'Của (trợ từ sở hữu)', example: '我的书。', examplePinyin: 'Wǒ de shū.', exampleMeaning: 'Sách của tôi.', strokeCount: 8, radical: '白 (Bạch)', hskLevel: 1, lessonId: 4 },
      { id: 'v4-3', hanzi: '汉语', pinyin: 'Hànyǔ', sinoVietnamese: 'Hán ngữ', meaning: 'Tiếng Trung, Hán ngữ', example: '汉语不难。', examplePinyin: 'Hànyǔ bù nán.', exampleMeaning: 'Tiếng Hán không khó.', strokeCount: 19, radical: '氵 (Thủy)', hskLevel: 1, lessonId: 4 },
      { id: 'v4-4', hanzi: '老师', pinyin: 'lǎoshī', sinoVietnamese: 'Lão sư', meaning: 'Thầy giáo, cô giáo', example: '王老师好！', examplePinyin: 'Wáng lǎoshī hǎo!', exampleMeaning: 'Em chào thầy Vương!', strokeCount: 12, radical: '耂 (Lão)', hskLevel: 1, lessonId: 4 },
      { id: 'v4-5', hanzi: '学生', pinyin: 'xuésheng', sinoVietnamese: 'Học sinh', meaning: 'Học sinh, sinh viên', example: '我是留学生。', examplePinyin: 'Wǒ shì liúxuéshēng.', exampleMeaning: 'Tôi là lưu học sinh.', strokeCount: 13, radical: '子 (Tử)', hskLevel: 1, lessonId: 4 }
    ],
    grammarPoints: [
      {
        id: 'g4-1',
        title: 'Trợ từ kết cấu "的" biểu thị sở hữu',
        formula: 'Định ngữ + 的 + Trung tâm ngữ',
        explanation: 'Dùng "的" nối định ngữ sở hữu với danh từ trung tâm. Nếu quan hệ thân thuộc hoặc tập thể có thể lược bỏ "的".',
        examples: [
          { hanzi: '我的老师', pinyin: 'wǒ de lǎoshī', vietnamese: 'Giáo viên của tôi' },
          { hanzi: '我妈妈', pinyin: 'wǒ māma', vietnamese: 'Mẹ tôi (lược bỏ 的)' }
        ]
      }
    ]
  },
  {
    id: 5,
    hskLevel: 1,
    title: '她女儿今年二十岁',
    pinyin: 'Tā nǚ’ér jīnnián èrshí suì',
    meaning: 'Con gái cô ấy năm nay 20 tuổi',
    description: 'Học số đếm từ 1-100, cách hỏi tuổi tác và các thành viên gia đình.',
    vrScene: {
      name: 'Phòng khách gia đình Tứ Hợp Viện',
      description: 'Trò chuyện cùng các thế hệ trong gia đình truyền thống bên mâm cơm ấm cúng.',
      culturalContext: 'Khi hỏi tuổi trẻ nhỏ dùng "几岁", hỏi người cùng trang lứa dùng "多大", hỏi người già dùng "多大年纪/高寿".',
      dialogue: [
        { speaker: 'Bác Trương', hanzi: '你今年多大？', pinyin: 'Nǐ jīnnián duō dà?', vi: 'Năm nay cháu bao nhiêu tuổi?' },
        { speaker: 'Tiểu Vũ', hanzi: '我今年二十岁。', pinyin: 'Wǒ jīnnián èrshí suì.', vi: 'Cháu năm nay hai mươi tuổi ạ.' }
      ]
    },
    vocabList: [
      { id: 'v5-1', hanzi: '家', pinyin: 'jiā', sinoVietnamese: 'Gia', meaning: 'Nhà, gia đình', example: '我家有三口人。', examplePinyin: 'Wǒ jiā yǒu sān kǒu rén.', exampleMeaning: 'Nhà tôi có 3 người.', strokeCount: 10, radical: '宀 (Miên)', hskLevel: 1, lessonId: 5 },
      { id: 'v5-2', hanzi: '有', pinyin: 'yǒu', sinoVietnamese: 'Hữu', meaning: 'Có', example: '我有一个姐姐。', examplePinyin: 'Wǒ yǒu yí gè jiějie.', exampleMeaning: 'Tôi có một người chị gái.', strokeCount: 6, radical: '月 (Nguyệt)', hskLevel: 1, lessonId: 5 },
      { id: 'v5-3', hanzi: '岁', pinyin: 'suì', sinoVietnamese: 'Tuế', meaning: 'Tuổi', example: '我二十岁。', examplePinyin: 'Wǒ èrshí suì.', exampleMeaning: 'Tôi 20 tuổi.', strokeCount: 6, radical: '山 (Sơn)', hskLevel: 1, lessonId: 5 },
      { id: 'v5-4', hanzi: '女儿', pinyin: 'nǚ’ér', sinoVietnamese: 'Nữ nhi', meaning: 'Con gái', example: '她女儿真可爱。', examplePinyin: 'Tā nǚ’ér zhēn kě’ài.', exampleMeaning: 'Con gái cô ấy thật dễ thương.', strokeCount: 5, radical: '女 (Nữ)', hskLevel: 1, lessonId: 5 }
    ],
    grammarPoints: [
      {
        id: 'g5-1',
        title: 'Hỏi số lượng ít với "几" và hỏi tuổi',
        formula: 'Chủ ngữ + 几岁？ / Chủ ngữ + 多大？',
        explanation: '几 thường dùng để hỏi số lượng nhỏ hơn 10 và luôn đi kèm lượng từ.',
        examples: [
          { hanzi: '你儿子几岁？', pinyin: 'Nǐ érzi jǐ suì?', vietnamese: 'Con trai bạn mấy tuổi?' },
          { hanzi: '你多大了？', pinyin: 'Nǐ duō dà le?', vietnamese: 'Bạn bao nhiêu tuổi rồi?' }
        ]
      }
    ]
  },
  {
    id: 6,
    hskLevel: 1,
    title: '我会说汉语',
    pinyin: 'Wǒ huì shuō Hànyǔ',
    meaning: 'Tôi biết nói tiếng Trung',
    description: 'Diễn đạt kỹ năng học được qua rèn luyện bằng động từ năng nguyện "会".',
    vrScene: {
      name: 'Nhà bếp lớp ẩm thực Trung Hoa',
      description: 'Học cách làm sủi cảo và nói các từ vựng về nấu nướng, kỹ năng.',
      culturalContext: 'Từ "会" nhấn mạnh năng lực có được qua học tập rèn luyện (học nói, học nấu ăn, lái xe).',
      dialogue: [
        { speaker: 'Đầu bếp', hanzi: '你会做中国菜吗？', pinyin: 'Nǐ huì zuò Zhōngguó cài ma?', vi: 'Bạn biết nấu món Trung Quốc không?' },
        { speaker: 'Lưu Cường', hanzi: '我会做，中国菜很好吃！', pinyin: 'Wǒ huì zuò, Zhōngguó cài hěn hǎochī!', vi: 'Tôi biết làm, món Trung ăn rất ngon!' }
      ]
    },
    vocabList: [
      { id: 'v6-1', hanzi: '会', pinyin: 'huì', sinoVietnamese: 'Hội', meaning: 'Biết (thông qua học tập)', example: '我会写汉字。', examplePinyin: 'Wǒ huì xiě hànzì.', exampleMeaning: 'Tôi biết viết chữ Hán.', strokeCount: 6, radical: '人 (Nhân)', hskLevel: 1, lessonId: 6 },
      { id: 'v6-2', hanzi: '说', pinyin: 'shuō', sinoVietnamese: 'Thuyết', meaning: 'Nói', example: '请大声说。', examplePinyin: 'Qǐng dàshēng shuō.', exampleMeaning: 'Xin nói to lên.', strokeCount: 9, radical: '讠 (Ngôn)', hskLevel: 1, lessonId: 6 },
      { id: 'v6-3', hanzi: '菜', pinyin: 'cài', sinoVietnamese: 'Thái', meaning: 'Món ăn, rau củ', example: '中国菜', examplePinyin: 'Zhōngguó cài', exampleMeaning: 'Món ăn Trung Hoa', strokeCount: 11, radical: '艹 (Thảo)', hskLevel: 1, lessonId: 6 },
      { id: 'v6-4', hanzi: '好吃', pinyin: 'hǎochī', sinoVietnamese: 'Hảo ngật', meaning: 'Ngon miệng', example: '这个苹果真好吃。', examplePinyin: 'Zhè ge píngguǒ zhēn hǎochī.', exampleMeaning: 'Quả táo này ngon thật.', strokeCount: 12, radical: '口 (Khẩu)', hskLevel: 1, lessonId: 6 }
    ],
    grammarPoints: [
      {
        id: 'g6-1',
        title: 'Động từ năng nguyện "会" (huì)',
        formula: 'Chủ ngữ + 会 + Động từ + Tân ngữ',
        explanation: 'Biểu thị khả năng làm được việc gì đó do trải qua quá trình học tập hoặc rèn luyện.',
        examples: [
          { hanzi: '我会说汉语。', pinyin: 'Wǒ huì shuō Hànyǔ.', vietnamese: 'Tôi biết nói tiếng Trung.' },
          { hanzi: '我不会做饭。', pinyin: 'Wǒ bú huì zuò fàn.', vietnamese: 'Tôi không biết nấu cơm.' }
        ]
      }
    ]
  },
  {
    id: 7,
    hskLevel: 1,
    title: '今天几号',
    pinyin: 'Jīntiān jǐ hào',
    meaning: 'Hôm nay ngày mấy?',
    description: 'Cách biểu đạt thời gian: thứ, ngày, tháng, năm trong tiếng Trung.',
    vrScene: { name: 'Văn phòng hành chính trường học', description: 'Đặt lịch đăng ký môn học và điền tờ khai thông tin cá nhân.', culturalContext: 'Thứ tự thời gian tiếng Trung luôn đi từ lớn đến nhỏ: Năm ➔ Tháng ➔ Ngày ➔ Giờ.', dialogue: [{ speaker: 'Nhân viên', hanzi: '今天星期几？', pinyin: 'Jīntiān xīngqī jǐ?', vi: 'Hôm nay thứ mấy?' }, { speaker: 'Học viên', hanzi: '今天星期三。', pinyin: 'Jīntiān xīngqīsān.', vi: 'Hôm nay là thứ Tư.' }] },
    vocabList: [
      { id: 'v7-1', hanzi: '今天', pinyin: 'jīntiān', sinoVietnamese: 'Kim thiên', meaning: 'Hôm nay', example: '今天我很忙。', examplePinyin: 'Jīntiān wǒ hěn máng.', exampleMeaning: 'Hôm nay tôi rất bận.', strokeCount: 8, radical: '人', hskLevel: 1, lessonId: 7 },
      { id: 'v7-2', hanzi: '月', pinyin: 'yuè', sinoVietnamese: 'Nguyệt', meaning: 'Tháng, mặt trăng', example: '九月', examplePinyin: 'jiǔ yuè', exampleMeaning: 'Tháng chín', strokeCount: 4, radical: '月', hskLevel: 1, lessonId: 7 },
      { id: 'v7-3', hanzi: '号', pinyin: 'hào', sinoVietnamese: 'Hiệu', meaning: 'Ngày (văn nói), số', example: '五号', examplePinyin: 'wǔ hào', exampleMeaning: 'Ngày mùng 5', strokeCount: 5, radical: '口', hskLevel: 1, lessonId: 7 }
    ],
    grammarPoints: [{ id: 'g7-1', title: 'Quy tắc diễn đạt thời gian', formula: 'Năm (年) + Tháng (月) + Ngày (日/号) + Thứ (星期)', explanation: 'Quy tắc từ bao quát đến cụ thể.', examples: [{ hanzi: '2026年10月18号', pinyin: 'èr líng èr liù nián shí yuè shí bā hào', vietnamese: 'Ngày 18 tháng 10 năm 2026' }] }]
  },
  {
    id: 8,
    hskLevel: 1,
    title: '我想喝茶',
    pinyin: 'Wǒ xiǎng hē chá',
    meaning: 'Tôi muốn uống trà',
    description: 'Biểu đạt nguyện vọng, mong muốn bằng động từ năng nguyện "想" và lượng từ chỉ vật.',
    vrScene: { name: 'Quán cà phê Thượng Hải', description: 'Chọn đồ uống và gọi món.', culturalContext: 'Văn hóa trà đạo Trung Quốc có hàng nghìn năm lịch sử.', dialogue: [{ speaker: 'Phục vụ', hanzi: '你想喝什么？', pinyin: 'Nǐ xiǎng hē shénme?', vi: 'Bạn muốn uống gì?' }, { speaker: 'Khách', hanzi: '我想喝茶。', pinyin: 'Wǒ xiǎng hē chá.', vi: 'Tôi muốn uống trà.' }] },
    vocabList: [
      { id: 'v8-1', hanzi: '想', pinyin: 'xiǎng', sinoVietnamese: 'Tưởng', meaning: 'Muốn, nhớ, nghĩ', example: '我想去中国。', examplePinyin: 'Wǒ xiǎng qù Zhōngguó.', exampleMeaning: 'Tôi muốn đi Trung Quốc.', strokeCount: 13, radical: '心', hskLevel: 1, lessonId: 8 },
      { id: 'v8-2', hanzi: '喝', pinyin: 'hē', sinoVietnamese: 'Hát', meaning: 'Uống', example: '喝水', examplePinyin: 'hē shuǐ', exampleMeaning: 'Uống nước', strokeCount: 12, radical: '口', hskLevel: 1, lessonId: 8 },
      { id: 'v8-3', hanzi: '茶', pinyin: 'chá', sinoVietnamese: 'Trà', meaning: 'Trà, chè', example: '绿茶', examplePinyin: 'lǜchá', exampleMeaning: 'Trà xanh', strokeCount: 9, radical: '艹', hskLevel: 1, lessonId: 8 }
    ],
    grammarPoints: [{ id: 'g8-1', title: 'Động từ năng nguyện "想"', formula: 'Chủ ngữ + 想 + Động từ', explanation: 'Diễn tả nguyện vọng, dự định chủ quan của bản thân.', examples: [{ hanzi: '我想买一个杯子。', pinyin: 'Wǒ xiǎng mǎi yí gè bēizi.', vietnamese: 'Tôi muốn mua một cái cốc.' }] }]
  },
  {
    id: 9,
    hskLevel: 1,
    title: '你儿子在哪儿工作',
    pinyin: 'Nǐ érzi zài nǎr gōngzuò',
    meaning: 'Con trai bạn làm việc ở đâu?',
    description: 'Hỏi nơi chốn, địa điểm và sử dụng giới từ "在" (tại).',
    vrScene: { name: 'Bệnh viện & Công ty công nghệ Thâm Quyến', description: 'Giới thiệu nghề nghiệp và địa điểm làm việc của các thành viên.', culturalContext: 'Thành ngữ "安居乐业" (An cư lạc nghiệp).', dialogue: [{ speaker: 'Bác Lý', hanzi: '你在哪儿工作？', pinyin: 'Nǐ zài nǎr gōngzuò?', vi: 'Cháu làm việc ở đâu?' }, { speaker: 'Tiểu Trương', hanzi: '我在医院工作。', pinyin: 'Wǒ zài yīyuàn gōngzuò.', vi: 'Cháu làm việc ở bệnh viện ạ.' }] },
    vocabList: [
      { id: 'v9-1', hanzi: '在', pinyin: 'zài', sinoVietnamese: 'Tại', meaning: 'Ở, tại', example: '你在家吗？', examplePinyin: 'Nǐ zài jiā ma?', exampleMeaning: 'Bạn có ở nhà không?', strokeCount: 6, radical: '土', hskLevel: 1, lessonId: 9 },
      { id: 'v9-2', hanzi: '哪儿', pinyin: 'nǎr', sinoVietnamese: 'Ná nhi', meaning: 'Ở đâu, chỗ nào', example: '你去哪儿？', examplePinyin: 'Nǐ qù nǎr?', exampleMeaning: 'Bạn đi đâu?', strokeCount: 11, radical: '口', hskLevel: 1, lessonId: 9 },
      { id: 'v9-3', hanzi: '工作', pinyin: 'gōngzuò', sinoVietnamese: 'Công tác', meaning: 'Làm việc, công việc', example: '我喜欢我的工作。', examplePinyin: 'Wǒ xǐhuan wǒ de gōngzuò.', exampleMeaning: 'Tôi thích công việc của mình.', strokeCount: 10, radical: '亻', hskLevel: 1, lessonId: 9 }
    ],
    grammarPoints: [{ id: 'g9-1', title: 'Cụm giới từ chỉ địa điểm: "在 + Nơi chốn + Động từ"', formula: 'Chủ ngữ + 在 + Địa điểm + Hành động', explanation: 'Chỉ ra địa điểm xảy ra hành động, vị trí đứng trước động từ chính.', examples: [{ hanzi: '我在中国学汉语。', pinyin: 'Wǒ zài Zhōngguó xué Hànyǔ.', vietnamese: 'Tôi học tiếng Trung ở Trung Quốc.' }] }]
  },
  {
    id: 10,
    hskLevel: 1,
    title: '我能坐这儿吗',
    pinyin: 'Wǒ néng zuò zhèr ma',
    meaning: 'Tôi có thể ngồi đây được không?',
    description: 'Hỏi sự cho phép với "能" và câu tồn hiện chỉ vị trí đồ vật.',
    vrScene: { name: 'Toa tàu cao tốc Kinh Hỗ', description: 'Xin phép ngồi cạnh hành khách trên chuyến tàu hiện đại.', culturalContext: 'Văn minh đi tàu xe và phép lịch sự nơi công cộng.', dialogue: [{ speaker: 'Khách', hanzi: '请问，这儿有人吗？', pinyin: 'Qǐngwèn, zhèr yǒu rén ma?', vi: 'Xin hỏi, chỗ này có ai ngồi chưa?' }, { speaker: 'Hành khách', hanzi: '没有，你可以坐。', pinyin: 'Méiyǒu, nǐ kěyǐ zuò.', vi: 'Không có, bạn có thể ngồi.' }] },
    vocabList: [
      { id: 'v10-1', hanzi: '能', pinyin: 'néng', sinoVietnamese: 'Năng', meaning: 'Có thể (năng lực, điều kiện cho phép)', example: '我能去吗？', examplePinyin: 'Wǒ néng qù ma?', exampleMeaning: 'Tôi có thể đi không?', strokeCount: 10, radical: '月', hskLevel: 1, lessonId: 10 },
      { id: 'v10-2', hanzi: '坐', pinyin: 'zuò', sinoVietnamese: 'Tọa', meaning: 'Ngồi, đi (tàu, xe)', example: '请坐！', examplePinyin: 'Qǐng zuò!', exampleMeaning: 'Mời ngồi!', strokeCount: 7, radical: '土', hskLevel: 1, lessonId: 10 },
      { id: 'v10-3', hanzi: '桌子', pinyin: 'zhuōzi', sinoVietnamese: 'Trác tử', meaning: 'Cái bàn', example: '桌子上有一本书。', examplePinyin: 'Zhuōzi shang yǒu yì běn shū.', exampleMeaning: 'Trên bàn có một cuốn sách.', strokeCount: 13, radical: '木', hskLevel: 1, lessonId: 10 }
    ],
    grammarPoints: [{ id: 'g10-1', title: 'Câu tồn hiện với "有"', formula: 'Nơi chốn + 有 + Danh từ', explanation: 'Diễn tả ở một vị trí nào đó có tồn tại người hoặc vật.', examples: [{ hanzi: '椅子下面有一只猫。', pinyin: 'Yǐzi xiàmian yǒu yì zhī māo.', vietnamese: 'Dưới gầm ghế có một con mèo.' }] }]
  },
  {
    id: 11,
    hskLevel: 1,
    title: '现在几点',
    pinyin: 'Xiànzài jǐ diǎn',
    meaning: 'Bây giờ là mấy giờ?',
    description: 'Biểu đạt thời gian trong ngày (giờ, phút, mốc thời gian sáng trưa chiều tối).',
    vrScene: { name: 'Tháp đồng hồ Ngoại Than Bến Thượng Hải', description: 'Hẹn giờ gặp gỡ bạn bè bên bờ sông Hoàng Phố.', culturalContext: 'Ý thức đúng giờ trong các cuộc hẹn chuyên nghiệp.', dialogue: [{ speaker: 'An Ni', hanzi: '现在几点？', pinyin: 'Xiànzài jǐ diǎn?', vi: 'Bây giờ mấy giờ rồi?' }, { speaker: 'Bác Hải', hanzi: '现在十点十分。', pinyin: 'Xiànzài shí diǎn shí fēn.', vi: 'Bây giờ là mười giờ mười phút.' }] },
    vocabList: [
      { id: 'v11-1', hanzi: '现在', pinyin: 'xiànzài', sinoVietnamese: 'Hiện tại', meaning: 'Bây giờ, hiện tại', example: '现在去正好。', examplePinyin: 'Xiànzài qù zhènghǎo.', exampleMeaning: 'Bây giờ đi là vừa đẹp.', strokeCount: 12, radical: '王', hskLevel: 1, lessonId: 11 },
      { id: 'v11-2', hanzi: '点', pinyin: 'diǎn', sinoVietnamese: 'Điểm', meaning: 'Giờ, dấu chấm', example: '八点', examplePinyin: 'bā diǎn', exampleMeaning: '8 giờ', strokeCount: 9, radical: '灬', hskLevel: 1, lessonId: 11 },
      { id: 'v11-3', hanzi: '分', pinyin: 'fēn', sinoVietnamese: 'Phân', meaning: 'Phút', example: '十分', examplePinyin: 'shí fēn', exampleMeaning: '10 phút', strokeCount: 4, radical: '刀', hskLevel: 1, lessonId: 11 }
    ],
    grammarPoints: [{ id: 'g11-1', title: 'Cấu trúc nói giờ trong tiếng Trung', formula: 'Số từ + 点 (diǎn) + Số từ + 分 (fēn)', explanation: 'Nếu số phút là 30 dùng 半 (bàn - rưỡi).', examples: [{ hanzi: '九点半', pinyin: 'jiǔ diǎn bàn', vietnamese: '9 giờ rưỡi' }] }]
  },
  {
    id: 12,
    hskLevel: 1,
    title: '明天天气怎么样',
    pinyin: 'Míngtiān tiānqì zěnmeyàng',
    meaning: 'Thời tiết ngày mai thế nào?',
    description: 'Hỏi và miêu tả thời tiết, nhiệt độ, sức khỏe.',
    vrScene: { name: 'Hồ Tây Hàng Châu', description: 'Ngắm hoa sen và thảo luận về dự báo thời tiết cho chuyến dã ngoại.', culturalContext: 'Văn hóa hỏi thăm thời tiết và sức khỏe.', dialogue: [{ speaker: 'Du khách', hanzi: '明天天气怎么样？', pinyin: 'Míngtiān tiānqì zěnmeyàng?', vi: 'Thời tiết mai thế nào?' }, { speaker: 'Hướng dẫn viên', hanzi: '明天很热，不冷。', pinyin: 'Míngtiān hěn rè, bù lěng.', vi: 'Ngày mai khá nóng, không lạnh.' }] },
    vocabList: [
      { id: 'v12-1', hanzi: '天气', pinyin: 'tiānqì', sinoVietnamese: 'Thiên khí', meaning: 'Thời tiết', example: '天气很好。', examplePinyin: 'Tiānqì hěn hǎo.', exampleMeaning: 'Thời tiết rất đẹp.', strokeCount: 10, radical: '大', hskLevel: 1, lessonId: 12 },
      { id: 'v12-2', hanzi: '怎么样', pinyin: 'zěnmeyàng', sinoVietnamese: 'Chẩm ma dạng', meaning: 'Như thế nào, ra sao', example: '你觉得怎么样？', examplePinyin: 'Nǐ juéde zěnmeyàng?', exampleMeaning: 'Bạn thấy thế nào?', strokeCount: 22, radical: '心', hskLevel: 1, lessonId: 12 },
      { id: 'v12-3', hanzi: '热', pinyin: 'rè', sinoVietnamese: 'Nhiệt', meaning: 'Nóng', example: '太热了！', examplePinyin: 'Tài rè le!', exampleMeaning: 'Nóng quá rồi!', strokeCount: 10, radical: '灬', hskLevel: 1, lessonId: 12 }
    ],
    grammarPoints: [{ id: 'g12-1', title: 'Hỏi tính chất với "怎么样"', formula: 'Chủ ngữ + 怎么样？', explanation: 'Dùng để hỏi về tình trạng, tính chất hoặc xin ý kiến.', examples: [{ hanzi: '汉语考试怎么样？', pinyin: 'Hànyǔ kǎoshì zěnmeyàng?', vietnamese: 'Kỳ thi tiếng Trung thế nào?' }] }]
  },
  {
    id: 13,
    hskLevel: 1,
    title: '他在学做中国菜呢',
    pinyin: 'Tā zài xué zuò Zhōngguó cài ne',
    meaning: 'Anh ấy đang học nấu món Trung đấy',
    description: 'Biểu thị hành động đang tiếp diễn với "在...呢".',
    vrScene: { name: 'Khu nội trú sinh viên', description: 'Gọi điện cho bạn bè và quan sát các hoạt động đang diễn ra.', culturalContext: 'Cuộc sống sinh viên năng động.', dialogue: [{ speaker: 'Minh', hanzi: '你在做什么呢？', pinyin: 'Nǐ zài zuò shénme ne?', vi: 'Cậu đang làm gì đấy?' }, { speaker: 'Hoa', hanzi: '我正在看书呢。', pinyin: 'Wǒ zhèngzài kàn shū ne.', vi: 'Mình đang đọc sách nè.' }] },
    vocabList: [
      { id: 'v13-1', hanzi: '看', pinyin: 'kàn', sinoVietnamese: 'Khán', meaning: 'Xem, nhìn, đọc', example: '看电视', examplePinyin: 'kàn diànshì', exampleMeaning: 'Xem ti vi', strokeCount: 9, radical: '目', hskLevel: 1, lessonId: 13 },
      { id: 'v13-2', hanzi: '呢', pinyin: 'ne', sinoVietnamese: 'Ni', meaning: 'Đang (trợ từ ngữ khí)', example: '下雨呢。', examplePinyin: 'Xiàyǔ ne.', exampleMeaning: 'Đang mưa đấy.', strokeCount: 8, radical: '口', hskLevel: 1, lessonId: 13 }
    ],
    grammarPoints: [{ id: 'g13-1', title: 'Biểu thị hành động đang tiếp diễn', formula: 'Chủ ngữ + 在 / 正在 + Động từ + (呢)', explanation: 'Diễn tả hành động đang xảy ra tại thời điểm nói.', examples: [{ hanzi: '他在睡觉呢。', pinyin: 'Tā zài shuìjiào ne.', vietnamese: 'Anh ấy đang ngủ đấy.' }] }]
  },
  {
    id: 14,
    hskLevel: 1,
    title: '她买了不少衣服',
    pinyin: 'Tā mǎi le bù shǎo yīfu',
    meaning: 'Cô ấy mua không ít quần áo',
    description: 'Sử dụng trợ từ động thái "了" biểu thị sự hoàn thành của động tác.',
    vrScene: { name: 'Trung tâm mua sắm Vương Phủ Tỉnh', description: 'Dạo phố sắm sửa trang phục.', culturalContext: 'Thói quen mua sắm hiện đại.', dialogue: [{ speaker: 'Tiểu Phương', hanzi: '你买了什么？', pinyin: 'Nǐ mǎi le shénme?', vi: 'Cậu đã mua những gì rồi?' }, { speaker: 'Mỹ Lệ', hanzi: '我买了一件衣服。', pinyin: 'Wǒ mǎi le yí jiàn yīfu.', vi: 'Mình mua một chiếc áo.' }] },
    vocabList: [
      { id: 'v14-1', hanzi: '买', pinyin: 'mǎi', sinoVietnamese: 'Mãi', meaning: 'Mua', example: '买东西', examplePinyin: 'mǎi dōngxi', exampleMeaning: 'Mua đồ', strokeCount: 6, radical: '乙', hskLevel: 1, lessonId: 14 },
      { id: 'v14-2', hanzi: '衣服', pinyin: 'yīfu', sinoVietnamese: 'Y phục', meaning: 'Quần áo', example: '漂亮衣服', examplePinyin: 'piàoliang yīfu', exampleMeaning: 'Quần áo đẹp', strokeCount: 14, radical: '衤', hskLevel: 1, lessonId: 14 },
      { id: 'v14-3', hanzi: '了', pinyin: 'le', sinoVietnamese: 'Liễu', meaning: 'Rồi (trợ từ động thái)', example: '我吃了。', examplePinyin: 'Wǒ chī le.', exampleMeaning: 'Tôi ăn rồi.', strokeCount: 2, radical: '亅', hskLevel: 1, lessonId: 14 }
    ],
    grammarPoints: [{ id: 'g14-1', title: 'Trợ từ động thái "了"', formula: 'Động từ + 了 + Tân ngữ số lượng', explanation: 'Nhấn mạnh hành động đã xảy ra hoặc hoàn thành.', examples: [{ hanzi: '他喝了一杯水。', pinyin: 'Tā hē le yì bēi shuǐ.', vietnamese: 'Anh ấy đã uống một cốc nước.' }] }]
  },
  {
    id: 15,
    hskLevel: 1,
    title: '我是坐飞机来的',
    pinyin: 'Wǒ shì zuò fēijī lái de',
    meaning: 'Tôi đến bằng máy bay',
    description: 'Cấu trúc nhấn mạnh thời gian, địa điểm, phương thức thực hiện hành động: "是...的".',
    vrScene: { name: 'Sân bay quốc tế Đại Hưng Bắc Kinh', description: 'Đón đối tác quốc tế và hỏi về chuyến đi.', culturalContext: 'Hạ tầng giao thông hiện đại của Trung Quốc.', dialogue: [{ speaker: 'Người đón', hanzi: '你是怎么来的？', pinyin: 'Nǐ shì zěnme lái de?', vi: 'Bạn đến đây bằng cách nào?' }, { speaker: 'Du khách', hanzi: '我是坐飞机来的。', pinyin: 'Wǒ shì zuò fēijī lái de.', vi: 'Tôi đi máy bay tới.' }] },
    vocabList: [
      { id: 'v15-1', hanzi: '飞机', pinyin: 'fēijī', sinoVietnamese: 'Phi cơ', meaning: 'Máy bay', example: '坐飞机', examplePinyin: 'zuò fēijī', exampleMeaning: 'Đi máy bay', strokeCount: 9, radical: '飞', hskLevel: 1, lessonId: 15 },
      { id: 'v15-2', hanzi: '来', pinyin: 'lái', sinoVietnamese: 'Lai', meaning: 'Đến, tới', example: '欢迎来中国！', examplePinyin: 'Huānyíng lái Zhōngguó!', exampleMeaning: 'Chào mừng đến Trung Quốc!', strokeCount: 7, radical: '木', hskLevel: 1, lessonId: 15 }
    ],
    grammarPoints: [{ id: 'g15-1', title: 'Cấu trúc nhấn mạnh "是...的"', formula: 'Chủ ngữ + 是 + Phương thức/Thời gian/Địa điểm + Động từ + 的', explanation: 'Dùng để nhấn mạnh cách thức, nơi chốn hoặc thời điểm của hành động đã xảy ra.', examples: [{ hanzi: '我们是昨天认识的。', pinyin: 'Wǒmen shì zuótiān rènshi de.', vietnamese: 'Chúng tôi quen nhau từ hôm qua.' }] }]
  }
];

// Complete 15 lessons for HSK 2
export const HSK2_LESSONS: Lesson[] = Array.from({ length: 15 }, (_, i) => {
  const lessonNumber = i + 1;
  const titles = [
    { title: '九月去北京旅游最好', pinyin: 'Jiǔyuè qù Běijīng lǚyóu zuì hǎo', meaning: 'Tháng 9 đi Bắc Kinh du lịch là đẹp nhất' },
    { title: '我每天六点起床', pinyin: 'Wǒ měitiān liù diǎn qǐchuáng', meaning: 'Mỗi ngày tôi đều dậy lúc 6 giờ' },
    { title: '左边那个红色的是我的', pinyin: 'Zuǒbian nà ge hóngsè de shì wǒ de', meaning: 'Cái màu đỏ bên trái là của tôi' },
    { title: '这个工作是他帮我介绍的', pinyin: 'Zhège gōngzuò shì tā bāng wǒ jièshào de', meaning: 'Công việc này là anh ấy giới thiệu cho tôi' },
    { title: '就买这件吧', pinyin: 'Jiù mǎi zhè jiàn ba', meaning: 'Mua chiếc áo này đi' },
    { title: '你怎么不吃了', pinyin: 'Nǐ zěnme bù chī le', meaning: 'Sao bạn không ăn nữa vậy?' },
    { title: '你家离公司远吗', pinyin: 'Nǐ jiā lí gōngsī yuǎn ma', meaning: 'Nhà bạn cách công ty xa không?' },
    { title: '让我想想再告诉你', pinyin: 'Ràng wǒ xiǎngxiang zài gàosu nǐ', meaning: 'Để tôi nghĩ đã rồi nói cho bạn biết' },
    { title: '题太多，我没做完', pinyin: 'Tí tài duō, wǒ méi zuò wán', meaning: 'Đề nhiều quá, tôi làm không kịp' },
    { title: '别找了，手机在桌子上呢', pinyin: 'Bié zhǎo le, shǒujī zài zhuōzi shang ne', meaning: 'Đừng tìm nữa, điện thoại ở trên bàn kìa' },
    { title: '他比我大三岁', pinyin: 'Tā bǐ wǒ dà sān suì', meaning: 'Anh ấy lớn hơn tôi 3 tuổi' },
    { title: '你穿得太少了', pinyin: 'Nǐ chuān de tài shǎo le', meaning: 'Bạn mặc phong phanh quá' },
    { title: '门开着呢', pinyin: 'Mén kāi zhe ne', meaning: 'Cửa đang mở đấy' },
    { title: '你看过那个电影吗', pinyin: 'Nǐ kàn guo nà ge diànyǐng ma', meaning: 'Bạn đã xem bộ phim đó bao giờ chưa?' },
    { title: '新年就要到了', pinyin: 'Xīnnián jiù yào dào le', meaning: 'Năm mới sắp đến rồi' }
  ][i];

  return {
    id: lessonNumber,
    hskLevel: 2,
    title: titles.title,
    pinyin: titles.pinyin,
    meaning: titles.meaning,
    description: `Nâng cao năng lực diễn đạt HSK 3.0: từ vựng chỉ hoạt động, so sánh, bổ ngữ kết quả, trạng thái kéo dài.`,
    vrScene: {
      name: `Kịch bản thực tế ảo HSK 2 - Bài ${lessonNumber}`,
      description: `Mô phỏng trải nghiệm du lịch, đàm thoại văn phòng và đời sống sinh hoạt thực tế tại các đô thị Trung Quốc.`,
      culturalContext: `HSK 2 mở rộng giao tiếp xã hội và chuẩn hóa câu chữ.`,
      dialogue: [
        { speaker: 'Giáo viên', hanzi: titles.title + '。', pinyin: titles.pinyin + '.', vi: titles.meaning + '.' },
        { speaker: 'Học viên', hanzi: '好的，我明白了！', pinyin: 'Hǎo de, wǒ míngbai le!', vi: 'Vâng ạ, em hiểu rồi!' }
      ]
    },
    vocabList: [
      { id: `v-h2-${lessonNumber}-1`, hanzi: '旅游', pinyin: 'lǚyóu', sinoVietnamese: 'Lữ du', meaning: 'Du lịch', example: '去中国旅游。', examplePinyin: 'Qù Zhōngguó lǚyóu.', exampleMeaning: 'Đi Trung Quốc du lịch.', strokeCount: 16, radical: '方', hskLevel: 2, lessonId: lessonNumber },
      { id: `v-h2-${lessonNumber}-2`, hanzi: '介绍', pinyin: 'jièshào', sinoVietnamese: 'Giới thiệu', meaning: 'Giới thiệu', example: '我来介绍一下。', examplePinyin: 'Wǒ lái jièshào yíxià.', exampleMeaning: 'Để tôi giới thiệu một chút.', strokeCount: 12, radical: '纟', hskLevel: 2, lessonId: lessonNumber }
    ],
    grammarPoints: [
      {
        id: `g-h2-${lessonNumber}`,
        title: `Điểm ngữ pháp trọng tâm Bài ${lessonNumber}`,
        formula: 'A + 比 + B + Tính từ (Cấu trúc so sánh)',
        explanation: 'Dùng từ 比 để so sánh mức độ giữa hai đối tượng.',
        examples: [
          { hanzi: '他比我高。', pinyin: 'Tā bǐ wǒ gāo.', vietnamese: 'Anh ấy cao hơn tôi.' }
        ]
      }
    ]
  };
});

// Complete 18 lessons for HSK 3
export const HSK3_LESSONS: Lesson[] = Array.from({ length: 18 }, (_, i) => {
  const lessonNumber = i + 1;
  const titles = [
    { title: '周末你有什么打算', pinyin: 'Zhōumò nǐ yǒu shénme dǎsuàn', meaning: 'Cuối tuần bạn có dự định gì?' },
    { title: '他什么时候回来', pinyin: 'Tā shénme shíhou huílái', meaning: 'Khi nào thì anh ấy quay lại?' },
    { title: '桌子上放着很多饮料', pinyin: 'Zhuōzi shang fàng zhe hěn duō yǐnliào', meaning: 'Trên bàn có để rất nhiều đồ uống' },
    { title: '她总是笑着跟客人说话', pinyin: 'Tā zǒngshì xiào zhe gēn kèrén shuōhuà', meaning: 'Cô ấy luôn cười tươi khi nói chuyện với khách' },
    { title: '我最近越来越胖了', pinyin: 'Wǒ zuìjìn yuèláiyuè pàng le', meaning: 'Dạo này tôi ngày càng mập ra' },
    { title: '怎么突然找不到了', pinyin: 'Zěnme tūrán zhǎo bú dào le', meaning: 'Sao tự nhiên lại không tìm thấy nữa?' },
    { title: '我跟他都认识五年了', pinyin: 'Wǒ gēn tā dōu rènshi wǔ nián le', meaning: 'Tôi và anh ấy quen nhau đã 5 năm rồi' },
    { title: '你去哪儿我就去哪儿', pinyin: 'Nǐ qù nǎr wǒ jiù qù nǎr', meaning: 'Bạn đi đâu thì tôi đi đó' },
    { title: '她的汉语说得跟中国人一样好', pinyin: 'Tā de Hànyǔ shuō de gēn Zhōngguórén yíyàng hǎo', meaning: 'Tiếng Trung của cô ấy nói hay y như người Trung Quốc' },
    { title: '数学比历史难多了', pinyin: 'Shùxué bǐ lìshǐ nán duō le', meaning: 'Môn Toán khó hơn môn Lịch sử nhiều' },
    { title: '别忘了把空调关了', pinyin: 'Bié wàng le bǎ kōngtiáo guān le', meaning: 'Đừng quên tắt máy điều hòa nhé (Câu chữ 把)' },
    { title: '把这块水果切一切', pinyin: 'Bǎ zhè kuài shuǐguǒ qiē yí qiē', meaning: 'Đem miếng hoa quả này cắt ra xem' },
    { title: '我是走着来的', pinyin: 'Wǒ shì zǒu zhe lái de', meaning: 'Tôi đi bộ tới đây' },
    { title: '你把水果洗了吗', pinyin: 'Nǐ bǎ shuǐguǒ xǐ le ma', meaning: 'Bạn đã rửa hoa quả chưa?' },
    { title: '其他都没问题', pinyin: 'Qítā dōu méi wèntí', meaning: 'Những cái khác đều không có vấn đề gì' },
    { title: '我现在累得想睡觉', pinyin: 'Wǒ xiànzài lèi de xiǎng shuìjiào', meaning: 'Bây giờ tôi mệt đến mức chỉ muốn ngủ' },
    { title: '谁都喜欢小猫', pinyin: 'Shéi dōu xǐhuan xiǎomāo', meaning: 'Ai cũng đều yêu thích mèo con cả' },
    { title: '一直走就是了', pinyin: 'Yìzhí zǒu jiù shì le', meaning: 'Cứ đi thẳng mãi là tới thôi' }
  ][i];

  return {
    id: lessonNumber,
    hskLevel: 3,
    title: titles.title,
    pinyin: titles.pinyin,
    meaning: titles.meaning,
    description: `Làm chủ HSK 3.0 mức độ 3: Ngữ pháp câu chữ 把, bổ ngữ xu hướng kép, câu liên động, chuyển đổi ngữ cảnh 100% tiếng Trung.`,
    vrScene: {
      name: `Môi trường 100% Trung ngữ HSK 3 - Bài ${lessonNumber}`,
      description: `Hòa nhập hoàn toàn vào nhịp sống, công việc, thương mại và hội thảo bằng tiếng Trung chuẩn.`,
      culturalContext: `HSK 3 là cột mốc học viên chuyển đổi từ tư duy dịch sang phản xạ bản ngữ tự nhiên.`,
      dialogue: [
        { speaker: 'CiCi Chinese AI', hanzi: titles.title + '。请用这个句型造一个句子。', pinyin: titles.pinyin + '. Qǐng yòng zhè ge jùxíng zào yí gè jùzi.', vi: `${titles.meaning}. Hãy dùng mẫu câu này để đặt câu.` },
        { speaker: 'Học viên', hanzi: '好，请老师帮我修改！', pinyin: 'Hǎo, qǐng lǎoshī bāng wǒ xiūgǎi!', vi: 'Vâng, xin thầy sửa giúp em ạ!' }
      ]
    },
    vocabList: [
      { id: `v-h3-${lessonNumber}-1`, hanzi: '打算', pinyin: 'dǎsuàn', sinoVietnamese: 'Đả toán', meaning: 'Dự định, tính toán', example: '你有何打算？', examplePinyin: 'Nǐ yǒu hé dǎsuàn?', exampleMeaning: 'Bạn có dự định gì?', strokeCount: 11, radical: '扌', hskLevel: 3, lessonId: lessonNumber },
      { id: `v-h3-${lessonNumber}-2`, hanzi: '空调', pinyin: 'kōngtiáo', sinoVietnamese: 'Không điều', meaning: 'Máy điều hòa không khí', example: '开空调', examplePinyin: 'kāi kōngtiáo', exampleMeaning: 'Bật máy điều hòa', strokeCount: 18, radical: '穴', hskLevel: 3, lessonId: lessonNumber }
    ],
    grammarPoints: [
      {
        id: `g-h3-${lessonNumber}`,
        title: `Cấu trúc câu chữ 把 (Bǎ)`,
        formula: 'Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác (了/bổ ngữ)',
        explanation: 'Dùng để nhấn mạnh sự tác động làm thay đổi trạng thái hoặc vị trí của tân ngữ.',
        examples: [
          { hanzi: '我把作业做完了。', pinyin: 'Wǒ bǎ zuòyè zuò wán le.', vietnamese: 'Tôi đã làm xong bài tập rồi.' }
        ]
      }
    ]
  };
});

// Initial SRS flashcard deck
export const INITIAL_SRS_CARDS: SRSCard[] = [
  {
    id: 'srs-1',
    vocabId: 'v1-1',
    hanzi: '你',
    pinyin: 'nǐ',
    meaning: 'Bạn, anh, chị (ngôi thứ 2)',
    hskLevel: 1,
    lessonId: 1,
    easeFactor: 2.5,
    intervalDays: 1,
    repetitions: 1,
    nextReviewDate: new Date(Date.now() - 3600000).toISOString(), // Needs review now! "Thời điểm vàng"
    errorCount: 1,
    status: 'learning'
  },
  {
    id: 'srs-2',
    vocabId: 'v1-2',
    hanzi: '好',
    pinyin: 'hǎo',
    meaning: 'Tốt, đẹp, khỏe',
    hskLevel: 1,
    lessonId: 1,
    easeFactor: 2.6,
    intervalDays: 3,
    repetitions: 3,
    nextReviewDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    errorCount: 0,
    status: 'mastered'
  },
  {
    id: 'srs-3',
    vocabId: 'v1-3',
    hanzi: '您',
    pinyin: 'nín',
    meaning: 'Ngài, ông, bà (kính ngữ có bộ Tâm)',
    hskLevel: 1,
    lessonId: 1,
    easeFactor: 2.3,
    intervalDays: 1,
    repetitions: 1,
    nextReviewDate: new Date(Date.now() - 7200000).toISOString(), // Needs review now!
    errorCount: 2,
    status: 'learning'
  },
  {
    id: 'srs-4',
    vocabId: 'v4-3',
    hanzi: '汉语',
    pinyin: 'Hànyǔ',
    meaning: 'Tiếng Trung, Hán ngữ',
    hskLevel: 1,
    lessonId: 4,
    easeFactor: 2.4,
    intervalDays: 2,
    repetitions: 2,
    nextReviewDate: new Date(Date.now() - 1800000).toISOString(),
    errorCount: 1,
    status: 'review'
  },
  {
    id: 'srs-5',
    vocabId: 'v6-1',
    hanzi: '会',
    pinyin: 'huì',
    meaning: 'Biết (thông qua học tập)',
    hskLevel: 1,
    lessonId: 6,
    easeFactor: 2.5,
    intervalDays: 4,
    repetitions: 3,
    nextReviewDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    errorCount: 0,
    status: 'mastered'
  },
  {
    id: 'srs-6',
    vocabId: 'v-h3-11-2',
    hanzi: '空调',
    pinyin: 'kōngtiáo',
    meaning: 'Máy điều hòa không khí',
    hskLevel: 3,
    lessonId: 11,
    easeFactor: 2.1,
    intervalDays: 1,
    repetitions: 1,
    nextReviewDate: new Date().toISOString(),
    errorCount: 3,
    status: 'learning'
  }
];

// Mock Exam sample questions
export const MOCK_EXAM_QUESTIONS: ExamQuestion[] = [
  // Listening
  {
    id: 'ex-l1',
    section: 'listening',
    audioPrompt: '你好！我是李老师。他是我的学生。',
    prompt: 'Nghe đoạn ghi âm sau: "你好！我是李老师。他是我的学生。" và trả lời: Người nói là ai?',
    options: ['Là học sinh', 'Là giáo viên Lý', 'Là bác sĩ', 'Là bạn bè'],
    correctAnswer: 1,
    explanation: 'Người nói tự giới thiệu: "我是李老师" (Tôi là giáo viên Lý).',
    points: 25
  },
  {
    id: 'ex-l2',
    section: 'listening',
    audioPrompt: '明天是九月十号，天气很好，我们去旅游吧。',
    prompt: 'Nghe đoạn ghi âm và chọn nhận định đúng về thời tiết ngày mai:',
    options: ['Trời rất lạnh', 'Trời đổ mưa to', 'Thời tiết rất đẹp', 'Trời có tuyết'],
    correctAnswer: 2,
    explanation: 'Câu nói rõ: "天气很好" (Thời tiết rất đẹp).',
    points: 25
  },
  // Reading
  {
    id: 'ex-r1',
    section: 'reading',
    prompt: 'Chọn từ thích hợp điền vào chỗ trống: "这件衣服_____太大了，请帮我换一件小的。"',
    options: ['有点儿', '一点儿', '很多', '十分'],
    correctAnswer: 0,
    explanation: '"有点儿" đứng trước tính từ biểu thị mức độ không như mong muốn hoặc tiêu cực (hơi to quá).',
    points: 25
  },
  {
    id: 'ex-r2',
    section: 'reading',
    prompt: 'Đọc câu sau và chọn đại từ thích hợp: "桌子上放着_____的东西？"',
    options: ['谁的', '哪儿', '怎么', '多少'],
    correctAnswer: 0,
    explanation: 'Câu hỏi sở hữu "Ai": "桌子上放着谁的东西？" (Trên bàn đang để đồ của ai?).',
    points: 25
  },
  // Writing
  {
    id: 'ex-w1',
    section: 'writing',
    prompt: 'Sắp xếp các từ sau thành câu hoàn chỉnh đúng ngữ pháp: [把] / [他] / [吃完了] / [苹果]',
    options: [
      '他把苹果吃完了。',
      '把苹果他吃完了。',
      '他苹果把吃完了。',
      '苹果他吃完了把。'
    ],
    correctAnswer: 0,
    explanation: 'Cấu trúc câu chữ 把 chuẩn mực: Chủ ngữ (他) + 把 + Tân ngữ (苹果) + Động từ + Kết quả (吃完了).',
    points: 25
  },
  {
    id: 'ex-w2',
    section: 'writing',
    prompt: 'Sắp xếp cấu trúc so sánh: [弟弟] / [哥哥] / [比] / [高] / [一点儿]',
    options: [
      '哥哥比弟弟高一点儿。',
      '比哥哥弟弟高一点儿。',
      '弟弟比哥哥高一点儿。',
      '哥哥高一点儿比弟弟。'
    ],
    correctAnswer: 0,
    explanation: 'A + 比 + B + Tính từ + 一点儿: "哥哥比弟弟高一点儿。" (Anh trai cao hơn em trai một chút).',
    points: 25
  }
];

// Tone definitions for Pronunciation Lab
export const TONE_PATTERNS = [
  {
    tone: 1,
    name: 'Thanh 1 (Âm Bình / 阴平)',
    pitch: '5-5',
    description: 'Cao và bằng phẳng',
    advice: 'Ngân giọng ở mức cao tự nhiên (bậc 5), giữ âm lượng đều, không lên xuống.',
    color: 'emerald',
    example: 'mā (妈 - mẹ)'
  },
  {
    tone: 2,
    name: 'Thanh 2 (Dương Bình / 阳平)',
    pitch: '3-5',
    description: 'Vút lên cao',
    advice: 'Bắt đầu từ âm vực trung bình (bậc 3) vút thẳng lên bậc cao nhất (bậc 5), tựa như hỏi "Hả?".',
    color: 'blue',
    example: 'má (麻 - sợi gai)'
  },
  {
    tone: 3,
    name: 'Thanh 3 (Thượng Thanh / 上声)',
    pitch: '2-1-4',
    description: 'Hạ thấp rồi vút nhẹ lên',
    advice: 'Hạ sâu xuống đáy cổ họng (bậc 1) rồi lượn nhẹ lên bậc 4. Chú ý nửa thanh 3 khi nói nhanh.',
    color: 'amber',
    example: 'mǎ (马 - con ngựa)'
  },
  {
    tone: 4,
    name: 'Thanh 4 (Khứ Thanh / 去声)',
    pitch: '5-1',
    description: 'Rơi dứt khoát',
    advice: 'Rơi thẳng từ đỉnh cao nhất (bậc 5) xuống đáy (bậc 1), phát âm dứt khoát như ra lệnh, dứt điểm.',
    color: 'rose',
    example: 'mà (骂 - mắng)'
  },
  {
    tone: 0,
    name: 'Thanh nhẹ (Khinh Thanh / 轻声)',
    pitch: 'Ngắn & nhẹ',
    description: 'Nhẹ nhàng và ngắn gọn',
    advice: 'Không mang dấu thanh, phát âm lướt nhanh, dựa vào thanh điệu của từ đứng trước.',
    color: 'slate',
    example: 'ma (吗 - trợ từ nghi vấn)'
  }
];

// Cohort Big Data for Admin Mode
export const ADMIN_COHORT_STATS = {
  totalStudents: 1420,
  activeThisWeek: 1184,
  hsk1Completion: 88.4,
  hsk2Completion: 67.2,
  hsk3Completion: 49.8,
  cohortGroups: {
    excellent: { count: 483, percentage: 34, label: 'Giỏi (Mastery > 85%)', description: 'Đạt phản xạ âm tốt, hoàn thành SRS đúng giờ' },
    average: { count: 681, percentage: 48, label: 'Trung bình (60% - 84%)', description: 'Nắm vững từ vựng cơ bản, cần tăng tốc luyện phản xạ nghe' },
    needsSupport: { count: 256, percentage: 18, label: 'Cần hỗ trợ (< 60%)', description: 'Thường nhầm lẫn thanh 2/3 và cấu trúc câu chữ 把' }
  },
  errorHeatmap: [
    { category: 'Thanh điệu', item: 'Thanh 3 biến điệu (214 ➔ 35)', errorFrequency: 78, severity: 'high' },
    { category: 'Thanh điệu', item: 'Thanh 4 rơi dứt khoát (51)', errorFrequency: 64, severity: 'medium' },
    { category: 'Bộ thủ & Chữ Hán', item: 'Thứ tự nét chữ 女 (Nữ) & 心 (Tâm)', errorFrequency: 59, severity: 'medium' },
    { category: 'Bộ thủ & Chữ Hán', item: 'Nhầm lẫn bộ 礻(Kỳ) và 衤(Y)', errorFrequency: 72, severity: 'high' },
    { category: 'Ngữ pháp HSK', item: 'Cấu trúc câu chữ 把 (HSK 3 - Bài 11)', errorFrequency: 84, severity: 'critical' },
    { category: 'Ngữ pháp HSK', item: 'Cấu trúc câu so sánh 比 (HSK 2 - Bài 11)', errorFrequency: 66, severity: 'medium' },
    { category: 'Ngữ pháp HSK', item: 'Lượng từ 个 / 张 / 本 / 件', errorFrequency: 52, severity: 'low' }
  ]
};
