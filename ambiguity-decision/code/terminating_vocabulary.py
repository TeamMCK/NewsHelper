import numpy as np
import csv

def terminate(filename):
    with open(filename, 'r', encoding='utf-16') as f:
        sentence_str=f.readlines()

    sentence_str=[line.rstrip('\n') for line in sentence_str]
    sentence_list=[]
    for i in range(len(sentence_str)):
        rows=sentence_str[i]
        str_rows="".join(sentence_str[i])
        sentence_list_each=str_rows.split(' ')
        sentence_list.append(sentence_list_each)
        #print(sentence_list)
        # print(type(str_rows))
    terminate_1=np.array([])
    # terminate_2=np.array([])
    # raw_paragraph=np.append(raw_paragraph, np.asarray(para))
    for i in range(len(sentence_list)):
        temp=sentence_list[i][0:-1]
        nptemp = np.asarray(temp)
        #print(nptemp[-3])
        #print(nptemp.shape)
        try:
            terminate_1=np.append(terminate_1, nptemp[-1])
        except:
            continue


    #print(terminate_1)
    return terminate_1
#print(terminate_1.shape)
#print(terminate_2)
# for i in range(1, 10):
#     print(str(i)+": \t"+sentence_list[i])

def terminate_file(inputfilename, outputfilename):
    terminate_1 = terminate(inputfilename)
    f = open("outputfilename", 'w', newline='')

    # for i in range(len(terminate_1)):
    term_list = terminate_1.tolist()
    writer = csv.writer(f)
    writer.writerow(terminate_1)
    f.close()

# terminate_1=terminate("C:\\Users\\Eunseo\\Documents\\GitHub\\newshelper\\temporary.txt")
# print(terminate_1)