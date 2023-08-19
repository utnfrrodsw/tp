# from rest_framework import serializers
# from django.contrib.auth import get_user_model, authenticate
# from django.core.exceptions import ValidationError
# from nospeak_app.models import Cancion, Artista, Album

# UserModel = get_user_model()

# class UserRegisterSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = UserModel
# 		fields = '__all__'
# 	def create(self, clean_data):
# 		user_obj = UserModel.objects.create_user(email=clean_data['email'], password=clean_data['password'])
# 		user_obj.username = clean_data['username']
# 		user_obj.save()
# 		return user_obj

# class UserLoginSerializer(serializers.Serializer):
# 	email = serializers.EmailField()
# 	password = serializers.CharField()
# 	##
# 	def check_user(self, clean_data):
# 		user = authenticate(username=clean_data['email'], password=clean_data['password'])
# 		if not user:
# 			raise ValidationError('user not found')
# 		return user

# class UserSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = UserModel
# 		fields = ('email', 'username')

# class CancionSerializer(serializers.ModelSerializer):
#     id = serializers.IntegerField(required=False)

#     class Meta:
#         model = Cancion
#         fields = [
#             'id',
#             'titulo',
# 	    	'artista',
# 		    'anio_lanzamiento',
# 		    'genero',
# 		    'duracion',
# 		    'audio',
#             'spotify_id'
#         ]
#         read_only_fields = ('artista',)

# class AlbumSerializer(serializers.ModelSerializer):
#     id = serializers.IntegerField(required=False)
#     canciones = CancionSerializer(many=True)

#     class Meta:
#         model = Album
#         fields = [
#             'id',
#             'titulo',
# 	    	'portada',
# 		    'artista',
#             'canciones',
#         ]
#         read_only_fields = ('artista',)

#     def create(self, validated_data):
#         canciones = validated_data.pop('canciones')
#         album = Album.objects.create(**validated_data)
#         for cancion in canciones:
#             Cancion.objects.create(**cancion)
#         return album
	
# class ArtistaSerializer(serializers.ModelSerializer):
#     canciones = CancionSerializer(many=True)
#     albumes = AlbumSerializer(many=True)

#     class Meta:
#         model = Artista
#         fields = [
#             "id",
#             "nombre",
#             "nacionalidad",
#             "nro_seguidores",
#             "canciones",
#             "albumes"
#         ]

#     def create(self, validated_data):
#         canciones = validated_data.pop('canciones')
#         albumes = validated_data.pop('albumes')
#         artista = Artista.objects.create(**validated_data)
#         for cancion in canciones:
#             Cancion.objects.create(**cancion, artista=artista)
#         for album in albumes:
#             Album.objects.create(**album, artista=artista)
#         return artista

#     def update(self, instance, validated_data):
#         canciones = validated_data.pop('canciones')
#         albumes = validated_data.pop('albumes')
        
#         instance.nombre = validated_data.get("nombre", instance.nombre)
#         instance.nacionalidad = validated_data.get("nacionalidad", instance.nacionalidad)
#         instance.nro_seguidores = validated_data.get("nro_seguidores", instance.nro_seguidores)
#         instance.save()
#         keep_canciones = []
#         keep_albumes = []

        
#         for cancion in canciones:
#             if "id" in cancion.keys():
#                 if Cancion.objects.filter(id=cancion["id"]).exists():
#                     c = Cancion.objects.get(id=cancion["id"])
#                     c.titulo = cancion.get('titulo', c.titulo)
#                     c.anio_lanzamiento = cancion.get('anio_lanzamiento', c.anio_lanzamiento)
#                     c.genero = cancion.get('genero', c.genero)
#                     c.duracion = cancion.get('duracion', c.duracion)
#                     c.audio = cancion.get('audio', c.audio)
#                     c.save()
#                     keep_canciones.append(c.id)
#                 else:
#                     continue
#             else:
#                 c = Cancion.objects.create(**cancion, artista=instance)
#                 keep_canciones.append(c.id)
        
#         for cancion in instance.canciones:
#             if cancion.id not in keep_canciones:
#                 cancion.delete()

#         for album in albumes:
#             if "id" in album.keys():
#                 if Album.objects.filter(id=album["id"]).exists():
#                     a = Album.objects.get(id=album["id"])
#                     a.titulo = album.get('titulo', a.titulo)
#                     a.portada = album.get('portada', a.portada)
#                     a.save()
#                     keep_albumes.append(a.id)
#                 else:
#                     continue
#             else:
#                 a = Album.objects.create(**album, artista=instance)
#                 keep_albumes.append(a.id)


#         for album in instance.albumes:
#             if album.id not in keep_albumes:
#                 album.delete()

#         return instance

# # class UsuarioSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Usuario
# #         fields = '__all__'

from rest_framework import serializers
from .models import Artista, Album, Cancion, Playlist, Recomendacion, Historial
from django.contrib.auth.models import User

class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'

class CancionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cancion
        fields = '__all__'
        depth=1

class ArtistaSerializer(serializers.ModelSerializer):
    albums = AlbumSerializer(many=True, read_only=True)  # Relación inversa desde Artista a Album

    class Meta:
        model = Artista
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        user = User(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class PlaylistSerializer(serializers.ModelSerializer):
    canciones = CancionSerializer(many=True)  # Relación ManyToMany con Cancion

    class Meta:
        model = Playlist
        fields = '__all__'

class RecomendacionSerializer(serializers.ModelSerializer):
    canciones = CancionSerializer(many=True)

    class Meta:
        model = Recomendacion
        fields = '__all__'

class HistorialSerializer(serializers.ModelSerializer):
    canciones = CancionSerializer(many=True)

    class Meta:
        model = Historial
        fields = '__all__'
