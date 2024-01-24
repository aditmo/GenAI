

# Create your models here.
# myapp/models.py
from django.db import models

class Table(models.Model):
    name = models.CharField(max_length=100, unique=True)
    data_definitions = models.TextField()

    def __str__(self):
        return self.name
