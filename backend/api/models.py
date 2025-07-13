from django.db import models
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.

class Usuario(models.Model):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        HIRING_GROUP = "HIRING_GROUP", "Hiring Group"
        EMPRESA = "EMPRESA", "Empresa"
        POSTULANTE = "POSTULANTE", "Postulante"
        CONTRATADO = "CONTRATADO", "Contratado"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, choices=Role.choices, default=Role.POSTULANTE)
    nombre = models.CharField(max_length=150)
    password = models.CharField(max_length=128) # Campo añadido

    def __str__(self):
        return f"{self.nombre} ({self.role})"

    # Métodos añadidos para manejar la contraseña de forma segura
    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

class EmpresaProfile(models.Model):
    user = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='empresa_profile')
    nombre_empresa = models.CharField(max_length=255)
    sector = models.CharField(max_length=150)
    persona_contacto = models.CharField(max_length=255)
    # ... otros datos de la empresa

class CandidatoProfile(models.Model):
    user = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='candidato_profile')
    profesion = models.CharField(max_length=255)
    universidad = models.CharField(max_length=255)
    # ... otros datos básicos

class ExperienciaLaboral(models.Model):
    candidato_profile = models.ForeignKey(CandidatoProfile, on_delete=models.CASCADE, related_name='experiencias')
    empresa = models.CharField(max_length=255)
    cargo = models.CharField(max_length=255)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)

class Vacante(models.Model):
    empresa = models.ForeignKey(EmpresaProfile, on_delete=models.CASCADE, related_name='vacantes')
    profesion_requerida = models.CharField(max_length=255)
    cargo_vacante = models.CharField(max_length=255)
    descripcion_perfil = models.TextField()
    salario_ofrecido = models.DecimalField(max_digits=10, decimal_places=2)
    activa = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

class Postulacion(models.Model):
    candidato = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='postulaciones')
    vacante = models.ForeignKey(Vacante, on_delete=models.CASCADE, related_name='postulaciones')
    fecha_postulacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('candidato', 'vacante') # Un candidato solo puede postular una vez a una vacante

class Contrato(models.Model):
    candidato_contratado = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='contrato')
    vacante_aplicada = models.ForeignKey(Vacante, on_delete=models.PROTECT)
    fecha_contratacion = models.DateField(auto_now_add=True)
    duracion = models.CharField(max_length=100) # "Un mes", "Indefinido", etc.
    salario_mensual = models.DecimalField(max_digits=10, decimal_places=2)
    banco = models.CharField(max_length=100)
    numero_cuenta = models.CharField(max_length=20)
    # ... datos de emergencia, etc.
