# api/serializers.py

from rest_framework import serializers
from .models import (
    Usuario, 
    CandidatoProfile, 
    ExperienciaLaboral,
    Empresa,
    Oferta,
    Postulacion,
    Contratacion
)

# ===================================================================
# Serializers para Perfiles y Datos Anidados
# ===================================================================

class ExperienciaLaboralSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo ExperienciaLaboral.
    Se usará de forma anidada dentro del perfil del candidato.
    """
    class Meta:
        model = ExperienciaLaboral
        fields = ['id', 'empresa', 'cargo', 'fecha_inicio', 'fecha_fin']


class CandidatoProfileSerializer(serializers.ModelSerializer):
    """
    Serializer para el perfil del candidato.
    Incluye las experiencias laborales de forma anidada.
    """
    experiencias = ExperienciaLaboralSerializer(many=True, read_only=True)

    class Meta:
        model = CandidatoProfile
        fields = ['id', 'profesion', 'universidad', 'experiencias']

# ===================================================================
# Serializers para Usuarios y Autenticación
# ===================================================================

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'email', 'role', 'apellido']


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer para el registro de nuevos usuarios.
    Maneja la creación del usuario y su perfil asociado (candidato o empresa).
    """
    role = serializers.ChoiceField(choices=[
        ('ADMIN', 'Administrador'),
        ('HIRING_GROUP', 'Hiring Group'),
        ('EMPRESA', 'Empresa'),
        ('POSTULANTE', 'Postulante'),
        ('CONTRATADO', 'Contratado'),
    ], required=True)
    class Meta:
        model = Usuario
        fields = [
            'id', 'email', 'password', 'nombre', 'apellido', 'telefono', 'role'
        ]
        extra_kwargs = {
            'password': {'write_only': True} # El password no debe ser legible
        }

    def create(self, validated_data):
        """
        Sobrescribimos el método create para manejar la creación del usuario
        y su perfil en una sola transacción.
        """
        role = validated_data.pop('role')
        user = Usuario(
            email=validated_data['email'],
            nombre=validated_data.get('nombre', ''),
            apellido=validated_data.get('apellido', ''),
            telefono=validated_data.get('telefono', ''),
            role=role
        )
        user.set_password(validated_data['password'])  # Hashear
        user.save()
        return user

# ===================================================================
# Serializers para el flujo de creación de empresas
# ===================================================================
class EmpresaSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Empresa.
    Incluye los campos necesarios para crear o actualizar una empresa.
    """
    class Meta:
        model = Empresa
        fields = ['id', 'usuario', 'nombre', 'sector', 'persona_contacto', 'telefono_contacto', 'direccion']
        read_only_fields = ['usuario']  # El usuario se asigna automáticamente

# ===================================================================
# Serializers para el Creacion de Oferta
# ===================================================================

class OfertaSerializer(serializers.ModelSerializer):
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)
    ubicacion = serializers.CharField(source='empresa.direccion', read_only=True)

    class Meta:
        model = Oferta
        fields = [
            'id', 'profesion', 'cargo', 'descripcion', 'salario', 'activa', 'estado',
            'empresa_nombre', 'ubicacion', 'fecha_publicacion'
        ]

# ===================================================================
# Serializers para el manejo de postulaciones
# ===================================================================

class PostulacionSerializer(serializers.ModelSerializer):
    postulante_nombre = serializers.CharField(source='postulante.nombre', read_only=True)
    postulante_email = serializers.CharField(source='postulante.email', read_only=True)

    class Meta:
        model = Postulacion
        fields = [
            'id',
            'postulante_nombre',
            'postulante_email',
            'estado',
            'fecha_postulacion',
        ]

# ===================================================================
# Serializers para el manejo de contrataciones
# ===================================================================

class ContratacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contratacion
        fields = [
            'id',
            'postulacion',
            'tiempo_contratacion',
            'salario_mensual',
            'fecha_contratacion',
            'tipo_sangre',
            'contacto_emergencia',
            'telefono_emergencia',
            'banco',
            'numero_cuenta',
        ]
