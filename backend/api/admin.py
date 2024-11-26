from django.contrib import admin
from import_export import resources
from import_export.admin import ExportMixin
from .models import Profile, Post, Interaction, AdminSettings

class ProfileResource(resources.ModelResource):
    class Meta:
        model = Profile

class PostResource(resources.ModelResource):
    class Meta:
        model = Post

class InteractionResource(resources.ModelResource):
    class Meta:
        model = Interaction

class AdminSettingsResource(resources.ModelResource):
    class Meta:
        model = AdminSettings

@admin.register(Profile)
class ProfileAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = ProfileResource

@admin.register(Post)
class PostAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = PostResource

@admin.register(Interaction)
class InteractionAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = InteractionResource

@admin.register(AdminSettings)
class AdminSettingsAdmin(admin.ModelAdmin):
    resource_class = AdminSettingsResource
