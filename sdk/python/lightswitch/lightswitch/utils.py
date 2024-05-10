import hashlib
import typing



def get_hashed_percentage_for_object_ids(
    object_ids: typing.Iterable[str], iterations: int = 1
) -> float:
    """
    Given a list of object ids, get a floating point number between 0 (inclusive) and
    100 (exclusive) based on the hash of those ids. This should give the same value
    every time for any list of ids.

    :param object_ids: list of object ids to calculate the hash for
    :param iterations: num times to include each id in the generated string to hash
    :return: (float) number between 0 (inclusive) and 100 (exclusive)
    """

    to_hash = ",".join(str(id_) for id_ in list(object_ids) * iterations)
    print("to_hash : ", to_hash)
    hashed_value = hashlib.md5(to_hash.encode("utf-8"))
    hashed_value_as_int = int(hashed_value.hexdigest(), base=16)
    value = ((hashed_value_as_int % 9999) / 9998) * 100

    if value == 100:
        # since we want a number between 0 (inclusive) and 100 (exclusive), in the
        # unlikely case that we get the exact number 100, we call the method again
        # and increase the number of iterations to ensure we get a different result
        return get_hashed_percentage_for_object_ids(
            object_ids=object_ids, iterations=iterations + 1
        )

    return value




print(get_hashed_percentage_for_object_ids(["123", "new_feature"]))
print(get_hashed_percentage_for_object_ids(["123", "new_feature2"]))

print(get_hashed_percentage_for_object_ids(["1", "AFlag"]))  # 93.99879975995199
print(get_hashed_percentage_for_object_ids(['1', 'AFlag'], 2))  # 18.52370474094819
print(get_hashed_percentage_for_object_ids(['2', 'AFlag'], 1))  # 65.5631126225245
print(get_hashed_percentage_for_object_ids(['2', 'BFlag'], 1))  # 38.817763552710545
print(get_hashed_percentage_for_object_ids(['3', 'AFlag'], 1))  # 89.22784556911381
print(get_hashed_percentage_for_object_ids(['3', 'AFlag'], 2))  # 16.093218643728747
print(get_hashed_percentage_for_object_ids(['1', 'BFlag'], 1))  # 39.9379875975195
print(get_hashed_percentage_for_object_ids(['2', 'CFlag'], 1))  # 26.585317063412685
print(get_hashed_percentage_for_object_ids(['3', 'CFlag'], 2))  # 56.34126825365073
print(get_hashed_percentage_for_object_ids(['4', 'ABCFlag'], 5))  # 5.171034206841369
