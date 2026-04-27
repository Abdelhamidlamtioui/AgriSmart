"""AgroSmart API - URL Configuration"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'regions', views.RegionViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'clients', views.ClientViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'users', views.UserManagementViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/kpis/', views.dashboard_kpis, name='dashboard-kpis'),
    path('dashboard/sales-trends/', views.sales_trends, name='sales-trends'),
    path('ai/suggest/', views.ai_suggest, name='ai-suggest'),
    path('ai/chat/', views.ai_chat, name='ai-chat'),
    path('me/', views.current_user, name='current-user'),
]
