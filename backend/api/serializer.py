# api/serializers.py

from rest_framework import serializers
from .models import (
    Usuario, 
    EmpresaProfile, 
    CandidatoProfile, 
    ExperienciaLaboral, 
    Vacante, 
    Postulacion, 
    Contrato
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


class EmpresaProfileSerializer(serializers.ModelSerializer):
    """
    Serializer para el perfil de la empresa.
    """
    class Meta:
        model = EmpresaProfile
        fields = ['id', 'nombre_empresa', 'sector', 'persona_contacto']


# ===================================================================
# Serializers para Usuarios y Autenticación
# ===================================================================

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'email', 'role']


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer para el registro de nuevos usuarios.
    Maneja la creación del usuario y su perfil asociado (candidato o empresa).
    """
    # Hacemos el campo 'role' escribible para poder asignarlo en el registro.
    role = serializers.ChoiceField(choices=Usuario.Role.choices)
    
    # Campos adicionales para los perfiles
    nombre_empresa = serializers.CharField(write_only=True, required=False)
    sector = serializers.CharField(write_only=True, required=False)
    persona_contacto = serializers.CharField(write_only=True, required=False)
    
    profesion = serializers.CharField(write_only=True, required=False)
    universidad = serializers.CharField(write_only=True, required=False)


    class Meta:
        model = Usuario
        fields = [
            'id', 'email', 'password', 'role', 'nombre_empresa', 
            'sector', 'persona_contacto', 'profesion', 'universidad'
        ]
        extra_kwargs = {
            'password': {'write_only': True} # El password no debe ser legible
        }

    def validate(self, data):
        """
        Validación personalizada para asegurar que se envíen los datos
        del perfil correspondientes al rol seleccionado.
        """
        role = data.get('role')
        if role == Usuario.Role.EMPRESA:
            if not all([data.get('nombre_empresa'), data.get('sector'), data.get('persona_contacto')]):
                raise serializers.ValidationError("Para rol Empresa, se requiere nombre_empresa, sector y persona_contacto.")
        elif role == Usuario.Role.POSTULANTE:
            if not all([data.get('profesion'), data.get('universidad')]):
                raise serializers.ValidationError("Para rol Postulante, se requiere profesion y universidad.")
        return data

    def create(self, validated_data):
        """
        Sobrescribimos el método create para manejar la creación del usuario
        y su perfil en una sola transacción.
        """
        role = validated_data.pop('role')
        
        # Extraemos los datos del perfil del diccionario
        empresa_data = {
            'nombre_empresa': validated_data.pop('nombre_empresa', None),
            'sector': validated_data.pop('sector', None),
            'persona_contacto': validated_data.pop('persona_contacto', None)
        }
        candidato_data = {
            'profesion': validated_data.pop('profesion', None),
            'universidad': validated_data.pop('universidad', None)
        }

        # Creamos el usuario. Usamos create_user para hashear el password.
        user = Usuario.objects.create_user(
            username=validated_data['email'], # Usamos email como username
            **validated_data
        )
        user.role = role
        user.save()

        # Creamos el perfil correspondiente
        if role == Usuario.Role.EMPRESA:
            EmpresaProfile.objects.create(user=user, **empresa_data)
        elif role == Usuario.Role.POSTULANTE:
            CandidatoProfile.objects.create(user=user, **candidato_data)

        return user


# ===================================================================
# Serializers para el Flujo de Reclutamiento
# ===================================================================

class VacanteSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Vacante.
    Muestra información de la empresa de forma anidada para mayor contexto.
    """
    # 'read_only=True' para mostrar la info de la empresa al leer vacantes.
    empresa = EmpresaProfileSerializer(read_only=True) 
    # 'write_only=True' para asignar la empresa al crear/actualizar una vacante.
    empresa_id = serializers.PrimaryKeyRelatedField(
        queryset=EmpresaProfile.objects.all(), source='empresa', write_only=True
    )

    class Meta:
        model = Vacante
        fields = [
            'id', 'empresa', 'empresa_id', 'profesion_requerida', 'cargo_vacante',
            'descripcion_perfil', 'salario_ofrecido', 'activa', 'fecha_creacion'
        ]


class PostulacionSerializer(serializers.ModelSerializer):
    """
    Serializer para las postulaciones.
    Muestra información detallada del candidato y la vacante.
    """
    candidato = UserSerializer(read_only=True)
    vacante = VacanteSerializer(read_only=True)

    class Meta:
        model = Postulacion
        fields = ['id', 'candidato', 'vacante', 'fecha_postulacion']


class ContratoSerializer(serializers.ModelSerializer):
    """
    Serializer para crear y ver contratos.
    """
    # Usamos un serializer anidado para mostrar los detalles del contratado.
    candidato_contratado = UserSerializer(read_only=True)

    class Meta:
        model = Contrato
        fields = [
            'id', 'candidato_contratado', 'vacante_aplicada', 'fecha_contratacion',
            'duracion', 'salario_mensual', 'banco', 'numero_cuenta'
        ]
