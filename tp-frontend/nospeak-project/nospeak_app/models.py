
from ast import Tuple
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.contrib.auth.models import User

class Artista(models.Model):
    nombre = models.CharField(max_length=100)
    nacionalidad = models.CharField(max_length=50)
    nro_seguidores = models.IntegerField()
    portada = models.URLField(null=True)

    def __str__(self):
        return self.nombre

class Album(models.Model):
    titulo = models.CharField(max_length=100)
    portada = models.URLField()

    def __str__(self):
        return self.titulo

class Cancion(models.Model):
    titulo = models.CharField(max_length=100, null=True)
    anio_lanzamiento = models.IntegerField()
    genero = models.CharField(max_length=50)
    duracion = models.FloatField()
    audio = models.URLField()
    spotify_id = models.CharField(max_length=100, null=True)
    artista = models.ForeignKey(Artista, on_delete=models.CASCADE, default=None, null=True)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, default=None, null=True)
    
    def __str__(self):
        return self.titulo



class Playlist(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    canciones = models.ManyToManyField(Cancion, null=True)
    portada = models.URLField(null=True)


    def __str__(self):
        return self.titulo

class Recomendacion(models.Model):
    fecha_recomendacion = models.DateField()
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    canciones = models.ManyToManyField(Cancion)

class Historial(models.Model):
    fecha_reproduccion = models.DateTimeField(auto_now_add=True, null=True)
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    canciones = models.ManyToManyField(Cancion)

