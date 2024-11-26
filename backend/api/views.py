from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from .serializers import UserSerializer, ProfileSerializer, InteractionSerializer, AdminSettingsSerializer
from rest_framework.permissions import AllowAny
from .models import Profile, Interaction, AdminSettings
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, PermissionDenied
from django.conf import settings
from django.http import StreamingHttpResponse, HttpResponse
from botocore.exceptions import ClientError


class AdminPasswordView(generics.RetrieveUpdateAPIView):
    queryset = AdminSettings.objects.all()
    serializer_class = AdminSettingsSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        try:
            return AdminSettings.objects.first()
        except AdminSettings.DoesNotExist:
            raise NotFound("Admin settings not found.")

    def update(self, request, *args, **kwargs):
        # Only allow the admin to update the admin settings
        if request.user.is_staff:
            return super().update(request, *args, **kwargs)
        else:
            raise PermissionDenied("Only the admin can update the admin settings.")
        
class VerifyPasswordView(APIView):
    permission_classes = [AllowAny]  # Adjust permissions if necessary

    def post(self, request):
        input_password = request.data.get("password")
        if not input_password:
            return Response({"error": "Password is required"}, status=400)

        try:
            admin_settings = AdminSettings.objects.first()  # Assuming only one row exists
        except AdminSettings.DoesNotExist:
            return Response({"error": "No admin password set."}, status=404)

        if input_password == admin_settings.admin_password:
            return Response({"message": "Password verified"})
        else:
            return Response({"error": "Invalid password"}, status=403)

# View for creating a user (username, password)
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class ProfileCreateView(generics.CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save()

# class CheckProfileView(generics.RetrieveUpdateAPIView):
#     serializer_class = ProfileSerializer  # Specify the serializer class
#     permission_classes = [IsAuthenticated]

#     def get_object(self):
#         # Attempt to retrieve the profile for the currently authenticated user
#         try:
#             return self.request.user.profile
#         except Profile.DoesNotExist:
#             raise NotFound("Profile not found for the authenticated user.")
        
    # check 
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetched_objects_cache' is set, it means that we need to
            # forcibly invalidate the cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
        
class StreamVideoView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, object_key, *args, **kwargs):
        try:
            # Access the s3_client from settings
            s3_client = settings.S3CLIENT

            # Fetch the video object from R2
            response = s3_client.get_object(Bucket=settings.BUCKET_NAME, Key=object_key)

            # Stream the video content in chunks
            return StreamingHttpResponse(
                response['Body'].iter_chunks(),
                content_type=response['ContentType']  # Ensure correct MIME type for video
            )
        except ClientError as e:
            return HttpResponse(f"Error fetching video: {str(e)}", status=500)
        
class InteractionListCreateView(generics.ListCreateAPIView):
    queryset = Interaction.objects.all()
    serializer_class = InteractionSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save()

class InteractionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Interaction.objects.all()
    serializer_class = InteractionSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        # Attempt to retrieve the interaction for the given pk
        try:
            return Interaction.objects.get(pk=self.kwargs['pk'])
        except Interaction.DoesNotExist:
            raise NotFound("Interaction not found.")
