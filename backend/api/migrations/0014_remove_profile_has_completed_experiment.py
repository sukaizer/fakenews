# Generated by Django 5.1.2 on 2024-11-25 17:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_remove_profile_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='has_completed_experiment',
        ),
    ]