# Vista para actualizar campos específicos de una empresa existente
from rest_framework.decorators import api_view
from django.shortcuts import render

# Create your views here.
# api/views.py

from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Usuario, Empresa, Oferta, Postulacion, Contratacion, Banco, CandidatoProfile, ExperienciaLaboral, InformacionPersonal
from .serializer import UserSerializer, UserRegisterSerializer, EmpresaSerializer, OfertaSerializer, PostulacionSerializer, ContratacionSerializer, CandidatoProfileSerializer, ExperienciaLaboralSerializer, InformacionPersonalSerializer

# ===================================================================
# Vistas Individuales para el modelo Usuario
# ===================================================================

class UsuarioListCreateView(APIView):
    """
    Vista para listar todos los usuarios existentes y para crear un nuevo usuario.
    - GET /api/usuarios/: Lista todos los usuarios.
    - POST /api/usuarios/: Crea un nuevo usuario.
    """

    def get(self, request, format=None):
        """
        Maneja la petición GET para listar todos los usuarios.
        """
        usuarios = Usuario.objects.all()
        serializer = UserSerializer(usuarios, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        """
        Maneja la petición POST para crear un nuevo usuario.
        Utiliza el serializer de registro.
        """
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # ← sin 'commit=False'
            response_data = UserRegisterSerializer(user).data
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsuarioDetailView(APIView):
    """
    Vista para obtener, actualizar o eliminar una instancia de Usuario.
    - GET /api/usuarios/<id>/: Obtiene un usuario.
    - PUT /api/usuarios/<id>/: Actualiza un usuario.
    - DELETE /api/usuarios/<id>/: Elimina un usuario.
    """

    def get_object(self, pk):
        """
        Método de ayuda para obtener un objeto Usuario por su clave primaria (pk)
        o devolver un error 404 si no se encuentra.
        """
        try:
            return Usuario.objects.get(pk=pk)
        except Usuario.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        """
        Obtiene y devuelve una única instancia de usuario.
        """
        usuario = self.get_object(pk)
        serializer = UserSerializer(usuario)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        """
        Actualiza una instancia de usuario.
        """
        usuario = self.get_object(pk)
        # Usamos el serializer estándar, no el de registro, para actualizaciones.
        # 'partial=True' permitiría actualizaciones parciales (PATCH).
        serializer = UserSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        """
        Elimina una instancia de usuario.
        """
        usuario = self.get_object(pk)
        usuario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

## Vista para el login de usuarios
class UsuarioLoginView(APIView):
    """
    Vista para manejar el login de usuarios.
    - POST /api/login/: Inicia sesión con las credenciales del usuario.
    """

    permission_classes = [AllowAny]  # Permite acceso a cualquier usuario

    def post(self, request, format=None):
        """
        Maneja la petición POST para iniciar sesión.
        Aquí deberías implementar la lógica de autenticación.
        """
        # Implementa la lógica de autenticación aquí
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not usuario.check_password(password):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            
        # Genera tokens
        refresh = RefreshToken.for_user(usuario)
        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": usuario.id,
                "username": usuario.nombre,
                "email": usuario.email,
                "role": usuario.role,
                "apellido": usuario.apellido,
                "telefono": usuario.telefono,
                "empresa": usuario.empresa.nombre if hasattr(usuario, 'empresa') else None
            }
        }, status=status.HTTP_200_OK)

