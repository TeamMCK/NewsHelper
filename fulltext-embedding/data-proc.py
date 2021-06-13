import re
import os
import json
from reader import DataReader, DataWriter
from preproc import Preprocessor
from konlpy.tag import Okt

# filter only `politics` topic
files = os.listdir('data/org')
for file in files:
    with open(f"data/org/{file}", encoding='utf-8') as doc:
        parsed = json.load(doc)
        filtered_doc = []
        for article in parsed["document"]:
            topic = article["metadata"]["topic"]
            if topic == "정치":
                filtered_doc.append(article)
        print(len(filtered_doc))
        with open(f"data/filtered/{file}", encoding='utf-8', mode='w') as doc:
            json.dump(filtered_doc, doc, ensure_ascii=False, indent=4)


class FulltextStrategy:
    def __init__(self):
        pass

    def filter(self):
        pass


class NaiveFinder(FulltextStrategy):
    def filter(self, text):
        cite_ptr = re.compile('".+"(?=(고|라고|며|이고|라며|이라며|이라고|라는))')
        result = cite_ptr.search(text)
        if result is None:
            return None
        else:
            return result.group()

class FulltextOnlyFinder(FulltextStrategy):
    def filter(self, text):
        ft_ptr = re.compile('\[전문\]')
        result = ft_ptr.search(text)
        if result is None:
            return False
        else:
            return True

def find_cited():
    finder = NaiveFinder()
    read = DataReader(root='data/org')
    write = DataWriter()
    for docs in read.on_every_documents():
        fulltext_doc = []
        for article in docs["document"]:
            cited_paragraph = []
            if article["metadata"]["topic"].find("정치") is -1 and article["metadata"]["original_topic"].find("정치") is -1:
                continue
            for index, paragraph in enumerate(article["paragraph"]):
                filtered = finder.filter(paragraph["form"])
                if filtered is not None:
                    cited_paragraph.append({"id": paragraph["id"], "form": filtered})
            article["title"] = article["paragraph"][0]["form"]
            article["paragraph"] = cited_paragraph
            fulltext_doc.append(article)
        write.write_docs(fulltext_doc, f'data/cited/{docs["id"]}.json')

def find_fulltext():
    finder = FulltextOnlyFinder()
    read = DataReader(root='data/org')
    write = DataWriter()
    for docs in read.on_every_documents():
        fulltext_doc = []
        for article in docs["document"]:
            for paragraph in article["paragraph"]:
                is_fulltext = finder.filter(paragraph["form"])
                if is_fulltext:
                    fulltext_doc.append(article)
                    break
        write.write_docs(fulltext_doc, f'data/real_fulltext/{docs["id"]}.json')


def tokenize():
    read = DataReader(root='data/removeverbose')
    write = DataWriter()
    preproc = Preprocessor()
    okt = Okt()
    for docs, fn in read.on_every_documents():
        for article in docs:
            for paragraph in article["paragraph"]:
                tokens = preproc.filter_stopwords(okt.nouns(paragraph["form"]))
                paragraph["tokens"] = tokens
        write.write_docs(docs, f'data/tokens/{fn}.json')
        print(f'data/tokens/{fn}.json ok')

# read = DataReader(root='data/real_fulltext')
# total = 0
# for docs in read.on_every_documents():
#     total += len(docs)
# print(total)
