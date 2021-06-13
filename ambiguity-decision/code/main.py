import numpy as np

A = np.array(([1,2,3,1,5,6,7,8,9]))

index=(np.where(A==1))
print(index[0][0])
print(A[index[0]])