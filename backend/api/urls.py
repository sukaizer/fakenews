from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('admin-password/', views.AdminPasswordView.as_view(), name='admin-password'),
    path('verify-password/', views.VerifyPasswordView.as_view(), name='verify-password'),
    path('profile-info/', views.ProfileCreateView.as_view(), name='profile-info'),
    path('video/<str:object_key>/', views.StreamVideoView.as_view(), name='stream_video'),
    path('interactions/', views.InteractionListCreateView.as_view(), name='interaction-list-create'),
    path('interactions/<int:pk>/', views.InteractionRetrieveUpdateDestroyView.as_view(), name='interaction-detail'),
]