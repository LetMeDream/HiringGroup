# En api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioListCreateView, UsuarioDetailView, UsuarioLoginView, EmpresaListCreateView, actualizar_datos_empresa,
    OfertaListCreateView, OfertaListView, PostulacionCreateView, OfertaPostulacionesListView,
    PostulacionContratarView, PostulacionRechazarView, PostulacionDeleteView, ContratacionCreateView, 
    UsuarioPostulacionesView, UsuarioContratacionStatusView, OfertaViewSet, EmpresaStatsView, CandidatoProfileView,
    ExperienciaLaboralCreateView, ExperienciaLaboralUpdateView, ExperienciaLaboralDeleteView,
    InformacionPersonalCreateView, InformacionPersonalUpdateView, InformacionPersonalDeleteView, InformacionPersonalListView
)

# Configurar el router para ViewSets
router = DefaultRouter()
router.register(r'ofertas-viewset', OfertaViewSet)

urlpatterns = [
    # Incluir rutas del router
    path('', include(router.urls)),
    
    # Rutas para el modelo Usuario
    path('usuarios/', UsuarioListCreateView.as_view(), name='usuario-list-create'),
    path('usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuario-detail'),
    path('usuarios/<int:pk>/postulaciones/', UsuarioPostulacionesView.as_view(), name='usuario-postulaciones'),
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
    # Cancelar postulación
    path('postulaciones/<int:postulacion_id>/', PostulacionDeleteView.as_view(), name='postulacion-delete'),
    # Contrataciones
    path('contrataciones/', ContratacionCreateView.as_view(), name='contratacion-create'),
    path('usuarios/<int:user_id>/contratacion-status/', UsuarioContratacionStatusView.as_view()),
    # Estadísticas de empresa
    path('empresas/<int:user_id>/stats/', EmpresaStatsView.as_view(), name='empresa-stats'),
    # Perfil de candidato
    path('candidato-profile/', CandidatoProfileView.as_view(), name='candidato-profile-create'),
    path('candidato-profile/<int:user_id>/', CandidatoProfileView.as_view(), name='candidato-profile-detail'),
    # Experiencias laborales CRUD
    path('experiencias/', ExperienciaLaboralCreateView.as_view(), name='experiencia-create'),
    path('experiencias/<int:experiencia_id>/update/', ExperienciaLaboralUpdateView.as_view(), name='experiencia-update'),
    path('experiencias/<int:experiencia_id>/delete/', ExperienciaLaboralDeleteView.as_view(), name='experiencia-delete'),
    # Información personal CRUD
    path('informacion-personal/', InformacionPersonalCreateView.as_view(), name='info-personal-create'),
    path('informacion-personal/<int:info_id>/update/', InformacionPersonalUpdateView.as_view(), name='info-personal-update'),
    path('informacion-personal/<int:info_id>/delete/', InformacionPersonalDeleteView.as_view(), name='info-personal-delete'),
    path('candidato-profile/<int:user_id>/informacion-personal/', InformacionPersonalListView.as_view(), name='info-personal-list'),
]