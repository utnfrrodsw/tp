from django.urls import path, include
from .views import ArtistaList, ArtistaDetail, AlbumList, AlbumDetail, CancionInfo, CancionList, CancionDetail, HistorialPorUsuarioView, PlaylistCreate, PlaylistInfo, UsuarioList, UsuarioDetail, PlaylistList, PlaylistDetail, RecomendacionList, RecomendacionDetail, HistorialList, HistorialDetail, CancionCreate
from .views import LogoutView, RegistroUsuario, CustomAuthToken, CancionesPorArtistaView, CancionesPorAlbumView
from . import views

urlpatterns = [
    path('register/', RegistroUsuario.as_view(), name='registro-usuario'),
    path('login/', CustomAuthToken.as_view(), name='api-token-auth'),
    path('logout/', LogoutView.as_view(), name='api-token-logout'),

    path('artistas/', ArtistaList.as_view(), name='artista-list'),
    path('artistas/<int:pk>/', ArtistaDetail.as_view(), name='artista-detail'),

    path('albums/', AlbumList.as_view(), name='album-list'),
    path('albums/<int:pk>/', AlbumDetail.as_view(), name='album-detail'),

    path('canciones-info/', CancionList.as_view(), name='cancion-list'),
    path('canciones-info/<int:pk>/', CancionInfo.as_view(), name='cancion-list'),
    path('canciones/', CancionCreate.as_view(), name='cancion-list'),
    path('canciones/<int:pk>/', CancionDetail.as_view(), name='cancion-detail'),
    path('canciones-artista/<int:artista_id>/', CancionesPorArtistaView.as_view(), name='canciones-por-artista'),
    path('canciones-album/<int:album_id>/', CancionesPorAlbumView.as_view(), name='canciones-por-album'),

    path('usuarios/', UsuarioList.as_view(), name='usuario-list'),
    path('usuarios/<int:pk>/', UsuarioDetail.as_view(), name='usuario-detail'),

    path('playlists-usuario-info/<int:usuario_id>/', PlaylistList.as_view(), name='playlist-list'),
    path('playlists-info/<int:pk>/', PlaylistInfo.as_view(), name='playlist-list'),
    path('playlists/', PlaylistCreate.as_view(), name='playlist-create'),
    path('playlists/<int:pk>/', PlaylistDetail.as_view(), name='playlist-detail'),

    path('recomendaciones/<int:pk>/', RecomendacionDetail.as_view(), name='recomendacion-detail'),
    path('recomendaciones/', views.get_recommendations, name='get_recommendations'),

    path('historiales/', HistorialList.as_view(), name='historial-list'),
    path('historiales-usuario/<int:usuario_id>/', HistorialPorUsuarioView.as_view(), name='historial-por-usuario'),
    path('historiales/<int:pk>/', HistorialDetail.as_view(), name='historial-detail'),
]
