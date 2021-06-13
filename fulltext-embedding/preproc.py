import os
import json
import konlpy
import re

stopwords = {
    '김': 1, # 성씨
    '이': 1,
    '박': 1,
    '최': 1,
    '정': 1,
    '강': 1,
    '윤': 1,
    '조': 1,
    '한': 1,
    '임': 1,
    '오': 1,
    '서': 1,
    '신': 1,
    '권': 1,
    '황': 1,
    '안': 1,
    '송': 1,
    '장': 1,
    '홍': 1,
    '고': 1,
    '문': 1,
    '양': 1,
    '손': 1,
    '배': 1,
    '백': 1,
    '유': 1,
    '남': 1,
    '노': 1,
    '하': 1,
    '곽': 1,
    '성': 1,
    '차': 1,
    '은': 1, # 조사
    '는': 1,
    '가': 1,
    '를': 1,
    '건': 1,# 의존 명사
    '것': 1,
    '대해': 1,
    '때문': 1,
    '나름': 1,
    '뿐': 1,
    '터': 1,
    '수': 1,
    '만큼': 1,
    '대로': 1,
    '듯': 1,
    '체': 1,
    '척': 1,
    '등': 1,
    '뻔': 1,
    '만': 1,
    '마리': 1,
    '켤레': 1,
    '데': 1,
    '그것': 1, # 지시 인칭 대명사
    '이것': 1,
    '저것': 1,
    '무엇': 1,
    '이곳': 1,
    '여기': 1,
    '저기': 1,
    '그곳': 1,
    '어디': 1,
    '거기': 1,
    '저': 1,
    '나': 1,
    '너': 1,
    '그들': 1,
    '우리': 1,
    '그대': 1,
    '님': 1,
    '당신': 1,
    '자기': 1,
    '누구': 1,
    '아무': 1,
    '씨': 1,
    '이런': 1, # 감탄사
    '어머': 1,
    '어휴': 1,
    '오호': 1,
    '아이고': 1,
    '아싸': 1,
    '더': 1, # 자주쓰이는 부사 형용사
    '많이': 1,
    '아주': 1,
    '그만': 1,
    '너무': 1,
    '라며': 1, # 기타
    '음': 1,
    '때': 1,
    '며': 1,
    '또한': 1,
    '다만': 1
}

class Preprocessor:
    def __init__(self):
        self.blacklist_pos = ['Josa', 'Number', 'Punctuation']

    def korean_token_only(self, tokens):
        r = []
        for word, pos in tokens:
            if pos in self.blacklist_pos:
                continue
            r.append(word)
            # yield word
        return r

    def filter_stopwords(self, tokens):
        filtered = []
        for token in tokens:
            if stopwords.get(token) is None:
                if len(token) > 1:
                    filtered.append(token)
        return filtered

    def filter_naive_token(self, tokens):
        cmp = re.compile('[가-힣0-9A-z ]+')
        r = []
        for word in tokens:
            if cmp.match(word) is not None:
                r.append(word)
        return r

    def remove_special_letter(text):
        white_list_ptr = re.compile('[가-힣A-z \"\',.?!0-9]+')
        filtered = white_list_ptr.findall(text)
        black_list_ptr = re.compile('(.+)')
        return filtered

def make_bulk_paragraph():
    files = os.listdir('data/removeverbose')
    bulk = ''
    for file in files:
        with open(f"data/removeverbose/{file}", encoding='utf-8') as doc:
            parsed = json.load(doc)
            for article in parsed:
                for p in article["paragraph"]:
                    yield p["form"]



