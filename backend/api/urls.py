# En api/urls.py
from django.urls import path
from .views import UsuarioListCreateView, UsuarioDetailView, UsuarioLoginView, EmpresaListCreateView, actualizar_datos_empresa
from .views import OfertaListCreateView

urlpatterns = [
    # Rutas para el modelo Usuario
    path('usuarios/', UsuarioListCreateView.as_view(), name='usuario-list-create'),
    path('usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuario-detail'),
    # ... otras rutas para tu API
    # Path de login
    path('login/', UsuarioLoginView.as_view(), name='usuario-login'),
    # Empresas
    path('empresas/', EmpresaListCreateView.as_view(), name='empresa-list-create'),
    path('empresas/<int:usuario_id>/actualizar/', actualizar_datos_empresa, name='empresa-actualizar'),
    # Ofertas
    path('ofertas/', OfertaListCreateView.as_view(), name='oferta-list-create'),
    path('ofertas/<int:user_id>/', OfertaListCreateView.as_view(), name='oferta-detail'),
]