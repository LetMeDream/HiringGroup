from django.contrib import admin
from .models import Usuario, CandidatoProfile, ExperienciaLaboral, Postulacion, Empresa, Banco, Oferta, Contratacion, Nomina, DetalleNomina, ReciboPago

# Register your models here.
admin.site.register(Usuario)
admin.site.register(Empresa)
admin.site.register(Banco)
admin.site.register(CandidatoProfile)
admin.site.register(ExperienciaLaboral)
admin.site.register(Oferta)
admin.site.register(Postulacion)
admin.site.register(Contratacion)
admin.site.register(Nomina)
admin.site.register(DetalleNomina)
admin.site.register(ReciboPago)
