import requests
import time
import json
import re
from bs4 import BeautifulSoup
from selenium.webdriver import Chrome
from preproc import Preprocessor
from konlpy.tag import Okt

search_terms = ["이준석", "나경원"]
news_list = []
okt = Okt()
proc = Preprocessor()

chrome = Chrome(executable_path="chromedriver.exe")


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

total = 0
finder = NaiveFinder()
for term in search_terms:
    raw = requests.get(f"https://search.naver.com/search.naver?where=news&query={term}",
                       headers={'User-Agent': 'Mozilla/5.0'})
    html = BeautifulSoup(raw.text, "html.parser")

    articles = html.select("ul.list_news > li")
    for article in articles:
        link = str(article.select_one('a[href^="https://news.naver.com"]').get('href'))
        print(link)
        if link.startswith('https://news.naver.com'):
            chrome.get(link)
            body = chrome.find_element_by_css_selector("div#articleBodyContents").text
            title = chrome.find_element_by_css_selector("h3#articleTitle").text
            paras = []
            org = []
            for para in body.split('\n')[:-5]:
                if para != '':
                    filtered = finder.filter(para)
                    if filtered is not None:
                        paras.append({"form": filtered, "tokens": proc.filter_stopwords(okt.nouns(filtered))})
                    org.append({"form": para, "tokens": proc.filter_stopwords(okt.nouns(para))})
            news_list.append({
                "id": f"crawled_news_{total}",
                "paragraph": org,
                "title": title
            })

            time.sleep(1)
        total += 1

with open('data/tokens/test.json', mode='w', encoding='utf-8') as test:
    json.dump(news_list, test, ensure_ascii=False, indent=4)
