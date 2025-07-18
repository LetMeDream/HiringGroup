# En api/urls.py
from django.urls import path
from .views import UsuarioListCreateView, UsuarioDetailView, UsuarioLoginView, EmpresaListCreateView, actualizar_datos_empresa
from .views import OfertaListCreateView, OfertaListView, PostulacionCreateView, OfertaPostulacionesListView
from .views import PostulacionContratarView, PostulacionRechazarView

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
     # Contrataciones
    path('ofertas/<int:oferta_id>/postulaciones/', OfertaPostulacionesListView.as_view()),
    # Ofertas
    path('ofertas/<int:user_id>/', OfertaListCreateView.as_view()),
    path('ofertas/', OfertaListCreateView.as_view(), name='oferta-list-create'),
    # Listar ofertas activas
    path('ofertas_todas/', OfertaListView.as_view(), name='oferta-list'),
    # Postular
    path('postular/', PostulacionCreateView.as_view(), name='postulacion-create'),
    # Contratar o rechazar postulaciones
    path('postulaciones/<int:postulacion_id>/contratar/', PostulacionContratarView.as_view()),
    path('postulaciones/<int:postulacion_id>/rechazar/', PostulacionRechazarView.as_view()),
]