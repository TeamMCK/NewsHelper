import json
import numpy as np
with open('C:\\Users\\Eunseo\\Documents\\GitHub\\newshelper\\news_data\\NIRW1900000001.json', encoding='UTF8') as json_file:
    json_data = json.load(json_file)
    raw_paragraph=np.array([])

    for i in range(len(json_data)):
        each_sentence = json_data[i]
        # print(each_sentence)
        para = each_sentence['paragraph']
        raw_paragraph=np.append(raw_paragraph, np.asarray(para))
f = open("C:\\Users\\Eunseo\\Documents\\GitHub\\newshelper\\sentence_sample.txt", 'w')
sentence_list=np.array([])
for i in range(len(raw_paragraph)):
    sentence = raw_paragraph[i]['form']
    sentence = sentence + "\n"
    f.write(sentence)
f.close()




