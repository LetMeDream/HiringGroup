from django.contrib import admin
from .models import Usuario, EmpresaProfile, CandidatoProfile, ExperienciaLaboral, Vacante, Postulacion, Contrato

# Register your models here.
admin.site.register(Usuario)
admin.site.register(EmpresaProfile)
admin.site.register(CandidatoProfile)
admin.site.register(ExperienciaLaboral)
admin.site.register(Vacante)
admin.site.register(Postulacion)
admin.site.register(Contrato)
