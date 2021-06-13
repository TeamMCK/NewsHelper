from reader import DataReader, DataWriter
from konlpy.tag import Okt
from urllib import parse
import xml.etree.ElementTree as ET
from requests import get

okt = Okt()

family_name = {
    '김': 1,
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
    '차': 1
}

read = DataReader(root='data/politics_filtered')
write = DataWriter()
for docs, fn in read.on_every_documents():
    people_docs = []
    for article in docs:
        _dict = {}
        for par_pos, paragraph in enumerate(article["paragraph"]):
            if par_pos == 4: # parse only first 4 lines
                break
            pos_list = okt.pos(paragraph["form"])
            for word, pos in pos_list:
                if _dict.get(word) is None:
                    if len(word) == 3 and pos == 'Noun' and word[0] in family_name:
                        param = parse.urlencode({
                            'key': '3683361D58994954FAD56110288634B5',
                            'q': word
                        })
                        url = 'https://stdict.korean.go.kr/api/search.do?' + param
                        #resp = get(url)
                        _dict[word] = 1
                        # try:
                        #     root = ET.fromstring(resp.text)
                        #     if int(root.find("total").text) == 0:
                        #         _dict[word] = 1
                        # except:
                        #     pass
        del article["paragraph"]
        article["people"] = list(_dict.keys())
        people_docs.append(article)
    write.write_docs(people_docs , f'data/speaker/{fn}.json')
