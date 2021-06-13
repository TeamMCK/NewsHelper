import MeCab
import numpy as np
import csv

termlist = []
with open("/Users/eunseopark/Documents/GitHub/newshelper/clean_front.csv", encoding = 'cp949') as file:
    for line in file.readlines():
        termlist.append(line.split(','))

#print(termlist)

termarray = np.array([])

termarray = termlist[0]
#print(termarray)
def remove(listname, val):
    return [value for value in listname if value != val]
def morph(rawlist):
    mecab = MeCab.Tagger()
    mecabarray = [['a'for col in range(10)]for row in range(len(rawlist))]
    for i in range(len(rawlist)):
         temp = mecab.parse(rawlist[i])
         temparray = temp.split('\n')
         #print(temp)
         mecabarray[i] = temparray
    #print(len(mecabarray), len(mecabarray[0]),len(mecabarray[1]))

    mormarray = []
    for i in range(len(mecabarray)):
        for j in range(len(mecabarray[i])):
            temp = mecabarray[i][j].split('\t')
            mormarray.append(temp[0])

    for i in range(len(mormarray)):
        if mormarray[i] == '' or ('EOS' in mormarray[i]):
            mormarray[i]='x'
            #print(mormarray[i])
    #print(mormarray[1], type(mormarray[1]))
    mormarray = remove(mormarray, 'x')
    #print(mormarray)

    return mormarray

mormarray = morph(termarray)
with open("/Users/eunseopark/Documents/GitHub/newshelper/mecaboutput.csv", 'w', encoding='cp949', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(mormarray)

