import hashlib
import typing


def get_hashed_percentage_for_object_ids(
    object_ids: typing.Iterable[str], iterations: int = 1
) -> float:

    params = ','.join(id_ for id_ in object_ids)
    to_hash = ''.join(params for i in range(iterations))
    hashed_value = hashlib.md5(to_hash.encode("utf-8"))
    hashed_value_as_int = int(hashed_value.hexdigest(), base=16)
    value = ((hashed_value_as_int % 9999) / 9998) * 100

    if value == 100:
        return get_hashed_percentage_for_object_ids(
            object_ids=object_ids, iterations=iterations + 1
        )

    return value



