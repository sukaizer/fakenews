# Generated by Django 5.1.2 on 2024-10-26 14:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='ethnicity',
            field=models.CharField(choices=[('C', 'Caucasian'), ('B', 'Black'), ('A', 'Asian'), ('H', 'Hispanic'), ('O', 'Other')], max_length=1),
        ),
        migrations.AlterField(
            model_name='profile',
            name='nationality',
            field=models.CharField(choices=[('US', 'United States'), ('CA', 'Canada'), ('GB', 'United Kingdom'), ('IN', 'India')], max_length=2),
        ),
        migrations.AlterField(
            model_name='profile',
            name='political_orientation',
            field=models.CharField(choices=[('L', 'Liberal'), ('C', 'Conservative'), ('S', 'Socialist'), ('O', 'Other')], max_length=1),
        ),
        migrations.AlterField(
            model_name='profile',
            name='religion',
            field=models.CharField(choices=[('C', 'Christianity'), ('I', 'Islam'), ('H', 'Hinduism'), ('B', 'Buddhism'), ('O', 'Other')], max_length=2),
        ),
    ]