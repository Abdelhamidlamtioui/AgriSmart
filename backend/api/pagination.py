"""
AgroSmart - Custom pagination with dynamic page_size support.
"""
from rest_framework.pagination import PageNumberPagination


class FlexiblePagination(PageNumberPagination):
    """Allows the frontend to specify page_size via query parameter."""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
