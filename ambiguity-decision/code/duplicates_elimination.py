terminates_front = []
terminates_rear = []
with open('C:\\Users\\Eunseo\\Documents\\GitHub\\newshelper\\front_terminate.csv') as file:
    for line in file.readlines():
        terminates_front.append(line.split(','))

with open('C:\\Users\\Eunseo\\Documents\\GitHub\\newshelper\\terminates.csv') as file2:
    for line in file2.readlines():
        terminates_rear.append(line.split(','))

print(terminates_front)
print("hi")
print(terminates_rear)