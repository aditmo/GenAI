# myapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TableViewSet, generate_sql_query
from .views import home


router = DefaultRouter()
router.register(r'', TableViewSet, basename='table')

urlpatterns = [
    path('',home, name='home'),
    path('tables/', include(router.urls)),
    path('generate_sql_query/', generate_sql_query, name='generate_sql_query'),
]
