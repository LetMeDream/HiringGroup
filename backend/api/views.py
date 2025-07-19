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

from .models import Usuario, Empresa, Oferta, Postulacion
from .serializer import UserSerializer, UserRegisterSerializer, EmpresaSerializer, OfertaSerializer, PostulacionSerializer

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
            postulacion.estado = 'CONTRATADO'
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

# Aquí irían los otros ViewSets o Vistas para Vacante, Postulacion, etc.
# from .models import Vacante, Postulacion, ...
# from .serializers import VacanteSerializer, PostulacionSerializer, ...

# class VacanteListView(APIView):
#     # ...
