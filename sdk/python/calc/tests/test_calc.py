import unittest

from calc.operation import add, mul
from calc.geometry import triangle_area, rectangle_area


class TestFunctions(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(1, 2), 3)
        self.assertEqual(add(-1, 1), 0)

    def test_mul(self):
        self.assertEqual(mul(2, 3), 6)
        self.assertEqual(mul(4, 5), 20)

    def test_triangle_area(self):
        self.assertEqual(triangle_area(4, 4), 8)
        self.assertEqual(triangle_area(10, 2), 10)

    def test_rectangel_area(self):
        self.assertEqual(rectangle_area(5, 6), 30)
        self.assertEqual(rectangle_area(2, 7), 14)


if __name__ == '__main__':
    unittest.main()