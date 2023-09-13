# from django.contrib.auth import get_user_model, login, logout
# from rest_framework.authentication import SessionAuthentication
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, CancionSerializer, ArtistaSerializer, AlbumSerializer
# from rest_framework import permissions, status
# from .validations import custom_validation, validate_email, validate_password
# from django.shortcuts import render, reverse, redirect, get_object_or_404
# from django.http import Http404, HttpResponse, HttpResponseRedirect, JsonResponse
# from django.contrib.auth.decorators import login_required
# from django.utils.decorators import method_decorator
# from django.views.generic import View
# from django.views.decorators.csrf import csrf_exempt
# from django.views.generic.edit import CreateView
# from django.db.models import Q
# from nospeak_app.models import *
# from rest_framework import viewsets
# from rest_framework.decorators import action



# class UserRegister(APIView):
# 	permission_classes = (permissions.AllowAny,)
# 	def post(self, request):
# 		clean_data = custom_validation(request.data)
# 		serializer = UserRegisterSerializer(data=clean_data)
# 		if serializer.is_valid(raise_exception=True):
# 			user = serializer.create(clean_data)
# 			if user:
# 				return Response(serializer.data, status=status.HTTP_201_CREATED)
# 		return Response(status=status.HTTP_400_BAD_REQUEST)


# class UserLogin(APIView):
# 	permission_classes = (permissions.AllowAny,)
# 	authentication_classes = (SessionAuthentication,)
# 	##
# 	def post(self, request):
# 		data = request.data
# 		assert validate_email(data)
# 		assert validate_password(data)
# 		serializer = UserLoginSerializer(data=data)
# 		if serializer.is_valid(raise_exception=True):
# 			user = serializer.check_user(data)
# 			login(request, user)
# 			return Response(serializer.data, status=status.HTTP_200_OK)


# class UserLogout(APIView):
# 	permission_classes = (permissions.AllowAny,)
# 	authentication_classes = ()
# 	def post(self, request):
# 		logout(request)
# 		return Response(status=status.HTTP_200_OK)


# class UserView(APIView):
# 	permission_classes = (permissions.IsAuthenticated,)
# 	authentication_classes = (SessionAuthentication,)
# 	##
# 	def get(self, request):
# 		serializer = UserSerializer(request.user)
# 		return Response({'user': serializer.data}, status=status.HTTP_200_OK)

# # from rest_framework import viewsets
# # from .serializers import UsuarioSerializer
# # from .models import Usuario

# # # Create your views here.
# # class UsuarioView(viewsets.ModelViewSet):
# #     serializer_class = UsuarioSerializer
# #     queryset = Usuario.objects.all()

# class ArtistaViewSet(viewsets.ModelViewSet):
#     serializer_class = ArtistaSerializer
#     queryset = Artista.objects.all()
#     lookup_field = "id"

#     @action(detail=True, methods=["GET"])
#     def canciones(self, request, id=None):
#         artista = self.get_object()
#         canciones = Cancion.objects.filter(artista=artista)
#         serializer = CancionSerializer(canciones, many=True)
#         return Response(serializer.data, status=200)
    

#     @action(detail=True, methods=["POST"])
#     def choice(self, request, id=None):
#         artista = self.get_object()
#         data = request.data
#         data["artista"] = artista.id
#         serializer = CancionSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=201)
#         return Response(serializer.erros, status=400)
    


from rest_framework import generics
from .models import Artista, Album, Cancion, Playlist, Recomendacion, Historial
from .serializers import ArtistaSerializer, AlbumSerializer, CancionSerializer, UsuarioSerializer, PlaylistSerializer, RecomendacionSerializer, HistorialSerializer, CancionWithArtistaAlbumSerializer, PlaylistWithUsuarioSerializer, CancionesPorArtistaSerializer, CancionesPorAlbumSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.http import JsonResponse
from nospeak_app.recommendations.multi_recommendations import *
from django.views.decorators.csrf import csrf_exempt
import json


class ArtistaList(generics.ListCreateAPIView):
    queryset = Artista.objects.all()
    serializer_class = ArtistaSerializer

class ArtistaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Artista.objects.all()
    serializer_class = ArtistaSerializer

class AlbumList(generics.ListCreateAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

class AlbumDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

class CancionCreate(generics.ListCreateAPIView):
    queryset = Cancion.objects.all()
    serializer_class = CancionSerializer
    # permission_classes = [IsAuthenticated]

class CancionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cancion.objects.all()
    serializer_class = CancionSerializer

class CancionInfo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cancion.objects.all()
    serializer_class = CancionWithArtistaAlbumSerializer

class CancionList(generics.ListCreateAPIView):
    queryset = Cancion.objects.all()
    serializer_class = CancionWithArtistaAlbumSerializer

class CancionesPorArtistaView(generics.ListAPIView):
    serializer_class = CancionesPorArtistaSerializer

    def get_queryset(self):
        artista_id = self.kwargs['artista_id']
        return Cancion.objects.filter(artista=artista_id)
    
class CancionesPorAlbumView(generics.ListAPIView):
    serializer_class = CancionesPorAlbumSerializer

    def get_queryset(self):
        album_id = self.kwargs['album_id']
        return Cancion.objects.filter(album=album_id)

class UsuarioList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer

class UsuarioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer

class PlaylistCreate(generics.ListCreateAPIView):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer

class PlaylistDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer

class PlaylistList(generics.ListCreateAPIView):
    serializer_class = PlaylistWithUsuarioSerializer

    def get_queryset(self):
        usuario_id = self.kwargs['usuario_id']
        return Playlist.objects.filter(usuario=usuario_id)

class PlaylistInfo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistWithUsuarioSerializer


class RecomendacionList(generics.ListCreateAPIView):
    queryset = Recomendacion.objects.all()
    serializer_class = RecomendacionSerializer

class RecomendacionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recomendacion.objects.all()
    serializer_class = RecomendacionSerializer

class HistorialList(generics.ListCreateAPIView):
    queryset = Historial.objects.all()
    serializer_class = HistorialSerializer

class HistorialDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Historial.objects.all()
    serializer_class = HistorialSerializer

class HistorialPorUsuarioView(generics.RetrieveAPIView):
    serializer_class = HistorialSerializer

    def get_object(self):
        usuario_id = self.kwargs['usuario_id']
        try:
            return Historial.objects.filter(usuario=usuario_id).first()
        except Historial.DoesNotExist:
            return None


class RegistroUsuario(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]  # Permitir cualquier usuario

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(username=response.data['username'])
        return response



class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        })

class LogoutView(APIView):
    def post(self, request):
        try:
            token = request.auth
            if token:
                token.delete()
            return Response(status=status.HTTP_200_OK)
        except:
            raise
            return Response(status=status.HTTP_400_BAD_REQUEST)





@csrf_exempt
def get_recommendations(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            song_names = data.get('song_names', [])
            print(song_names)

            recommended_songs = multi_recommendations(song_names)

            return JsonResponse({'recommended_songs': recommended_songs})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
