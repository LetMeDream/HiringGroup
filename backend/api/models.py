from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.dispatch import receiver
from django.db.models.signals import post_save

# Create your models here.

class Usuario(models.Model):
    # Definición de las opciones de rol como constantes
    ROL_POSTULANTE = 'POSTULANTE'
    ROL_EMPRESA = 'EMPRESA'
    ROL_ADMIN = 'ADMIN'
    ROL_HIRING_GROUP = 'HIRING_GROUP'
    ROL_CONTRATADO = 'CONTRATADO'
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Administrador"
        HIRING_GROUP = "HIRING_GROUP", "Hiring Group"
        EMPRESA = "EMPRESA", "Empresa"
        POSTULANTE = "POSTULANTE", "Postulante"
        CONTRATADO = "CONTRATADO", "Contratado"

    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    nombre = models.CharField(max_length=150)
    apellido = models.CharField(max_length=50, blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    role = models.CharField(max_length=50, choices=Role.choices, default=Role.POSTULANTE)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.role})"

class Empresa(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='empresa')
    nombre = models.CharField(max_length=255)
    sector = models.CharField(max_length=150)
    persona_contacto = models.CharField(max_length=255)
    telefono_contacto = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        str = self.nombre
        if (str):
          return 'Empresa: %s' % (self.nombre)
        return 'Empresa de: %s' % (self.usuario.nombre)

# Signal post_save; Acciones para luego de registrado el Usuario
@receiver(post_save, sender=Usuario)
def crear_empresa_usuario(sender, instance, created, **kwargs):
	if (created and instance.role == Usuario.ROL_EMPRESA):
		Empresa.objects.create(usuario=instance)

class Banco(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre

class CandidatoProfile(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='candidato_profile')
    profesion = models.CharField(max_length=255)
    universidad = models.CharField(max_length=255)

class ExperienciaLaboral(models.Model):
    candidato = models.ForeignKey(CandidatoProfile, on_delete=models.CASCADE, related_name='experiencias')
    empresa = models.CharField(max_length=255)
    cargo = models.CharField(max_length=255)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)

class Oferta(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='ofertas')
    profesion = models.CharField(max_length=255)
    cargo = models.CharField(max_length=255)
    descripcion = models.TextField()
    salario = models.DecimalField(max_digits=10, decimal_places=2)
    activa = models.BooleanField(default=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    fecha_inactivacion = models.DateTimeField(null=True, blank=True)
    estado = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.cargo} en {self.empresa.nombre} ({'Activa' if self.activa else 'Inactiva'})"

class Postulacion(models.Model):
    oferta = models.ForeignKey(Oferta, on_delete=models.CASCADE, related_name='postulaciones')
    postulante = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='postulaciones')
    fecha_postulacion = models.DateTimeField(auto_now_add=True)
    class Estado(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        CONTRATADO = "contratado", "Contratado"
        RECHAZADO = "rechazado", "Rechazado"
    estado = models.CharField(max_length=10, choices=Estado.choices, default=Estado.PENDIENTE)

    class Meta:
        unique_together = ('oferta', 'postulante')

class Contratacion(models.Model):
    postulacion = models.OneToOneField(Postulacion, on_delete=models.CASCADE, related_name='contratacion')
    tiempo_contratacion = models.CharField(
        max_length=20,
        choices=[
            ("1 mes", "1 Mes"),
            ("6 meses", "6 Meses"),
            ("1 año", "1 Año"),
            ("indefinido", "Indefinido")
        ]
    )
    salario_mensual = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_contratacion = models.DateField(auto_now_add=True)
    tipo_sangre = models.CharField(max_length=5, blank=True, null=True)
    contacto_emergencia = models.CharField(max_length=255, blank=True, null=True)
    telefono_emergencia = models.CharField(max_length=20, blank=True, null=True)
    banco = models.ForeignKey(Banco, on_delete=models.SET_NULL, null=True, blank=True, related_name='contrataciones')
    numero_cuenta = models.CharField(max_length=30, blank=True, null=True)

    def __str__(self):
        return f"Contratación de {self.postulacion.postulante.nombre} para {self.postulacion.oferta.cargo}"

class Nomina(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='nominas')
    mes = models.IntegerField()
    año = models.IntegerField()
    total_pago = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        unique_together = ('empresa', 'mes', 'año')

class DetalleNomina(models.Model):
    nomina = models.ForeignKey(Nomina, on_delete=models.CASCADE, related_name='detalles')
    contratacion = models.ForeignKey(Contratacion, on_delete=models.SET_NULL, null=True, blank=True, related_name='detalles_nomina')
    empleado = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='detalles_nomina_como_empleado')
    salario = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_pago = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('nomina', 'empleado')

class ReciboPago(models.Model):
    detalle_nomina = models.ForeignKey(DetalleNomina, on_delete=models.CASCADE, related_name='recibos_pago')
    mes = models.IntegerField()
    año = models.IntegerField()
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_emision = models.DateTimeField(auto_now_add=True)

