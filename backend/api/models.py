from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    country_of_residence = models.CharField(max_length=50, default='')
    citizenship = models.CharField(max_length=50, default='')
    political_orientation = models.CharField(max_length=50)
    religion = models.CharField(max_length=50)
    ethnicity = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.id} Profile'

class Post(models.Model):
    identifier = models.CharField(max_length=255, unique=True)
    # Add other post fields as needed

    def __str__(self):
        return self.identifier

class Interaction(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='interactions')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='interactions')
    like = models.BooleanField(default=False)
    bookmark = models.BooleanField(default=False)
    comment = models.TextField(blank=True, null=True)
    share_platform = models.CharField(max_length=50, blank=True, null=True)
    share_to = models.CharField(max_length=50, blank=True, null=True)
    time_spent = models.IntegerField(default=0)
    watch_durations = models.JSONField(default=list)
    credibility_score = models.IntegerField(default=0)

    def __str__(self):
        return f"Interaction by {self.profile} on {self.post}"
    
class AdminSettings(models.Model):
    admin_password = models.CharField(max_length=255)

    def __str__(self):
        return "Admin Settings"