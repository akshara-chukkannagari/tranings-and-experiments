import sys

list_eg = [1, 2, 3, "a", "b", "c", True, 3.14]
tuple_eg = (1, 2, 3, "a", "b", "c", True, 3.14)

print("List size = ", sys.getsizeof(list_eg))
print("Tuple size = ", sys.getsizeof(tuple_eg))
