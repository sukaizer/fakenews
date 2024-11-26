from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Interaction, AdminSettings

class AdminSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminSettings
        fields = ['id', 'admin_password']

    def update(self, instance, validated_data):
        # Call the super method to update the admin settings
        return super().update(instance, validated_data)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'age', 'gender', 'country_of_residence', 'citizenship', 'political_orientation', 'religion', 'ethnicity']
            
        def create(self, validated_data):
            # Call the super method to create the profile
            return super().create(validated_data)

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Separate profile data, if it exists
        # profile_data = validated_data.pop('profile', None)
        user = User.objects.create_user(**validated_data)

        # Create Profile only if profile data is provided
        # if profile_data:
        #     Profile.objects.create(user=user, **profile_data)

        return user
    
class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interaction
        fields = ['id', 'profile', 'post', 'like', 'bookmark', 'comment', 'share_platform', 'share_to', 'time_spent', 'watch_durations', 'credibility_score']

    def create(self, validated_data):
        # Call the super method to create the interaction
        return super().create(validated_data)