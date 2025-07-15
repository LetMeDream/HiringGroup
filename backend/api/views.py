from django.shortcuts import render

# Create your views here.
# api/views.py

from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Usuario
from .serializer import UserSerializer, UserRegisterSerializer

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
                "telefono": usuario.telefono
            }
        }, status=status.HTTP_200_OK)


# Aquí irían los otros ViewSets o Vistas para Vacante, Postulacion, etc.
# from .models import Vacante, Postulacion, ...
# from .serializers import VacanteSerializer, PostulacionSerializer, ...

# class VacanteListView(APIView):
#     # ...
