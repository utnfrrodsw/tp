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

class ArtistaSerializer(serializers.ModelSerializer):
    albums = AlbumSerializer(many=True, read_only=True)  # Relación inversa desde Artista a Album

    class Meta:
        model = Artista
        fields = '__all__'

class CancionSerializer(serializers.ModelSerializer):
    artista = serializers.PrimaryKeyRelatedField(
        queryset=Artista.objects.all(),
    )
    
    album = serializers.PrimaryKeyRelatedField(
        queryset=Album.objects.all(),
    )

    class Meta:
        model = Cancion
        fields = '__all__'

    def create(self, validated_data):
        artista = validated_data.pop('artista')
        album = validated_data.pop('album')
        
        cancion = Cancion.objects.create(
            artista=artista,
            album=album,
            **validated_data
        )
        return cancion

                
class CancionWithArtistaAlbumSerializer(serializers.ModelSerializer):
    artista = ArtistaSerializer()
    album = AlbumSerializer()
    class Meta:
        model = Cancion
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

    def create(self, validated_data):
        canciones_data = validated_data.pop('canciones')
        playlist = Playlist.objects.create(**validated_data)

        for cancion_data in canciones_data:
            artista_data = cancion_data.pop('artista')
            album_data = cancion_data.pop('album')

            # Buscar una Cancion existente en la base de datos
            cancion, created = Cancion.objects.get_or_create(
                artista=artista_data,
                album=album_data,
                **cancion_data
            )

            playlist.canciones.add(cancion)

        return playlist
    
    def update(self, instance, validated_data):
        canciones_data = validated_data.pop('canciones', [])  # Get canciones_data or empty list

        instance.titulo = validated_data.get('titulo', instance.titulo)
        instance.descripcion = validated_data.get('descripcion', instance.descripcion)
        instance.fecha_creacion = validated_data.get('fecha_creacion', instance.fecha_creacion)
        instance.usuario = validated_data.get('usuario', instance.usuario)
        instance.portada = validated_data.get('portada', instance.portada)

        instance.canciones.clear()  # Clear existing songs from the playlist

        for cancion_data in canciones_data:
            artista_data = cancion_data.pop('artista')
            album_data = cancion_data.pop('album')

            cancion, created = Cancion.objects.get_or_create(
                artista=artista_data,
                album=album_data,
                **cancion_data
            )

            instance.canciones.add(cancion)

        instance.save()
        return instance

class PlaylistWithUsuarioSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer()
    canciones = CancionSerializer(many=True)

    class Meta:
        model = Playlist
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Update the representation of each song to include artist and album details
        songs_representation = []
        for song_data in representation['canciones']:
            artist_id = song_data['artista']
            album_id = song_data['album']

            # Get artist and album instances
            artist_instance = Artista.objects.get(pk=artist_id)
            album_instance = Album.objects.get(pk=album_id)

            # Include artist and album details in the song representation
            song_representation = song_data.copy()
            song_representation['artista'] = ArtistaSerializer(artist_instance).data
            song_representation['album'] = AlbumSerializer(album_instance).data

            songs_representation.append(song_representation)

        representation['canciones'] = songs_representation
        return representation


class CancionesPorArtistaSerializer(serializers.ModelSerializer):
    album = AlbumSerializer()

    class Meta:
        model = Cancion
        fields = '__all__'

class CancionesPorAlbumSerializer(serializers.ModelSerializer):
    artista = ArtistaSerializer()

    class Meta:
        model = Cancion
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

    def create(self, validated_data):
        canciones_data = validated_data.pop('canciones')
        historial = Historial.objects.create(**validated_data)

        for cancion_data in canciones_data:

            cancion, created = Cancion.objects.get_or_create(
                **cancion_data
            )

            historial.canciones.add(cancion)

        return historial
    
    def update(self, instance, validated_data):
        canciones_data = validated_data.pop('canciones', [])
        instance.usuario = validated_data.get('usuario', instance.usuario)

        instance.canciones.clear()

        for cancion_data in canciones_data:
            cancion, created = Cancion.objects.get_or_create(
                **cancion_data
            )

            instance.canciones.add(cancion)

        instance.save()
        return instance





