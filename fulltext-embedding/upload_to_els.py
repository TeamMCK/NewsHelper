import requests
from elasticsearch import Elasticsearch
from elasticsearch import helpers
from requests.auth import HTTPBasicAuth
from reader import DataReader

end_point = 'https://search-newshelper-4535wxcp5tozzmbtzjsbdkd3ee.ap-northeast-2.es.amazonaws.com'

def create_index():
    headers = {'Content-Type': 'application/json'}
    els = Elasticsearch(hosts=end_point, http_auth=('root', 'Qwer@1234'))
    data = {
        "settings": {},
        "mappings": {
            "properties": {
                "id": {"type": "text" },
                "metadata": { "type": "nested" },
                "title": {"type": "text"},
                "paragraph": {"type": "nested" }
            }
        }
    }
    ret = els.indices.create('fulltext',body=data)
    return ret

def post_docs():
    els = Elasticsearch(hosts=end_point, http_auth=('root', 'Qwer@1234'))
    for ok in helpers.streaming_bulk(els, doc_generator(), raise_on_error=False):
        if not ok:
            print('NOT INDEXED')


def doc_generator():
    reader = DataReader(root='data/cited')
    for docs in reader.on_every_documents():
        for doc in docs:
            yield {"_index": "fulltext",
                   "_id": doc['id'],
                   "_source": doc
                   }

#print(create_index())
print(post_docs())
