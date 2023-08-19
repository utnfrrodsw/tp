# from django.urls import path, include
# from nospeak_app.views import *
# from rest_framework.routers import DefaultRouter, SimpleRouter

# router = DefaultRouter()
# router.register('artista', ArtistaViewSet)

# urlpatterns = [
# 	path('register', UserRegister.as_view(), name='register'),
# 	path('login', UserLogin.as_view(), name='login'),
# 	path('logout', UserLogout.as_view(), name='logout'),
# 	path('user', UserView.as_view(), name='user'),
#     path('', include(router.urls)),
#     # path('list/', index, name='polls_list'),
#     # path('<int:id>/details/', details, name="poll_details"),
#     # path('<int:id>/', vote_poll, name="poll_vote")
# ]


# # path('poll/', PollAPIView.as_view()),
# # path('poll/<int:id>/', PollDetailView.as_view()),
# # path('generics/poll/', poll_list_view),
# # path('generics/poll/<int:id>/', PollListView.as_view()),
# # path('poll/search/', QuestionSearchViewSet.as_view({'get': 'list'})),

# # from rest_framework import routers
# # from .views import *

# # router = routers.DefaultRouter()
# # router.register(f'usuarios', UsuarioView, 'usuarios')

# # urlpatterns = [
# #     path('api/v1', include(router.urls)),
# # ]

from django.urls import path, include
from .views import ArtistaList, ArtistaDetail, AlbumList, AlbumDetail, CancionList, CancionDetail, UsuarioList, UsuarioDetail, PlaylistList, PlaylistDetail, RecomendacionList, RecomendacionDetail, HistorialList, HistorialDetail
from .views import LogoutView, RegistroUsuario, CustomAuthToken

urlpatterns = [
    path('register/', RegistroUsuario.as_view(), name='registro-usuario'),
    path('login/', CustomAuthToken.as_view(), name='api-token-auth'),
    path('logout/', LogoutView.as_view(), name='api-token-logout'),

    path('artistas/', ArtistaList.as_view(), name='artista-list'),
    path('artistas/<int:pk>/', ArtistaDetail.as_view(), name='artista-detail'),

    path('albums/', AlbumList.as_view(), name='album-list'),
    path('albums/<int:pk>/', AlbumDetail.as_view(), name='album-detail'),

    path('canciones/', CancionList.as_view(), name='cancion-list'),
    path('canciones/<int:pk>/', CancionDetail.as_view(), name='cancion-detail'),

    path('usuarios/', UsuarioList.as_view(), name='usuario-list'),
    path('usuarios/<int:pk>/', UsuarioDetail.as_view(), name='usuario-detail'),

    path('playlists/', PlaylistList.as_view(), name='playlist-list'),
    path('playlists/<int:pk>/', PlaylistDetail.as_view(), name='playlist-detail'),

    path('recomendaciones/', RecomendacionList.as_view(), name='recomendacion-list'),
    path('recomendaciones/<int:pk>/', RecomendacionDetail.as_view(), name='recomendacion-detail'),

    path('historiales/', HistorialList.as_view(), name='historial-list'),
    path('historiales/<int:pk>/', HistorialDetail.as_view(), name='historial-detail'),
]
