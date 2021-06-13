from gensim.models.doc2vec import TaggedDocument, Doc2Vec
import time
import json
import nltk
import os
from reader import DataReader
from konlpy.tag import Okt
from preproc import Preprocessor


class Doc2VecInput:
    def __init__(self, corpus):
        self.corpus= corpus
        self.preproc = Preprocessor()

    def __iter__(self):
        for article, _id in self.corpus:
            yield TaggedDocument(self.preproc.korean_token_only(article), tags=[f'{id}'])


class CorpusReader:
    def __init__(self):
        self.reader = DataReader(root='data/politics_filtered')
        self.tokenizer = Okt()

    def __iter__(self):
        for docs in self.reader.on_random_documents(10000):
            article = []
            for doc in docs:
                for p in doc["paragraph"]:
                    article += self.tokenizer.pos(p["form"])
                yield article, doc['id']


def train():
    corpus = CorpusReader()
    print('Reading Corpus Done')
    corpus = Doc2VecInput(corpus)
    print('Tagged Document Done')
    model = Doc2Vec(corpus, dm=1, vector_size=100)
    print('Doc2Vec Training Done')
    model.save(f'model/doc2vec_{time.time()}.model')

def evaluate():
    model = Doc2Vec.load('model/doc2vec_1619692589.339023.model')
    train = '박근혜 정부 청와대에서 세월호와 관련한 회의 내용이 빈번하게 기록되어 있다. 안종범 업무수첩과 김영한 업무일지를 비교 분석해보면, 박근혜 정부는 일관되게 세월호 참사의 책임을 회피했다.'
    infer = model.infer_vector(nltk.word_tokenize(train))
    print(infer)
    sims = model.dv.most_similar([infer], topn=10)
    print(sims)

train()
#evaluate()
# reader = DataReader(root='data/politics_filtered')
# #docs = list(reader.on_random_documents(10000))
# docs2 = list(reader.on_every_documents())
# #print(len(docs))
# print(len(docs2))