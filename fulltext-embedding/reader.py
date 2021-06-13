import os
import json
import random
import regex


class DataReader:
    READ_FILES = 0x01
    READ_FILE = 0x02

    def __init__(self, mode=READ_FILES, root='', encoding='utf-8'):
        self.root = root
        self.encoding = encoding

    def on_every_paragraph(self):
        files = os.listdir(self.root)
        for file in files:
            with open(f"{self.root}/{file}", encoding=self.encoding) as doc:
                parsed = json.load(doc)
                for article in parsed["document"]:
                    for p in article["paragraph"]:
                        yield p["id"], p["tokens"], article["metadata"]

    def on_every_documents(self):
        files = os.listdir(self.root)
        for file in files:
            with open(f"{self.root}/{file}", encoding=self.encoding) as doc:
                parsed = json.load(doc)
                yield parsed, file

    def on_random_documents(self, mini_size=1000):
        files = os.listdir(self.root)
        for file in files:
            with open(f"{self.root}/{file}", encoding=self.encoding) as doc:
                parsed = json.load(doc)
                # randomly choose as mini_size
                temp_mini_size = mini_size
                if len(parsed) < temp_mini_size:
                    temp_mini_size = len(parsed)
                memo = {}
                for i in range(temp_mini_size):
                    if len(parsed) <= 1:
                        break
                    no = random.randint(0, len(parsed)-1)
                    if i < temp_mini_size:
                        memo[i] = True
                        yield parsed[no]


class DataWriter:
    def __init__(self, root='', encdoing='utf-8'):
        self.root = root

    def write_docs(self, obj, path):
        with open(path, encoding='utf-8', mode='w') as doc:
            json.dump(obj, doc, ensure_ascii=False, indent=4)
