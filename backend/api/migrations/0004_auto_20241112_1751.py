from django.db import migrations

def add_initial_posts(apps, schema_editor):
    Post = apps.get_model('api', 'Post')
    initial_posts = [
        '1. TikTok - Palestinian Health Ministry - Al Ahli.mp4',
        '2. X 16x9 IDF Spokesman - Al Ahli - 18-Oct-24.mp4',
        '3. TikTok - Pro-Pal Influencer - Al Ahli.mp4',
        '4. TikTok - Pro-Israel Influencer - Al-Ahli.mp4',
        '5. TikTok - Pro-Ukraine - Individual - Bucha.mp4',
        '6. TikTok - Pro-Russia - Official - Bucha.mp4',
        '7. TikTok - Pro-Ukraine - Official - Bucha.mp4',
        '8. Insta - 9x16 - Pro-Russia - VoxPop - Bucha.mp4',
    ]
    for identifier in initial_posts:
        Post.objects.create(identifier=identifier)

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_post_interaction'),
    ]

    operations = [
        migrations.RunPython(add_initial_posts),
    ]