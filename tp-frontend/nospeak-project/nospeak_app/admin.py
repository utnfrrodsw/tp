from django.contrib import admin
from .models import Playlist, Recomendacion, Historial, Cancion, Artista, Album 

# Register your models here.
# admin.site.register(Usuario)
admin.site.register(Playlist)
admin.site.register(Recomendacion)
admin.site.register(Historial)
admin.site.register(Artista)
admin.site.register(Album)