# ===================================================================
# Vistas para el modelo Empresa
# ===================================================================
class EmpresaListCreateView(APIView):
    """
    Vista para listar todas las empresas y crear una nueva empresa.
    - GET /api/empresas/: Lista todas las empresas.
    - POST /api/empresas/: Crea una nueva empresa.
    """
    def get(self, request, format=None):
        """
        Maneja la petición GET para listar todas las empresas.
        """
        empresas = Empresa.objects.all()
        serializer = EmpresaSerializer(empresas, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        """
        Maneja la petición POST para crear una nueva empresa.
        """
        serializer = EmpresaSerializer(data=request.data)
        if serializer.is_valid():
            empresa = serializer.save()
            return Response(EmpresaSerializer(empresa).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
def actualizar_datos_empresa(request, usuario_id):
    """
    Actualiza persona_contacto, telefono_contacto y direccion de una empresa existente.
    """
    try:
        empresa = Empresa.objects.get(usuario_id=usuario_id)
    except Empresa.DoesNotExist:
        return Response({'error': 'Empresa no encontrada'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    campos_actualizados = False
    if 'nombre' in data:
        empresa.nombre = data['nombre']
        campos_actualizados = True
    if 'sector' in data:
        empresa.sector = data['sector']
        campos_actualizados = True
    if 'direccion' in data:
        empresa.direccion = data['direccion']
        campos_actualizados = True

    if campos_actualizados:
        empresa.save()
        return Response(EmpresaSerializer(empresa).data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'No se enviaron campos válidos para actualizar.'}, status=status.HTTP_400_BAD_REQUEST)


# ===================================================================
# Vistas para el modelo Oferta
# ===================================================================

class OfertaListCreateView(APIView):
    permission_classes = [AllowAny]

    # GET /api/ofertas/  --> Todas las ofertas activas
    def get(self, request, user_id=None):
        if user_id:
            # Ofertas de una empresa específica
            empresa = Empresa.objects.filter(usuario_id=user_id).first()
            if not empresa:
                return Response({'error': 'No tienes empresa asociada.'}, status=400)
            ofertas = Oferta.objects.filter(empresa=empresa)
        else:
            # Todas las ofertas activas
            ofertas = Oferta.objects.filter(activa=True)
        serializer = OfertaSerializer(ofertas, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        empresa = Empresa.objects.filter(usuario=data['usuario']).first()
        if not empresa:
            return Response({'error': 'Empresa no encontrada para el usuario proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la oferta manualmente usando el modelo
        try:
            oferta = Oferta.objects.create(
                empresa=empresa,
                profesion=data['profesion'],
                cargo=data['cargo'],
                descripcion=data['descripcion'],
                salario=data['salario'],
                activa=data.get('activa', True),
                estado=data.get('estado', ''),
            )
        except Exception as e:
            return Response({'error': f'Error al crear la oferta: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = OfertaSerializer(oferta)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class OfertaListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        ofertas = Oferta.objects.filter(activa=True)
        serializer = OfertaSerializer(ofertas, many=True)
        return Response(serializer.data)

# ===================================================================
# Vistas para el modelo Postulacion
# ===================================================================

class PostulacionCreateView(APIView):
    permission_classes = [AllowAny]  # Permitir a cualquier usuario

    def post(self, request):
        oferta_id = request.data.get('oferta_id')
        email = request.data.get('email')  # o username si prefieres

        if not oferta_id or not email:
            return Response({'error': 'Faltan datos requeridos.'}, status=400)

        try:
            oferta = Oferta.objects.get(id=oferta_id)
        except Oferta.DoesNotExist:
            return Response({'error': 'Oferta no encontrada.'}, status=404)

        try:
            postulante = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario postulante no encontrado.'}, status=404)

        # Evitar postulaciones duplicadas
        if Postulacion.objects.filter(oferta=oferta, postulante=postulante).exists():
            return Response({'error': 'Ya te has postulado a esta oferta.'}, status=400)

        Postulacion.objects.create(
            oferta=oferta,
            postulante=postulante
        )
        return Response({'message': 'Postulación exitosa.'}, status=201)

# ===================================================================
# Contrataciones.
# ===================================================================

class OfertaPostulacionesListView(APIView):
    def get(self, request, oferta_id):
        postulaciones = Postulacion.objects.filter(oferta_id=oferta_id)
        serializer = PostulacionSerializer(postulaciones, many=True)
        return Response(serializer.data)

class PostulacionContratarView(APIView):
    permission_classes = [AllowAny]  # Cambia a IsAdminUser si quieres restringir

    def post(self, request, postulacion_id):
        try:
            postulacion = Postulacion.objects.get(id=postulacion_id)
            oferta = postulacion.oferta
            usuario = postulacion.postulante

            # Cambiar estado de la postulación
            postulacion.estado = 'contratado'
            postulacion.save()

            # Cambiar rol del usuario a empleado
            usuario.role = 'CONTRATADO'
            usuario.save()

            # Cambiar oferta a inactiva
            oferta.activa = False
            oferta.save()

            return Response({'message': 'Candidato contratado y oferta cerrada.'}, status=status.HTTP_200_OK)
        except Postulacion.DoesNotExist:
            return Response({'error': 'Postulación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

class PostulacionRechazarView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, postulacion_id):
        try:
            postulacion = Postulacion.objects.get(id=postulacion_id)
            postulacion.estado = 'rechazado'
            postulacion.save()
            return Response({'message': 'Candidato rechazado.'}, status=status.HTTP_200_OK)
        except Postulacion.DoesNotExist:
            return Response({'error': 'Postulación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

class PostulacionDeleteView(APIView):
    """
    Vista para cancelar/eliminar una postulación.
    DELETE /api/postulaciones/<postulacion_id>/
    """
    permission_classes = [AllowAny]

    def delete(self, request, postulacion_id):
        try:
            postulacion = Postulacion.objects.get(id=postulacion_id)
            
            # Verificar que la postulación pertenece al usuario que hace la petición
            # (En un sistema real, deberías verificar la autenticación)
            
            # Solo permitir cancelar si está pendiente o en revisión
            if postulacion.estado not in ['pendiente', 'revisado']:
                return Response({
                    'error': 'No se puede cancelar una postulación que ya ha sido procesada.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Eliminar la postulación
            postulacion.delete()
            
            return Response({
                'message': 'Postulación cancelada exitosamente.'
            }, status=status.HTTP_200_OK)
            
        except Postulacion.DoesNotExist:
            return Response({
                'error': 'Postulación no encontrada.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': f'Error al cancelar la postulación: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExperienciaLaboralCreateView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            data = request.data.copy()
            
            # Get the candidato profile
            candidato_profile_id = data.get('candidato_profile')
            candidato_profile = CandidatoProfile.objects.get(usuario_id=candidato_profile_id)
            
            # Create the experience
            experiencia = ExperienciaLaboral.objects.create(
                candidato_profile=candidato_profile,
                empresa=data.get('empresa'),
                cargo=data.get('cargo'),
                fecha_inicio=data.get('fecha_inicio'),
                fecha_fin=data.get('fecha_fin', None)
            )
            
            serializer = ExperienciaLaboralSerializer(experiencia)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except CandidatoProfile.DoesNotExist:
            return Response({
                'error': 'Perfil de candidato no encontrado.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': f'Error al crear experiencia: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExperienciaLaboralUpdateView(APIView):
    permission_classes = [AllowAny]
    
    def put(self, request, experiencia_id):
        try:
            experiencia = ExperienciaLaboral.objects.get(id=experiencia_id)
            
            # Update fields
            data = request.data
            experiencia.empresa = data.get('empresa', experiencia.empresa)
            experiencia.cargo = data.get('cargo', experiencia.cargo)
            experiencia.fecha_inicio = data.get('fecha_inicio', experiencia.fecha_inicio)
            experiencia.fecha_fin = data.get('fecha_fin', experiencia.fecha_fin)
            
            experiencia.save()
            
            serializer = ExperienciaLaboralSerializer(experiencia)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except ExperienciaLaboral.DoesNotExist:
            return Response({
                'error': 'Experiencia laboral no encontrada.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': f'Error al actualizar experiencia: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExperienciaLaboralDeleteView(APIView):
    permission_classes = [AllowAny]
    
    def delete(self, request, experiencia_id):
        try:
            experiencia = ExperienciaLaboral.objects.get(id=experiencia_id)
            experiencia.delete()
            
            return Response({
                'message': 'Experiencia laboral eliminada exitosamente.'
            }, status=status.HTTP_200_OK)
            
        except ExperienciaLaboral.DoesNotExist:
            return Response({
                'error': 'Experiencia laboral no encontrada.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': f'Error al eliminar experiencia: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InformacionPersonalCreateView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            data = request.data.copy()
            
            # Get the candidato profile
            candidato_profile_id = data.get('candidato_profile')
            candidato_profile = CandidatoProfile.objects.get(usuario_id=candidato_profile_id)
            
            # Create the personal information
            info_personal = InformacionPersonal.objects.create(
                candidato_profile=candidato_profile,
                profesion=data.get('profesion'),
                universidad=data.get('universidad'),
                pais=data.get('pais')
            )
            
            serializer = InformacionPersonalSerializer(info_personal)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except CandidatoProfile.DoesNotExist:
            return Response({
                'error': 'Perfil de candidato no encontrado.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': f'Error al crear información personal: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InformacionPersonalUpdateView(APIView):
    permission_classes = [AllowAny]
    
    def put(self, request, info_id):
        try:
            info_personal = InformacionPersonal.objects.get(id=info_id)
            
            # Update fields
            data = request.data
            info_personal.profesion = data.get('profesion', info_personal.profesion)
            info_personal.universidad = data.get('universidad', info_personal.universidad)
            info_personal.pais = data.get('pais', info_personal.pais)
            
            info_personal.save()
            
            serializer = InformacionPersonalSerializer(info_personal)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except InformacionPersonal.DoesNotExist:
            return Response({
                'error': 'Información personal no encontrada.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': f'Error al actualizar información personal: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InformacionPersonalDeleteView(APIView):
    permission_classes = [AllowAny]
    
    def delete(self, request, info_id):
        try:
            info_personal = InformacionPersonal.objects.get(id=info_id)
            info_personal.delete()
            
            return Response({
                'message': 'Información personal eliminada exitosamente.'
            }, status=status.HTTP_200_OK)
            
        except InformacionPersonal.DoesNotExist:
            return Response({
                'error': 'Información personal no encontrada.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': f'Error al eliminar información personal: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InformacionPersonalListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, user_id):
        try:
            candidato_profile = CandidatoProfile.objects.get(usuario_id=user_id)
            informacion_personal = InformacionPersonal.objects.filter(candidato_profile=candidato_profile)
            serializer = InformacionPersonalSerializer(informacion_personal, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except CandidatoProfile.DoesNotExist:
            return Response({
                'error': 'Perfil de candidato no encontrado.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': f'Error al obtener información personal: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ContratacionCreateView(APIView):
    def post(self, request):
        data = request.data.copy()
        try:
            postulacion = Postulacion.objects.get(id=data['postulacion'])
        except Postulacion.DoesNotExist:
            return Response({'error': 'Postulación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        # Si tienes modelo Banco, puedes buscarlo por nombre o id
        banco = None
        if 'banco' in data and data['banco']:
            banco, _ = Banco.objects.get_or_create(nombre=data['banco'])
        contratacion = Contratacion.objects.create(
            postulacion=postulacion,
            tiempo_contratacion=data['tiempo_contratacion'],
            salario_mensual=data['salario_mensual'],
            tipo_sangre=data.get('tipo_sangre', ''),
            contacto_emergencia=data.get('contacto_emergencia', ''),
            telefono_emergencia=data.get('telefono_emergencia', ''),
            banco=banco,
            numero_cuenta=data.get('numero_cuenta', ''),
        )
        return Response(ContratacionSerializer(contratacion).data, status=status.HTTP_201_CREATED)

class UsuarioPostulacionesView(APIView):
    """
    Devuelve todas las postulaciones de un usuario.
    GET /api/usuarios/<id>/postulaciones/
    """
    def get(self, request, pk):
        postulaciones = Postulacion.objects.filter(postulante_id=pk)
        serializer = PostulacionSerializer(postulaciones, many=True)
        return Response(serializer.data)

class UsuarioContratacionStatusView(APIView):
    def get(self, request, user_id):
        # Busca la postulación contratada más reciente
        postulacion = Postulacion.objects.filter(postulante_id=user_id, estado='contratado').order_by('-fecha_postulacion').first()
        if not postulacion:
            return Response({'has_contratacion': False, 'postulacion_id': None, 'empresa': None})
        contratacion = Contratacion.objects.filter(postulacion=postulacion).first()
        empresa = postulacion.oferta.empresa
        return Response({
            'has_contratacion': contratacion is not None,
            'postulacion_id': postulacion.id,
            'empresa': {
                'nombre': empresa.nombre,
                'sector': empresa.sector,
                'persona_contacto': empresa.persona_contacto,
                'telefono_contacto': empresa.telefono_contacto,
                'direccion': empresa.direccion,
            }
        })

from rest_framework import viewsets
from rest_framework.decorators import action
from django.db.models import Count

class OfertaViewSet(viewsets.ModelViewSet):
    queryset = Oferta.objects.all()
    serializer_class = OfertaSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['post'])
    def toggle_estado(self, request, pk=None):
        oferta = self.get_object()
        nuevo_estado = request.data.get('estado')
        oferta.estado = nuevo_estado
        oferta.save()
        return Response({'status': 'estado actualizado', 'nuevo_estado': nuevo_estado})

# Vista para obtener estadísticas de la empresa
class EmpresaStatsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, user_id):
        try:
            # Obtener la empresa del usuario
            empresa = Empresa.objects.get(usuario_id=user_id)
            
            # Obtener ofertas de la empresa usando empresa_id
            ofertas = Oferta.objects.filter(empresa_id=empresa.id)
            
            # Contar ofertas activas
            ofertas_activas = ofertas.filter(estado='Abierta').count()
            
            # Contar total de postulaciones a las ofertas de esta empresa
            total_postulaciones = Postulacion.objects.filter(oferta__in=ofertas).count()
            
            # Contar contrataciones realizadas por esta empresa
            contrataciones = Contratacion.objects.filter(
                postulacion__oferta__in=ofertas
            ).count()
            
            # Calcular vistas (por ahora usaremos un cálculo basado en postulaciones)
            vistas_estimadas = total_postulaciones * 5  # Estimación: 5 vistas por postulación
            
            return Response({
                'ofertas_activas': ofertas_activas,
                'total_postulaciones': total_postulaciones,
                'contrataciones': contrataciones,
                'vistas_estimadas': vistas_estimadas,
                'total_ofertas': ofertas.count()
            })
            
        except Empresa.DoesNotExist:
            return Response({'error': 'Empresa no encontrada'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

# ===================================================================
# Vistas para el modelo CandidatoProfile
# ===================================================================

class CandidatoProfileView(APIView):
    """
    Vista para crear y obtener el perfil del candidato.
    - GET /api/candidato-profile/<user_id>/: Obtiene el perfil del candidato.
    - POST /api/candidato-profile/: Crea o actualiza el perfil del candidato.
    """
    permission_classes = [AllowAny]
    
    def get(self, request, user_id):
        try:
            candidato_profile = CandidatoProfile.objects.get(usuario_id=user_id)
            serializer = CandidatoProfileSerializer(candidato_profile)
            return Response(serializer.data)
        except CandidatoProfile.DoesNotExist:
            return Response({'error': 'Perfil de candidato no encontrado'}, status=404)
    
    def post(self, request):
        try:
            user_id = request.data.get('usuario_id')
            if not user_id:
                return Response({'error': 'usuario_id es requerido'}, status=400)
            
            # Verificar si ya existe un perfil para este usuario
            try:
                candidato_profile = CandidatoProfile.objects.get(usuario_id=user_id)
                # Si existe, actualizar
                serializer = CandidatoProfileSerializer(candidato_profile, data=request.data, partial=True)
            except CandidatoProfile.DoesNotExist:
                # Si no existe, crear nuevo
                data = request.data.copy()
                data['usuario'] = user_id
                serializer = CandidatoProfileSerializer(data=data)
            
            if serializer.is_valid():
                candidato_profile = serializer.save()
                return Response(CandidatoProfileSerializer(candidato_profile).data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({'error': str(e)}, status=500)
