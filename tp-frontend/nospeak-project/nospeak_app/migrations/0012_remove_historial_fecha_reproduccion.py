# Generated by Django 4.2.4 on 2023-08-29 20:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('nospeak_app', '0011_alter_playlist_canciones'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='historial',
            name='fecha_reproduccion',
        ),
    ]
