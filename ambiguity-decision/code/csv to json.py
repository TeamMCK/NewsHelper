import csv
import json

# with open('C:\\Users\\Eunseo\\Documents\\GitHub\\newshelper\\ambiguity_dictionary_with_reason.csv','r', encoding='utf8') as f:
#     reader = csv.DictReader(f)
#     rows = list(reader)
# print(rows)
# with open('C:\\Users\\Eunseo\\Documents\\GitHub\\newshelper\\ambiguity_dict_with_reason.json', 'w', encoding='utf8')as f:
#     json.dump(rows,f, ensure_ascii=False)
# with open('C:\\Users\\Eunseo\\Documents\\GitHub\\newshelper\\ambiguity_dict_with_reason.json', 'r', encoding='utf8') as dictfile:
#     # for line in dictfile.readlines():
#     #     raw_dictionary.append(line.split(','))
#     dict_file = json.load(dictfile)
# print(type(dict_file[0]))
# dictionary =[]
# #= raw_dictionary[0]
# for key in dict_file[0].keys():
#     dictionary.append(key)
#
# print(dictionary)
#
#
# dict={
#     "ambiguity": True,
#     "percentage": 0,
#     "sentence": {
#         "모호한 문장 1": "모호한 이유",
#         "모호한 문장 2": "모호한 이유",
#         "모호한 문장 3": "모호한 이유"
#     }
# }

temp = {"sentence":"hi", "reason":""}

print(temp)