
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


# class AppUserManager(BaseUserManager):
# 	def create_user(self, email, password=None):
# 		if not email:
# 			raise ValueError('An email is required.')
# 		if not password:
# 			raise ValueError('A password is required.')
# 		email = self.normalize_email(email)
# 		user = self.model(email=email)
# 		user.set_password(password)
# 		user.save()
# 		return user
# 	def create_superuser(self, email, password=None):
# 		if not email:
# 			raise ValueError('An email is required.')
# 		if not password:
# 			raise ValueError('A password is required.')
# 		user = self.create_user(email, password)
# 		user.is_superuser = True
# 		user.save()
# 		return user


# class AppUser(AbstractBaseUser, PermissionsMixin):
# 	user_id = models.AutoField(primary_key=True)
# 	email = models.EmailField(max_length=50, unique=True)
# 	username = models.CharField(max_length=50)
# 	USERNAME_FIELD = 'email'
# 	REQUIRED_FIELDS = ['username']
# 	objects = AppUserManager()
# 	def __str__(self):
# 		return self.username


# # class Usuario(models.Model):
# #     nombre = models.CharField(max_length=255)
# #     email = models.CharField(max_length=255)
# #     password = models.CharField(max_length=20)
# #     telefono = models.CharField(max_length=20)
    
# #     def __str__(self) -> str:
# #         return self.nombre

# # class Suscripcion(models.Model):
# #     usuario = models.ForeignKey(AppUser, related_name='suscripciones', on_delete=models.RESTRICT)
# #     tipo = models.CharField(max_length=20)
# #     precio = models.FloatField()
# #     fecha_expiracion = models.DateField()

# class Artista(models.Model):
#     nombre = models.CharField(max_length=255, null=False, blank=False)
#     nacionalidad = models.CharField(max_length=50, null=False, blank=False)
#     nro_seguidores = models.IntegerField(default=0, null=False, blank=True)

#     def __str__(self):
#         return self.nombre

#     @property
#     def canciones(self):
#         return self.cancion_set.all()
    
#     @property
#     def albumes(self):
#         return self.album_set.all()

# class Album(models.Model):
#     titulo = models.CharField(max_length=255)
#     portada = models.CharField(max_length=255)
#     artista = models.ForeignKey('nospeak_app.Artista', on_delete=models.CASCADE, null=True)

#     def __str__(self):
#         return self.titulo
    
#     @property
#     def canciones(self):
#         return self.cancion_set.all()
    


# class Cancion(models.Model):
#     # album = models.ForeignKey(Album, related_name="canciones_album", on_delete=models.RESTRICT)
#     artista = models.ForeignKey('nospeak_app.Artista', on_delete=models.CASCADE, null=True)
#     titulo = models.CharField(max_length=255, null=True, blank=True)
#     anio_lanzamiento = models.CharField(max_length=4)
#     genero = models.CharField(max_length=50)
#     duracion = models.FloatField()
#     audio = models.CharField(max_length=255)
#     spotify_id = models.CharField(max_length=255, null=True)

#     def __str__(self):
#         return self.titulo

# class Historial(models.Model):
#     cancion = models.ForeignKey(Cancion, related_name="canciones_historial", on_delete=models.RESTRICT)
#     usuario = models.ForeignKey(AppUser, related_name='historiales', on_delete=models.RESTRICT)
#     fecha_reproduccion = models.DateField()

# class Playlist(models.Model):
#     cancion = models.ForeignKey(Cancion, related_name="canciones_playlist", on_delete=models.RESTRICT)
#     usuario = models.ForeignKey(AppUser, related_name='playlists_usuario', on_delete=models.RESTRICT)
#     titulo = models.CharField(max_length=255)
#     descripcion = models.CharField(max_length=255)
#     fecha_creacion = models.DateField()


# class Recomendacion(models.Model):
#     cancion = models.ForeignKey(Cancion, related_name="canciones_recomendacion", on_delete=models.RESTRICT)
#     usuario = models.ForeignKey(AppUser, related_name='recomendaciones_usuario', on_delete=models.RESTRICT)
#     playlist = models.ForeignKey(Playlist, related_name='playlist_recomendacion', on_delete=models.RESTRICT)
#     fecha_recomendacion = models.DateField()


# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# class UsuarioManager(BaseUserManager):
#     def create_user(self, email, password=None, **extra_fields):
#         if not email:
#             raise ValueError('El email debe ser proporcionado')
        
#         email = self.normalize_email(email)
#         user = self.model(email=email, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)

#         if extra_fields.get('is_staff') is not True:
#             raise ValueError('Superuser debe tener is_staff=True')
#         if extra_fields.get('is_superuser') is not True:
#             raise ValueError('Superuser debe tener is_superuser=True')

#         return self.create_user(email, password, **extra_fields)

# class Usuario(AbstractBaseUser, PermissionsMixin):
#     email = models.EmailField(unique=True)
#     nombre = models.CharField(max_length=100)
#     # Otros campos que necesites

#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)

#     objects = UsuarioManager()

#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['nombre']  # Si deseas requerir otros campos en el registro

from django.db import models
from django.contrib.auth.models import User

class Artista(models.Model):
    nombre = models.CharField(max_length=100)
    nacionalidad = models.CharField(max_length=50)
    nro_seguidores = models.IntegerField()

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
    fecha_creacion = models.DateField()
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    canciones = models.ManyToManyField(Cancion)

    def __str__(self):
        return self.titulo

class Recomendacion(models.Model):
    fecha_recomendacion = models.DateField()
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    canciones = models.ManyToManyField(Cancion)

class Historial(models.Model):
    fecha_reproduccion = models.DateField()
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    canciones = models.ManyToManyField(Cancion)

